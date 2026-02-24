// FILE: src/viewer.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// Premade STEP hooks (Replicad + OC in main thread)
import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import * as replicad from "replicad";
import { setOC } from "replicad";

export type MeshPayload = {
  positions: number[];
  normals?: number[];
  indices: number[];
};

type XYZ = { x: number; y: number; z: number };

type SectionStencilPair = {
  back: THREE.Mesh;
  front: THREE.Mesh;
};

export class Viewer {
  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private controls: any;

  private originAxes: THREE.AxesHelper;
  private originDot: THREE.Mesh;

  private axisScene: THREE.Scene;
  private axisCamera: THREE.PerspectiveCamera;
  private axisHelper: THREE.AxesHelper;
  private axisViewportSize = 120;
  private axisViewportPadding = 10;

  private mesh: THREE.Mesh | null = null;

  private modelVisible = true;

  setModelVisible(v: boolean) {
    this.modelVisible = !!v;
    if (this.mesh) this.mesh.visible = this.modelVisible;
  }

  // -----------------------------
  // Section cut (viewer-only clipping plane) + STENCIL CAP
  // -----------------------------
  private sectionCutEnabled = false;
  private sectionCutFlip = false;
  private sectionCutPlaneMode: "XZ" | "XY" = "XZ"; // XZ = section (cut by Y), XY = plan (cut by Z)
  private sectionCutOffset = 0;

  // Keep one plane instance; mutate it.
  // Base convention (no flip):
  // - XZ mode: plane at y = offset, normal (0, -1, 0)
  // - XY mode: plane at z = offset, normal (0, 0, -1)
  private sectionPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

  // Stencil-cap system (viewer-only, no geometry rebuild)
  private sectionCapEnabled = true; // cap renders when sectionCutEnabled && sectionCapEnabled

  private stencilBackMaterial: THREE.MeshBasicMaterial;
  private stencilFrontMaterial: THREE.MeshBasicMaterial;
  private capMaterial: THREE.MeshStandardMaterial;

  private capMesh: THREE.Mesh;
  private capSize = 200000; // big plane to cover scene objects

  // Track stencil meshes we create so we can remove/cleanup
  private sectionStencils: SectionStencilPair[] = [];

  private applyClippingToMaterial(mat: THREE.Material | THREE.Material[] | null | undefined) {
    if (!mat) return;

    const applyOne = (m: any) => {
      if (this.sectionCutEnabled) {
        m.clippingPlanes = [this.sectionPlane];
        m.clipShadows = true;
      } else {
        m.clippingPlanes = [];
        m.clipShadows = false;
      }
      m.needsUpdate = true;
    };

    if (Array.isArray(mat)) mat.forEach(applyOne);
    else applyOne(mat as any);
  }

  private applyClippingToObject(obj: THREE.Object3D | null | undefined) {
    if (!obj) return;
    obj.traverse((child: any) => {
      if (child?.isMesh) this.applyClippingToMaterial(child.material);
    });
  }

  private applySectionCutToAll() {
    if (this.mesh) this.applyClippingToMaterial(this.mesh.material as any);

    if (this.shoePivot) this.applyClippingToObject(this.shoePivot);

    for (const p of this.footpadPivots) if (p) this.applyClippingToObject(p);
    for (const p of this.hookPivots) if (p) this.applyClippingToObject(p);

    this.applyStencilState();
  }

  private recomputeSectionPlane() {
    // Build the "unflipped" plane first
    if (this.sectionCutPlaneMode === "XZ") {
      // y = offset
      this.sectionPlane.normal.set(0, -1, 0);
      this.sectionPlane.constant = this.sectionCutOffset;
    } else {
      // z = offset
      this.sectionPlane.normal.set(0, 0, -1);
      this.sectionPlane.constant = this.sectionCutOffset;
    }

    // Flip should keep plane location but invert kept side:
    // Negate BOTH normal and constant to keep the same geometric plane.
    if (this.sectionCutFlip) {
      this.sectionPlane.normal.multiplyScalar(-1);
      this.sectionPlane.constant *= -1;
    }

    this.updateCapTransform();
  }

  private applyStencilState() {
    const capOn = this.sectionCutEnabled && this.sectionCapEnabled;

    // cap mesh visibility
    this.capMesh.visible = capOn;

    // stencil meshes visibility
    for (const s of this.sectionStencils) {
      s.back.visible = capOn;
      s.front.visible = capOn;
    }

    // keep stencil materials' clipping in sync (when enabled)
    // When disabled we still keep them, but invisible.
    this.stencilBackMaterial.clippingPlanes = capOn ? [this.sectionPlane] : [];
    this.stencilFrontMaterial.clippingPlanes = capOn ? [this.sectionPlane] : [];
    this.stencilBackMaterial.needsUpdate = true;
    this.stencilFrontMaterial.needsUpdate = true;
  }

  private updateCapTransform() {
    // Align cap plane to the current section plane mode/offset
    // - XZ mode: cap lies in XZ plane at y=offset, normal along +/-Y
    // - XY mode: cap lies in XY plane at z=offset, normal along +/-Z
    if (this.sectionCutPlaneMode === "XZ") {
      this.capMesh.position.set(0, this.sectionCutOffset, 0);
      this.capMesh.rotation.set(-Math.PI / 2, 0, 0); // make plane normal +Y
    } else {
      this.capMesh.position.set(0, 0, this.sectionCutOffset);
      this.capMesh.rotation.set(0, 0, 0); // plane normal +Z
    }
    this.capMesh.updateMatrixWorld();
  }

  private clearSectionStencils() {
    for (const s of this.sectionStencils) {
      // remove from whatever parent they are on
      if (s.back.parent) s.back.parent.remove(s.back);
      if (s.front.parent) s.front.parent.remove(s.front);
      // Do NOT dispose geometry: it is shared with the visible mesh geometry.
    }
    this.sectionStencils = [];
  }

  private addSectionStencilsForMesh(mesh: THREE.Mesh) {
    const geo = mesh.geometry as THREE.BufferGeometry | undefined;
    if (!geo) return;

    const back = new THREE.Mesh(geo, this.stencilBackMaterial);
    const front = new THREE.Mesh(geo, this.stencilFrontMaterial);

    back.name = `${mesh.name || "mesh"}__stencilBack`;
    front.name = `${mesh.name || "mesh"}__stencilFront`;

    back.frustumCulled = mesh.frustumCulled;
    front.frustumCulled = mesh.frustumCulled;

    // Render order:
    //  - Stencil passes first
    //  - Cap after
    //  - Visible meshes later
    back.renderOrder = -100;
    front.renderOrder = -100;

    const parent = mesh.parent ?? this.scene;
    parent.add(back);
    parent.add(front);

    this.sectionStencils.push({ back, front });

    this.applyStencilState();
  }

  private addSectionStencilsForObject(obj: THREE.Object3D) {
    obj.traverse((child: any) => {
      if (child?.isMesh) this.addSectionStencilsForMesh(child as THREE.Mesh);
    });
  }

  private rebuildSectionStencils() {
    this.clearSectionStencils();

    if (this.mesh) this.addSectionStencilsForMesh(this.mesh);

    if (this.shoePivot) this.addSectionStencilsForObject(this.shoePivot);

    for (const p of this.footpadPivots) if (p) this.addSectionStencilsForObject(p);
    for (const p of this.hookPivots) if (p) this.addSectionStencilsForObject(p);

    this.applyStencilState();
  }

  // New combined API used by main.ts
  setSectionCut(opts: { enabled: boolean; flip: boolean; plane: "XZ" | "XY"; offset: number }) {
    this.sectionCutEnabled = !!opts.enabled;
    this.sectionCutFlip = !!opts.flip;
    this.sectionCutPlaneMode = opts.plane === "XY" ? "XY" : "XZ";

    const off = Number(opts.offset);
    this.sectionCutOffset = Number.isFinite(off) ? off : 0;

    // keep enabled globally; turning planes on/off is enough
    this.renderer.localClippingEnabled = true;

    this.recomputeSectionPlane();
    this.applySectionCutToAll();
  }

  // Backward-compatible wrappers (safe to keep; optional)
  setSectionCutEnabled(v: boolean) {
    this.setSectionCut({
      enabled: !!v,
      flip: this.sectionCutFlip,
      plane: this.sectionCutPlaneMode,
      offset: this.sectionCutOffset,
    });
  }

  // Legacy name retained; acts as XZ mode offset setter
  setSectionCutY(y: number) {
    this.setSectionCut({
      enabled: this.sectionCutEnabled,
      flip: this.sectionCutFlip,
      plane: "XZ",
      offset: y,
    });
  }

  // Optional helper if you want to toggle cap without touching main.ts
  setSectionCapEnabled(v: boolean) {
    this.sectionCapEnabled = !!v;
    this.applyStencilState();
  }

  // -----------------------------
  // Baseplate visualization (CONTROL POINTS ONLY)
  // -----------------------------
  private baseplateVizVisible = false;

  private baseplateVizGroup: THREE.Group;
  private baseplateCtrlGroup: THREE.Group;

  private ctrlMeshes: THREE.Mesh[] = [];

  private ctrlSphereGeo: THREE.SphereGeometry;

  private ctrlMatBlue: THREE.MeshBasicMaterial;
  private ctrlMatBlue2: THREE.MeshBasicMaterial;

  setBaseplateVizVisible(v: boolean) {
    this.baseplateVizVisible = !!v;
    this.baseplateVizGroup.visible = this.baseplateVizVisible;
  }

  setControlPoints(points: XYZ[]) {
    this.ensureCtrlCount(points.length);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const m = this.ctrlMeshes[i];
      m.position.set(p.x, p.y, p.z);
    }
  }

  private ensureCtrlCount(n: number) {
    while (this.ctrlMeshes.length > n) {
      const m = this.ctrlMeshes.pop()!;
      this.baseplateCtrlGroup.remove(m);
    }
    while (this.ctrlMeshes.length < n) {
      const idx = this.ctrlMeshes.length;
      const mat = idx === 0 || idx === 3 ? this.ctrlMatBlue2 : this.ctrlMatBlue;

      const m = new THREE.Mesh(this.ctrlSphereGeo, mat);
      m.name = `ctrlPoint${idx + 1}`;
      m.renderOrder = 50;
      this.baseplateCtrlGroup.add(m);
      this.ctrlMeshes.push(m);
    }
  }

  // -----------------------------
  // Arc visualization (3 points each)
  // -----------------------------
  private arcVizGroup: THREE.Group;

  private aArcGroup: THREE.Group;
  private bArcGroup: THREE.Group;
  private cArcGroup: THREE.Group;
  private heelArcGroup: THREE.Group;

  private aArcMeshes: THREE.Mesh[] = [];
  private bArcMeshes: THREE.Mesh[] = [];
  private cArcMeshes: THREE.Mesh[] = [];
  private heelArcMeshes: THREE.Mesh[] = [];

  private arcSphereGeo: THREE.SphereGeometry;

  private aArcMats: THREE.MeshBasicMaterial[] = [];
  private bArcMats: THREE.MeshBasicMaterial[] = [];
  private cArcMats: THREE.MeshBasicMaterial[] = [];
  private heelArcMats: THREE.MeshBasicMaterial[] = [];

  private aArcVisible = false;
  private bArcVisible = false;
  private cArcVisible = false;
  private heelArcVisible = false;

  private setArcGroupVisible(group: THREE.Group, v: boolean) {
    group.visible = !!v;
  }

  private ensureArcCount(
    meshes: THREE.Mesh[],
    group: THREE.Group,
    n: number,
    mats3: THREE.Material[],
    namePrefix: string
  ) {
    while (meshes.length > n) {
      const m = meshes.pop()!;
      group.remove(m);
    }
    while (meshes.length < n) {
      const idx = meshes.length;
      const mat = mats3[idx % mats3.length];

      const m = new THREE.Mesh(this.arcSphereGeo, mat);
      m.name = `${namePrefix}${idx + 1}`;
      m.renderOrder = 60;
      group.add(m);
      meshes.push(m);
    }

    for (let i = 0; i < meshes.length; i++) {
      meshes[i].material = mats3[i % mats3.length];
    }
  }

  private setArcPoints(
    meshes: THREE.Mesh[],
    group: THREE.Group,
    points: XYZ[],
    mats3: THREE.Material[],
    namePrefix: string
  ) {
    const n = points.length;
    this.ensureArcCount(meshes, group, n, mats3, namePrefix);
    for (let i = 0; i < n; i++) {
      const p = points[i];
      meshes[i].position.set(p.x, p.y, p.z);
    }
  }

  setAArcVizVisible(v: boolean) {
    this.aArcVisible = !!v;
    this.setArcGroupVisible(this.aArcGroup, this.aArcVisible);
  }
  setBArcVizVisible(v: boolean) {
    this.bArcVisible = !!v;
    this.setArcGroupVisible(this.bArcGroup, this.bArcVisible);
  }
  setCArcVizVisible(v: boolean) {
    this.cArcVisible = !!v;
    this.setArcGroupVisible(this.cArcGroup, this.cArcVisible);
  }
  setHeelArcVizVisible(v: boolean) {
    this.heelArcVisible = !!v;
    this.setArcGroupVisible(this.heelArcGroup, this.heelArcVisible);
  }

  setAArcPoints(points: XYZ[]) {
    this.setArcPoints(this.aArcMeshes, this.aArcGroup, points, this.aArcMats, "aArcPt");
  }
  setBArcPoints(points: XYZ[]) {
    this.setArcPoints(this.bArcMeshes, this.bArcGroup, points, this.bArcMats, "bArcPt");
  }
  setCArcPoints(points: XYZ[]) {
    this.setArcPoints(this.cArcMeshes, this.cArcGroup, points, this.cArcMats, "cArcPt");
  }
  setHeelArcPoints(points: XYZ[]) {
    this.setArcPoints(this.heelArcMeshes, this.heelArcGroup, points, this.heelArcMats, "heelArcPt");
  }

  // -----------------------------
  // Reference shoe (STL/OBJ) via PIVOT
  // -----------------------------
  private shoePivot: THREE.Group | null = null;
  private shoeRoot: THREE.Object3D | null = null;
  private shoeMaterial: THREE.MeshStandardMaterial | null = null;
  private shoeRequested = false;

  private shoeVisible = true;
  private shoeScale = 1.0;
  private shoeTransparency = 0.5;
  private shoeUnitScale = 1.0;

  private shoeRotDeg: XYZ = { x: 0, y: 0, z: 0 };
  private shoeOffset: XYZ = { x: 0, y: 0, z: 0 };

  private onShoeStatus?: (line: string) => void;

  // -----------------------------
  // Reference footpads (3x STL) via PIVOTS
  // -----------------------------
  private footpadPivots: Array<THREE.Group | null> = [null, null, null];
  private footpadRoots: Array<THREE.Object3D | null> = [null, null, null];
  private footpadMaterials: Array<THREE.MeshStandardMaterial | null> = [null, null, null];

  private footpadRequested: boolean[] = [false, false, false];
  private footpadVisible: boolean[] = [false, false, false];

  private footpadUnitScale = 1.0;
  private footpadScale = 1.0;
  private footpadRotDeg: XYZ = { x: 0, y: 0, z: 0 };
  private footpadOffset: XYZ = { x: 0, y: 0, z: 0 };

  // -----------------------------
  // Premade Hooks (4x STEP) via PIVOTS
  // -----------------------------
  private hookPivots: Array<THREE.Group | null> = [null, null, null, null];
  private hookRoots: Array<THREE.Object3D | null> = [null, null, null, null];
  private hookMaterials: Array<THREE.MeshStandardMaterial | null> = [null, null, null, null];
  private hookRequested: boolean[] = [false, false, false, false];
  private hookVisible: boolean[] = [false, false, false, false];

  private hookBaseOffset: XYZ = { x: -5, y: 98, z: 33 };
  private hookBaseRotDeg: XYZ = { x: 90, y: 0, z: 0 };

  private hookDeltaOffset: XYZ = { x: 0, y: 0, z: 0 };
  private hookDeltaRotDeg: XYZ = { x: 0, y: 0, z: 0 };

  private hookOpacity = 1.0;

  private ocLoaded = false;
  private ocLoadingPromise: Promise<void> | null = null;

  private hasFramedOnce = false;

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // IMPORTANT: stencil must be enabled for section cap
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, stencil: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0b0b0f, 1);
    this.renderer.autoClear = true;
    this.renderer.autoClearColor = true;
    this.renderer.autoClearDepth = true;
    this.renderer.autoClearStencil = true;

    // enable clipping for section cut
    this.renderer.localClippingEnabled = true;

    this.scene = new THREE.Scene();
    this.scene.up.set(0, 0, 1);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(200, 160, 200);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.rotateSpeed = 0.6;
    this.controls.zoomSpeed = 0.9;
    this.controls.panSpeed = 0.7;
    this.controls.screenSpacePanning = false;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 0.9);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(3, 6, 4);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.65);
    fill.position.set(-6, 2, 3);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(0, 5, -8);
    this.scene.add(rim);

    const amb = new THREE.AmbientLight(0xffffff, 0.12);
    this.scene.add(amb);

    this.originAxes = new THREE.AxesHelper(40);
    this.scene.add(this.originAxes);

    this.originDot = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.scene.add(this.originDot);

    this.axisScene = new THREE.Scene();
    this.axisScene.up.set(0, 0, 1);

    this.axisCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    this.axisCamera.up.copy(this.camera.up);
    this.axisCamera.position.set(2.5, 2.5, 2.5);
    this.axisCamera.lookAt(0, 0, 0);

    this.axisHelper = new THREE.AxesHelper(1.2);
    this.axisScene.add(this.axisHelper);

    this.baseplateVizGroup = new THREE.Group();
    this.baseplateVizGroup.name = "baseplateVizGroup";
    this.baseplateVizGroup.visible = false;

    this.baseplateCtrlGroup = new THREE.Group();
    this.baseplateCtrlGroup.name = "baseplateCtrlGroup";

    this.baseplateVizGroup.add(this.baseplateCtrlGroup);
    this.scene.add(this.baseplateVizGroup);

    this.ctrlSphereGeo = new THREE.SphereGeometry(2.8, 16, 16);
    this.ctrlMatBlue = new THREE.MeshBasicMaterial({ color: 0x2d7cff });
    this.ctrlMatBlue2 = new THREE.MeshBasicMaterial({ color: 0x1aa3ff });

    this.arcVizGroup = new THREE.Group();
    this.arcVizGroup.name = "arcVizGroup";
    this.arcVizGroup.visible = true;
    this.scene.add(this.arcVizGroup);

    this.aArcGroup = new THREE.Group();
    this.aArcGroup.name = "aArcGroup";
    this.aArcGroup.visible = false;
    this.arcVizGroup.add(this.aArcGroup);

    this.bArcGroup = new THREE.Group();
    this.bArcGroup.name = "bArcGroup";
    this.bArcGroup.visible = false;
    this.arcVizGroup.add(this.bArcGroup);

    this.cArcGroup = new THREE.Group();
    this.cArcGroup.name = "cArcGroup";
    this.cArcGroup.visible = false;
    this.arcVizGroup.add(this.cArcGroup);

    this.heelArcGroup = new THREE.Group();
    this.heelArcGroup.name = "heelArcGroup";
    this.heelArcGroup.visible = false;
    this.arcVizGroup.add(this.heelArcGroup);

    this.arcSphereGeo = new THREE.SphereGeometry(2.2, 16, 16);

    this.aArcMats = [
      new THREE.MeshBasicMaterial({ color: 0xffcc00 }),
      new THREE.MeshBasicMaterial({ color: 0xffee66 }),
      new THREE.MeshBasicMaterial({ color: 0xffaa00 }),
    ];

    this.bArcMats = [
      new THREE.MeshBasicMaterial({ color: 0xff66cc }),
      new THREE.MeshBasicMaterial({ color: 0xcc66ff }),
      new THREE.MeshBasicMaterial({ color: 0xff99dd }),
    ];

    this.cArcMats = [
      new THREE.MeshBasicMaterial({ color: 0x66ff66 }),
      new THREE.MeshBasicMaterial({ color: 0x33cc99 }),
      new THREE.MeshBasicMaterial({ color: 0x99ff99 }),
    ];

    this.heelArcMats = [
      new THREE.MeshBasicMaterial({ color: 0xff8844 }),
      new THREE.MeshBasicMaterial({ color: 0xff4444 }),
      new THREE.MeshBasicMaterial({ color: 0xffbb66 }),
    ];

    // -----------------------------
    // Build stencil-cap materials + cap mesh (once)
    // -----------------------------
    this.stencilBackMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      clippingPlanes: [], // set by applyStencilState()
      stencilWrite: true,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.KeepStencilOp,
      stencilZPass: THREE.IncrementWrapStencilOp,
      colorWrite: false,
      depthWrite: false,
      depthTest: true,
    });

    this.stencilFrontMaterial = new THREE.MeshBasicMaterial({
      side: THREE.FrontSide,
      clippingPlanes: [], // set by applyStencilState()
      stencilWrite: true,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.KeepStencilOp,
      stencilZPass: THREE.DecrementWrapStencilOp,
      colorWrite: false,
      depthWrite: false,
      depthTest: true,
    });

    this.capMaterial = new THREE.MeshStandardMaterial({
      color: 0x9a9aa0,
      metalness: 0.0,
      roughness: 0.85,
      side: THREE.DoubleSide,
      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: THREE.NotEqualStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp,
      depthWrite: true,
      depthTest: true,
    });

    this.capMesh = new THREE.Mesh(new THREE.PlaneGeometry(this.capSize, this.capSize), this.capMaterial);
    this.capMesh.name = "sectionCapPlane";
    this.capMesh.renderOrder = -50; // after stencils (-100), before visible meshes
    this.capMesh.visible = false;
    this.scene.add(this.capMesh);

    this.updateCapTransform();
    this.applyStencilState();

    window.addEventListener("resize", () => this.resize());
    this.resize();

    this.animate();
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setOnShoeStatus(cb: (line: string) => void) {
    this.onShoeStatus = cb;
  }
  private log(line: string) {
    if (this.onShoeStatus) this.onShoeStatus(line);
  }

  private disposeObjectGeometries(obj: THREE.Object3D) {
    obj.traverse((child: any) => {
      if (child?.isMesh) {
        const geo = child.geometry as THREE.BufferGeometry | undefined;
        if (geo) geo.dispose();
        const mat = child.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      }
    });
  }

  private centerUnderPivot(root: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    box.getCenter(center);
    root.position.sub(center);
    return box;
  }

  private async ensureOC() {
    if (this.ocLoaded) return;
    if (this.ocLoadingPromise) return this.ocLoadingPromise;

    this.ocLoadingPromise = (async () => {
      this.log("hooks: loading opencascade...");
      const raw = await (opencascade as any)({ locateFile: () => opencascadeWasm });
      const OC: any = (raw as any)?.default ?? raw;
      setOC(OC);
      this.ocLoaded = true;
      this.log("hooks: opencascade ready");
    })();

    return this.ocLoadingPromise;
  }

  private clearShoe() {
    if (this.shoePivot) this.scene.remove(this.shoePivot);
    if (this.shoeRoot) this.disposeObjectGeometries(this.shoeRoot);

    this.shoePivot = null;
    this.shoeRoot = null;

    if (this.shoeMaterial) {
      this.shoeMaterial.dispose();
      this.shoeMaterial = null;
    }

    this.shoeRequested = false;

    // stencils depend on existing meshes
    this.rebuildSectionStencils();
  }

  private applyShoeState() {
    if (!this.shoePivot) return;

    this.shoePivot.visible = this.shoeVisible;

    const s = this.shoeScale * this.shoeUnitScale;
    this.shoePivot.scale.set(s, s, s);

    this.shoePivot.rotation.order = "ZXY";

    const rx = (this.shoeRotDeg.x * Math.PI) / 180;
    const ry = (this.shoeRotDeg.y * Math.PI) / 180;
    const rz = (this.shoeRotDeg.z * Math.PI) / 180;
    this.shoePivot.rotation.set(rx, ry, rz);

    this.shoePivot.position.set(this.shoeOffset.x, this.shoeOffset.y, this.shoeOffset.z);

    if (this.shoeMaterial) {
      this.shoeMaterial.opacity = 1 - this.shoeTransparency;
      this.shoeMaterial.transparent = this.shoeMaterial.opacity < 1;
      this.shoeMaterial.needsUpdate = true;
    }
  }

  setShoeUnitScale(unitScale: number) {
    const u = Number(unitScale);
    if (!Number.isFinite(u) || u <= 0) return;
    this.shoeUnitScale = u;
    this.applyShoeState();
    this.log(`shoe: unitScale=${this.shoeUnitScale}`);
  }

  setShoeRotationDeg(x: number, y: number, z: number) {
    this.shoeRotDeg = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    this.applyShoeState();
  }

  setShoeOffset(x: number, y: number, z: number) {
    this.shoeOffset = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    this.applyShoeState();
  }

  setShoeVisible(v: boolean) {
    this.shoeVisible = !!v;
    this.applyShoeState();
  }

  setShoeScale(scale: number) {
    const s = Number.isFinite(scale) ? Math.max(0.01, scale) : 1.0;
    this.shoeScale = s;
    this.applyShoeState();
  }

  setShoeTransparency(t: number) {
    const tt = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0.5;
    this.shoeTransparency = tt;
    this.applyShoeState();
  }

  loadOBJ(url: string) {
    if (this.shoeRequested) return;
    this.shoeRequested = true;

    this.log(`shoe: loading OBJ ${url}`);

    const loader = new OBJLoader();
    loader.load(
      url,
      (object: any) => {
        this.clearShoe();

        const mat = new THREE.MeshStandardMaterial({
          color: 0xff4444,
          metalness: 0.0,
          roughness: 0.95,
          transparent: true,
          opacity: 1 - this.shoeTransparency,
          depthWrite: false,
        });

        this.applyClippingToMaterial(mat);

        object.traverse((child: any) => {
          if (child?.isMesh) child.material = mat;
        });

        const pivot = new THREE.Group();
        pivot.name = "shoePivot";

        this.centerUnderPivot(object);
        pivot.add(object);

        this.shoePivot = pivot;
        this.shoeRoot = object;
        this.shoeMaterial = mat;

        this.applyShoeState();
        this.scene.add(pivot);

        // stencils
        this.rebuildSectionStencils();

        this.log(`shoe: OBJ loaded OK`);
      },
      undefined,
      (err: any) => {
        console.error("OBJ load failed:", err);
        this.log(`shoe: OBJ load FAILED (check /public path and filename)`);
        this.shoeRequested = false;
      }
    );
  }

  loadShoe(url: string) {
    if (this.shoeRequested) return;
    this.shoeRequested = true;

    this.log(`shoe: loading STL ${url}`);

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry: any) => {
        this.clearShoe();

        const mat = new THREE.MeshStandardMaterial({
          metalness: 0.0,
          roughness: 0.95,
          transparent: true,
          opacity: 1 - this.shoeTransparency,
          depthWrite: false,
        });

        this.applyClippingToMaterial(mat);

        const mesh = new THREE.Mesh(geometry, mat);

        const pivot = new THREE.Group();
        pivot.name = "shoePivot";

        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (box) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          mesh.position.sub(center);
        }

        pivot.add(mesh);

        this.shoePivot = pivot;
        this.shoeRoot = mesh;
        this.shoeMaterial = mat;

        this.applyShoeState();
        this.scene.add(pivot);

        // stencils
        this.rebuildSectionStencils();

        this.log(`shoe: STL loaded OK`);
      },
      undefined,
      (err: any) => {
        console.error("Failed to load shoe STL:", url, err);
        this.log(`shoe: STL load FAILED (check /public path and filename)`);
        this.shoeRequested = false;
      }
    );
  }

  private applyFootpadState(i: number) {
    const pivot = this.footpadPivots[i];
    if (!pivot) return;

    pivot.visible = !!this.footpadVisible[i];

    const s = this.footpadScale * this.footpadUnitScale;
    pivot.scale.set(s, s, s);

    const rx = (this.footpadRotDeg.x * Math.PI) / 180;
    const ry = (this.footpadRotDeg.y * Math.PI) / 180;
    const rz = (this.footpadRotDeg.z * Math.PI) / 180;
    pivot.rotation.set(rx, ry, rz);

    pivot.position.set(this.footpadOffset.x, this.footpadOffset.y, this.footpadOffset.z);
  }

  private clearFootpad(i: number) {
    const pivot = this.footpadPivots[i];
    if (pivot) this.scene.remove(pivot);

    const root = this.footpadRoots[i];
    if (root) this.disposeObjectGeometries(root);

    this.footpadPivots[i] = null;
    this.footpadRoots[i] = null;

    const mat = this.footpadMaterials[i];
    if (mat) mat.dispose();
    this.footpadMaterials[i] = null;

    // stencils
    this.rebuildSectionStencils();
  }

  loadFootpad(slot: 1 | 2 | 3, url: string) {
    const i = slot - 1;
    if (this.footpadRequested[i]) return;
    this.footpadRequested[i] = true;

    this.log(`footpad${slot}: loading STL ${url}`);

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry: any) => {
        this.clearFootpad(i);

        const mat = new THREE.MeshStandardMaterial({
          color: 0x22cc66,
          metalness: 0.0,
          roughness: 0.9,
          transparent: false,
          opacity: 1.0,
        });

        this.applyClippingToMaterial(mat);

        const mesh = new THREE.Mesh(geometry, mat);

        const pivot = new THREE.Group();
        pivot.name = `footpadPivot${slot}`;

        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (box) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          mesh.position.sub(center);
        }

        pivot.add(mesh);

        this.footpadPivots[i] = pivot;
        this.footpadRoots[i] = mesh;
        this.footpadMaterials[i] = mat;

        this.applyFootpadState(i);

        pivot.renderOrder = -2;
        this.scene.add(pivot);

        // stencils
        this.rebuildSectionStencils();

        this.log(`footpad${slot}: loaded OK`);
      },
      undefined,
      (err: any) => {
        console.error(`Failed to load footpad ${slot} STL:`, url, err);
        this.footpadRequested[i] = false;
        this.log(`footpad${slot}: load FAILED (check /public path and filename)`);
      }
    );
  }

  setFootpadVisible(slot: 1 | 2 | 3, v: boolean) {
    const i = slot - 1;
    this.footpadVisible[i] = !!v;
    this.applyFootpadState(i);
  }

  setFootpadUnitScale(unitScale: number) {
    const u = Number(unitScale);
    if (!Number.isFinite(u) || u <= 0) return;
    this.footpadUnitScale = u;
    for (let i = 0; i < 3; i++) this.applyFootpadState(i);
  }

  setFootpadScale(scale: number) {
    const s = Number.isFinite(scale) ? Math.max(0.01, scale) : 1.0;
    this.footpadScale = s;
    for (let i = 0; i < 3; i++) this.applyFootpadState(i);
  }

  setFootpadRotationDeg(x: number, y: number, z: number) {
    this.footpadRotDeg = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    for (let i = 0; i < 3; i++) this.applyFootpadState(i);
  }

  setFootpadOffset(x: number, y: number, z: number) {
    this.footpadOffset = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    for (let i = 0; i < 3; i++) this.applyFootpadState(i);
  }

  private applyHookState(i: number) {
    const pivot = this.hookPivots[i];
    if (!pivot) return;

    pivot.visible = !!this.hookVisible[i];

    pivot.position.set(
      this.hookBaseOffset.x + this.hookDeltaOffset.x,
      this.hookBaseOffset.y + this.hookDeltaOffset.y,
      this.hookBaseOffset.z + this.hookDeltaOffset.z
    );

    pivot.rotation.order = "ZXY";

    const planZDeg = (this.hookDeltaRotDeg.z || 0) + (this.hookDeltaRotDeg.y || 0);

    const rx = ((this.hookBaseRotDeg.x + this.hookDeltaRotDeg.x) * Math.PI) / 180;
    const ry = (this.hookBaseRotDeg.y * Math.PI) / 180;
    const rz = ((this.hookBaseRotDeg.z + planZDeg) * Math.PI) / 180;

    pivot.rotation.set(rx, ry, rz);
  }

  private clearHook(i: number) {
    const pivot = this.hookPivots[i];
    if (pivot) this.scene.remove(pivot);

    const root = this.hookRoots[i];
    if (root) this.disposeObjectGeometries(root);

    this.hookPivots[i] = null;
    this.hookRoots[i] = null;

    const mat = this.hookMaterials[i];
    if (mat) mat.dispose();
    this.hookMaterials[i] = null;

    // stencils
    this.rebuildSectionStencils();
  }

  async loadHookSTEP(slot: 1 | 2 | 3 | 4, url: string) {
    const i = slot - 1;
    if (this.hookRequested[i]) return;
    this.hookRequested[i] = true;

    try {
      await this.ensureOC();

      this.log(`hook${slot}: loading STEP ${url}`);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
      const blob = await resp.blob();

      const imported = await (replicad as any).importSTEP(blob);
      const shape =
        (imported && (imported.shape || imported)) ??
        (Array.isArray(imported) ? imported[0]?.shape ?? imported[0] : imported);

      if (!shape || typeof shape.mesh !== "function") {
        throw new Error("importSTEP did not produce a meshable shape");
      }

      const faces = shape.mesh({ tolerance: 0.5 });
      const positions = (faces as any).positions ?? (faces as any).vertices;
      const indices = (faces as any).indices ?? (faces as any).triangles;
      const normals = (faces as any).normals;

      if (!positions || !indices) throw new Error("STEP mesh missing positions/indices");

      this.clearHook(i);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);

      if (normals && normals.length === positions.length) {
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      } else {
        geometry.computeVertexNormals();
      }

      const mat = new THREE.MeshStandardMaterial({
        metalness: 0.05,
        roughness: 0.8,
        transparent: false,
        opacity: this.hookOpacity,
        depthWrite: true,
      });

      this.applyClippingToMaterial(mat);

      const mesh = new THREE.Mesh(geometry, mat);

      const pivot = new THREE.Group();
      pivot.name = `hookPivot${slot}`;

      const box = new THREE.Box3().setFromObject(mesh);
      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center);

      pivot.add(mesh);

      this.hookPivots[i] = pivot;
      this.hookRoots[i] = mesh;
      this.hookMaterials[i] = mat;

      this.applyHookState(i);

      pivot.renderOrder = -3;
      this.scene.add(pivot);

      // stencils
      this.rebuildSectionStencils();

      this.log(`hook${slot}: loaded OK`);
    } catch (e) {
      console.error(`Failed to load hook STEP ${slot}:`, url, e);
      this.hookRequested[i] = false;
      this.log(`hook${slot}: load FAILED (check /public path and filename)`);
    }
  }

  setHookVisible(slot: 1 | 2 | 3 | 4, v: boolean) {
    const i = slot - 1;
    this.hookVisible[i] = !!v;
    this.applyHookState(i);
  }

  setHookOffset(_slot: 1 | 2 | 3 | 4, x: number, y: number, z: number) {
    this.hookDeltaOffset = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  setHookRotationDeg(_slot: 1 | 2 | 3 | 4, rx: number, ry: number, rz: number) {
    this.hookDeltaRotDeg = { x: Number(rx) || 0, y: Number(ry) || 0, z: Number(rz) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  setHookOffsetDelta(x: number, y: number, z: number) {
    this.hookDeltaOffset = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  setHookRotDeltaDeg(zDeg: number) {
    this.hookDeltaRotDeg = { x: 0, y: 0, z: Number(zDeg) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  setMesh(payload: MeshPayload, opts?: { frame?: boolean }) {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(payload.positions, 3));

    if (payload.normals && payload.normals.length === payload.positions.length) {
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(payload.normals, 3));
    } else {
      geometry.computeVertexNormals();
    }

    geometry.setIndex(payload.indices);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const material = new THREE.MeshStandardMaterial({
      metalness: 0.05,
      roughness: 0.75,
    });

    this.applyClippingToMaterial(material);

    if (this.mesh) {
      this.scene.remove(this.mesh);
      const oldGeo = this.mesh.geometry as THREE.BufferGeometry;
      const oldMat = this.mesh.material as THREE.Material;
      oldGeo.dispose();
      oldMat.dispose();
    }

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = "paramMesh";
    this.mesh.visible = this.modelVisible;
    this.mesh.renderOrder = 0;

    this.scene.add(this.mesh);

    // stencils must match latest geometry
    this.rebuildSectionStencils();

    const forceFrame = !!opts?.frame;
    if (!this.hasFramedOnce || forceFrame) {
      this.frameToGeometry(geometry);
      this.hasFramedOnce = true;
    }
  }

  frame() {
    if (!this.mesh) return;
    const geo = this.mesh.geometry as THREE.BufferGeometry;
    this.frameToGeometry(geo);
    this.hasFramedOnce = true;
  }

  private frameToGeometry(geometry: THREE.BufferGeometry) {
    geometry.computeBoundingSphere();
    const sphere = geometry.boundingSphere;
    if (!sphere) return;

    const center = sphere.center;
    const radius = Math.max(sphere.radius, 1);

    this.controls.target.copy(center);

    const dist = radius / Math.sin((this.camera.fov * Math.PI) / 360);
    this.camera.position.set(center.x + dist, center.y - dist * 0.7, center.z + dist);

    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = dist * 1000;
    this.camera.updateProjectionMatrix();

    this.controls.update();
  }

  private renderAxisGizmo(viewW: number, viewH: number) {
    const size = Math.min(this.axisViewportSize, Math.min(viewW, viewH));
    const pad = this.axisViewportPadding;

    const x = viewW - size - pad;
    const y = viewH - size - pad;

    const dir = new THREE.Vector3().copy(this.camera.position).sub(this.controls.target);
    if (dir.lengthSq() < 1e-6) dir.set(1, 1, 1);
    dir.setLength(3);
    this.axisCamera.position.copy(dir);
    this.axisCamera.lookAt(0, 0, 0);
    this.axisCamera.updateProjectionMatrix();

    this.renderer.clearDepth();
    this.renderer.setScissorTest(true);
    this.renderer.setScissor(x, y, size, size);
    this.renderer.setViewport(x, y, size, size);
    this.renderer.render(this.axisScene, this.axisCamera);
    this.renderer.setScissorTest(false);

    this.renderer.setViewport(0, 0, viewW, viewH);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.controls.update();

    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    this.renderer.setViewport(0, 0, w, h);

    // Robust stencil clearing
    this.renderer.clear(true, true, true);

    this.renderer.render(this.scene, this.camera);

    this.renderAxisGizmo(w, h);
  };
}
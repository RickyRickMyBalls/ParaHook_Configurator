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

export class Viewer {
  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  //hand edit
  //was private controls: OrbitControls;
private controls: any;

  // World origin helpers in MAIN scene
  private originAxes: THREE.AxesHelper;
  private originDot: THREE.Mesh;

  // Axis gizmo (corner XYZ)
  private axisScene: THREE.Scene;
  private axisCamera: THREE.PerspectiveCamera;
  private axisHelper: THREE.AxesHelper;
  private axisViewportSize = 120;
  private axisViewportPadding = 10;

  // Parametric model mesh (from worker)
  private mesh: THREE.Mesh | null = null;

  // MODEL VISIBILITY TOGGLE (for the "Enable model" checkbox)
  private modelVisible = true;

  setModelVisible(v: boolean) {
    this.modelVisible = !!v;
    if (this.mesh) this.mesh.visible = this.modelVisible;
  }

  // -----------------------------
  // Baseplate visualization (points)
  // -----------------------------
  private baseplateVizVisible = false;

  private baseplateVizGroup: THREE.Group;
  private baseplateCtrlGroup: THREE.Group;
  private baseplateSpineGroup: THREE.Group;

  private ctrlMeshes: THREE.Mesh[] = [];
  private spineMeshes: THREE.Mesh[] = [];

  private ctrlSphereGeo: THREE.SphereGeometry;
  private spineSphereGeo: THREE.SphereGeometry;

  private ctrlMatBlue: THREE.MeshBasicMaterial;
  private ctrlMatBlue2: THREE.MeshBasicMaterial;
  private spineMatGray: THREE.MeshBasicMaterial;

  setBaseplateVizVisible(v: boolean) {
    this.baseplateVizVisible = !!v;
    this.baseplateVizGroup.visible = this.baseplateVizVisible;
  }

  setControlPoints(points: XYZ[]) {
    // Expect exactly 4, but handle any count safely.
    this.ensureCtrlCount(points.length);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const m = this.ctrlMeshes[i];
      m.position.set(p.x, p.y, p.z);
    }
  }

  setSpineSamplePoints(points: XYZ[]) {
    this.ensureSpineCount(points.length);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const m = this.spineMeshes[i];
      m.position.set(p.x, p.y, p.z);
    }
  }

  private ensureCtrlCount(n: number) {
    // Remove extras
    while (this.ctrlMeshes.length > n) {
      const m = this.ctrlMeshes.pop()!;
      this.baseplateCtrlGroup.remove(m);
      // geometry/material are shared, do not dispose here
    }
    // Add missing
    while (this.ctrlMeshes.length < n) {
      const idx = this.ctrlMeshes.length;

      // Alternate slightly different blues for visibility (optional)
      const mat = idx === 0 || idx === 3 ? this.ctrlMatBlue2 : this.ctrlMatBlue;

      const m = new THREE.Mesh(this.ctrlSphereGeo, mat);
      m.name = `ctrlPoint${idx + 1}`;
      m.renderOrder = 50;
      this.baseplateCtrlGroup.add(m);
      this.ctrlMeshes.push(m);
    }
  }

  private ensureSpineCount(n: number) {
    while (this.spineMeshes.length > n) {
      const m = this.spineMeshes.pop()!;
      this.baseplateSpineGroup.remove(m);
    }
    while (this.spineMeshes.length < n) {
      const idx = this.spineMeshes.length;
      const m = new THREE.Mesh(this.spineSphereGeo, this.spineMatGray);
      m.name = `spinePoint${idx}`;
      m.renderOrder = 40;
      this.baseplateSpineGroup.add(m);
      this.spineMeshes.push(m);
    }
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

  // Notify main.ts for debug panel
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

  // Base transform for premades (applied before UI deltas)
  private hookBaseOffset: XYZ = { x: -5, y: 98, z: 33 };
  private hookBaseRotDeg: XYZ = { x: 90, y: 0, z: 0 };

  // UI deltas from sliders (keep sliders starting at 0)
  private hookDeltaOffset: XYZ = { x: 0, y: 0, z: 0 };
  private hookDeltaRotDeg: XYZ = { x: 0, y: 0, z: 0 };

  // keep premades solid
  private hookOpacity = 1.0;

  // OpenCascade in main thread (for STEP import)
  private ocLoaded = false;
  private ocLoadingPromise: Promise<void> | null = null;

  // only frame once automatically (prevents camera jump on rebuild)
  private hasFramedOnce = false;

private canvas: HTMLCanvasElement;

constructor(canvas: HTMLCanvasElement) {
    //hand edit
    this.canvas = canvas;
    
    //end hand edit
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0b0b0f, 1);
    this.renderer.autoClear = true;

    // Main scene
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

    // Lighting
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

    // World-origin gizmo in the MAIN scene
    this.originAxes = new THREE.AxesHelper(40);
    this.scene.add(this.originAxes);

    this.originDot = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.scene.add(this.originDot);

    // Axis gizmo scene (corner XYZ)
    this.axisScene = new THREE.Scene();
    this.axisScene.up.set(0, 0, 1);

    this.axisCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    this.axisCamera.up.copy(this.camera.up);
    this.axisCamera.position.set(2.5, 2.5, 2.5);
    this.axisCamera.lookAt(0, 0, 0);

    this.axisHelper = new THREE.AxesHelper(1.2);
    this.axisScene.add(this.axisHelper);

    // -----------------------------
    // Baseplate viz init
    // -----------------------------
    this.baseplateVizGroup = new THREE.Group();
    this.baseplateVizGroup.name = "baseplateVizGroup";
    this.baseplateVizGroup.visible = false;

    this.baseplateCtrlGroup = new THREE.Group();
    this.baseplateCtrlGroup.name = "baseplateCtrlGroup";

    this.baseplateSpineGroup = new THREE.Group();
    this.baseplateSpineGroup.name = "baseplateSpineGroup";

    this.baseplateVizGroup.add(this.baseplateSpineGroup);
    this.baseplateVizGroup.add(this.baseplateCtrlGroup);
    this.scene.add(this.baseplateVizGroup);

    // Shared resources for viz points
    this.ctrlSphereGeo = new THREE.SphereGeometry(2.8, 16, 16);  // larger for the 4 points
    this.spineSphereGeo = new THREE.SphereGeometry(1.4, 12, 12); // smaller for sampled spine

    // Blue control points + gray sampled points (as requested)
    this.ctrlMatBlue = new THREE.MeshBasicMaterial({ color: 0x2d7cff });
    this.ctrlMatBlue2 = new THREE.MeshBasicMaterial({ color: 0x1aa3ff });
    this.spineMatGray = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });

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

  // -----------------------------
  // Debug hook for main.ts
  // -----------------------------
  setOnShoeStatus(cb: (line: string) => void) {
    this.onShoeStatus = cb;
  }
  private log(line: string) {
    if (this.onShoeStatus) this.onShoeStatus(line);
  }

  // -----------------------------
  // Shared helpers
  // -----------------------------
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

  // -----------------------------
  // Shoe core helpers
  // -----------------------------
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
  }

  private applyShoeState() {
    if (!this.shoePivot) return;

    this.shoePivot.visible = this.shoeVisible;

    const s = this.shoeScale * this.shoeUnitScale;
    this.shoePivot.scale.set(s, s, s);

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

  // -----------------------------
  // Footpads
  // -----------------------------
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
          color: 0x22cc66, // green footpads
          metalness: 0.0,
          roughness: 0.9,
          transparent: false,
          opacity: 1.0,
        });

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

  // -----------------------------
  // Premade Hooks (STEP)
  // -----------------------------
  private applyHookState(i: number) {
    const pivot = this.hookPivots[i];
    if (!pivot) return;

    pivot.visible = !!this.hookVisible[i];

    // base + delta offset
    pivot.position.set(
      this.hookBaseOffset.x + this.hookDeltaOffset.x,
      this.hookBaseOffset.y + this.hookDeltaOffset.y,
      this.hookBaseOffset.z + this.hookDeltaOffset.z
    );

    // base + delta rotation
    const rx = ((this.hookBaseRotDeg.x + this.hookDeltaRotDeg.x) * Math.PI) / 180;
    const ry = ((this.hookBaseRotDeg.y + this.hookDeltaRotDeg.y) * Math.PI) / 180;
    const rz = ((this.hookBaseRotDeg.z + this.hookDeltaRotDeg.z) * Math.PI) / 180;
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

      const mesh = new THREE.Mesh(geometry, mat);

      // Center mesh under pivot so rotations look sane
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

      // honor current UI state (visibility + transforms)
      this.applyHookState(i);

      pivot.renderOrder = -3;
      this.scene.add(pivot);

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

  // Called by main.ts (slider deltas). Slot is accepted but delta applies to ALL hooks.
  setHookOffset(_slot: 1 | 2 | 3 | 4, x: number, y: number, z: number) {
    this.hookDeltaOffset = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  // Called by main.ts (rotation delta). Slot is accepted but delta applies to ALL hooks.
  setHookRotationDeg(_slot: 1 | 2 | 3 | 4, rx: number, ry: number, rz: number) {
    this.hookDeltaRotDeg = { x: Number(rx) || 0, y: Number(ry) || 0, z: Number(rz) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  // Optional convenience APIs (if you prefer “global” names in main.ts)
  setHookOffsetDelta(x: number, y: number, z: number) {
    this.hookDeltaOffset = { x: Number(x) || 0, y: Number(y) || 0, z: Number(z) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }
  setHookRotDeltaDeg(zDeg: number) {
    this.hookDeltaRotDeg = { x: 0, y: 0, z: Number(zDeg) || 0 };
    for (let i = 0; i < 4; i++) this.applyHookState(i);
  }

  // -----------------------------
  // Replicad mesh display (parametric model)
  // -----------------------------
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

    if (this.mesh) {
      this.scene.remove(this.mesh);
      const oldGeo = this.mesh.geometry as THREE.BufferGeometry;
      const oldMat = this.mesh.material as THREE.Material;
      oldGeo.dispose();
      oldMat.dispose();
    }

    this.mesh = new THREE.Mesh(geometry, material);

    // IMPORTANT: honor the checkbox state
    this.mesh.visible = this.modelVisible;

    this.scene.add(this.mesh);

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
    this.renderer.render(this.scene, this.camera);

    this.renderAxisGizmo(w, h);
  };
}
// FILE: src/viewer.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

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

type SnapClass = "top" | "bottom" | "side";
type CameraControlMode = "current" | "orbit" | "trackball" | "arcball";
type VisualSceneMode = "off" | "stars" | "nebula" | "swarm";
type DisplayStyleMode = "shaded" | "edges" | "shaded_edges" | "xray" | "xray_edges" | "clay";
type BackgroundMode = "dark_blue" | "black" | "grid";

type SnapViewState = {
  target: THREE.Vector3;
  viewDir: THREE.Vector3; // target -> camera
  screenRightWorld: THREE.Vector3;
  screenUpWorld: THREE.Vector3;
  distance: number;
};

const STARS_NODE_COUNT_DEFAULT = 80;
const STARS_NODE_COUNT_MAX = 2000;
const STARS_CLUSTER_RADIUS = 180;
const STARS_WIRE_MAX_DIST = 72;
const NEBULA_POINTS_MAX = 120000;
const SWARM_COUNT_MAX = 2000;
const SWARM_BASE_COUNT = 300;

type StarsNode = {
  mesh: THREE.Mesh;
  pivot: THREE.Object3D;
  phase: number;
  speed: number;
  radius: number;
  axis: THREE.Vector3;
};

type SwarmAgent = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

export class Viewer {
  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private orthoLikeEnabled = false;
  private savedPerspectiveFov = 45;
  private cameraZoomFactor = 1;

  private controls: any;
  private controlMode: CameraControlMode = "current";
  private controlTargetFallback = new THREE.Vector3(0, 0, 0);
  private cameraInertia = 0.01; // 0..1 (higher = more glide)
  private autoSpinEnabled = false;
  private autoSpinSpeedRadPerSec = 0.9;
  private momentumDecaySeconds: number | null = null; // null = derived from inertia
  private orbitSpinActive = false;
  private orbitSpinVelocity = new THREE.Vector2(0, 0); // azimuth, polar (rad/s)
  private orbitSpinTracking = false;
  private orbitSpinLastMs = 0;
  private orbitSpinLastAzimuth = 0;
  private orbitSpinLastPolar = 0;
  private zoomStopsInertia = false;
  private zoomMomentumHoldUntilMs = 0;

  private originAxes: THREE.AxesHelper;
  private originDot: THREE.Mesh;
  private sceneGrid: THREE.GridHelper;
  private sceneGridMajor: THREE.GridHelper;
  private sceneGridSize = 600;
  private sceneGridDivisions = 30;
  private sceneGridMajorStep = 5;
  private sceneGridOpacity = 0.45;
  private sceneGridHighContrast = false;

  private axisScene: THREE.Scene;
  private axisCamera: THREE.PerspectiveCamera;
  private axisHelper: THREE.AxesHelper;
  private axisGizmoGroup: THREE.Group;
  private axisGizmoPickables: THREE.Object3D[] = [];
  private axisLabelX: THREE.Sprite | null = null;
  private axisLabelY: THREE.Sprite | null = null;
  private axisLabelZ: THREE.Sprite | null = null;
  private axisGizmoLabels: THREE.Sprite[] = [];
  private axisGizmoLineMaterial: THREE.LineBasicMaterial | null = null;
  private axisGizmoEdgeLineMaterials: THREE.LineBasicMaterial[] = [];
  private axisGizmoWebLineMaterial: THREE.LineBasicMaterial | null = null;
  private axisRaycaster = new THREE.Raycaster();
  private axisPointerNdc = new THREE.Vector2();
  private axisHoveredPickable: THREE.Object3D | null = null;
  private axisViewportSize = 300;
  private axisViewportPadding = 10;
  private axisGizmoDrawScale = 0.625;
  private axisGizmoLineOpacity = 0.12;
  private axisGizmoSphereScale = 1;
  private axisGizmoTextScale = 1;
  private axisGizmoEnabled = true;
  private axisSnapAnim:
    | {
        startMs: number;
        durationMs: number;
        cameraRef: THREE.PerspectiveCamera;
        controlsRef: any;
        fromPos: THREE.Vector3;
        toPos: THREE.Vector3;
        fromUp: THREE.Vector3;
        toUp: THREE.Vector3;
        target: THREE.Vector3;
      }
    | null = null;
  private lastSnapWasTopBottom = false;
  private onOrbitStart = () => {
    if (this.controlMode !== "current") return;
    // Only re-cardinalize right after a top/bottom snap.
    // Otherwise keep orbiting free/smooth.
    this.axisSnapAnim = null;
    if (!this.lastSnapWasTopBottom) return;
    const upSign = this.getCardinalUpSign();
    this.enforceCardinalUpForOrbit(upSign);
    this.lastSnapWasTopBottom = false;
    this.controls.update();
  };
  private onOrbitZoomInput = () => {
    if (this.zoomStopsInertia) {
      this.orbitSpinActive = false;
      this.orbitSpinVelocity.set(0, 0);
      this.starsSpinActive = false;
      this.starsSpinVelocity.set(0, 0);
      this.nebulaSpinActive = false;
      this.nebulaSpinVelocity.set(0, 0);
      this.swarmSpinActive = false;
      this.swarmSpinVelocity.set(0, 0);
      this.flushControlInertia(this.controls);
      this.flushControlInertia(this.starsControls);
      this.flushControlInertia(this.nebulaControls);
      this.flushControlInertia(this.swarmControls);
    } else {
      // Keep zoom behavior from unintentionally killing existing momentum.
      this.zoomMomentumHoldUntilMs = performance.now() + 220;
      this.rearmSpinMomentumAfterZoom();
    }
    if (this.controlMode !== "current") return;
    // If the last gizmo snap was top/bottom, cardinalize before first wheel zoom
    // to avoid spiral/twist behavior while keeping zoom enabled.
    if (!this.lastSnapWasTopBottom) return;
    this.axisSnapAnim = null;
    this.enforceCardinalUpForOrbit(this.getCardinalUpSign());
    this.lastSnapWasTopBottom = false;
    this.controls.update();
  };
  private onControlSpinStart = () => {
    if (this.controlMode !== "current" && this.controlMode !== "orbit") return;
    if (!this.controls?.getAzimuthalAngle || !this.controls?.getPolarAngle) return;
    this.orbitSpinTracking = true;
    this.orbitSpinLastMs = performance.now();
    this.orbitSpinLastAzimuth = Number(this.controls.getAzimuthalAngle()) || 0;
    this.orbitSpinLastPolar = Number(this.controls.getPolarAngle()) || 0;
    this.orbitSpinActive = false;
    this.orbitSpinVelocity.set(0, 0);
  };
  private onControlSpinChange = () => {
    if (!this.orbitSpinTracking) return;
    if (!this.controls?.getAzimuthalAngle || !this.controls?.getPolarAngle) return;
    const now = performance.now();
    const dt = Math.max(1e-3, (now - this.orbitSpinLastMs) / 1000);
    const az = Number(this.controls.getAzimuthalAngle()) || 0;
    const pol = Number(this.controls.getPolarAngle()) || 0;
    const dAzRaw = az - this.orbitSpinLastAzimuth;
    const dAz = Math.atan2(Math.sin(dAzRaw), Math.cos(dAzRaw));
    const dPol = pol - this.orbitSpinLastPolar;
    const vAz = dAz / dt;
    const vPol = dPol / dt;
    this.orbitSpinVelocity.x = THREE.MathUtils.lerp(this.orbitSpinVelocity.x, vAz, 0.35);
    this.orbitSpinVelocity.y = THREE.MathUtils.lerp(this.orbitSpinVelocity.y, vPol, 0.35);
    this.orbitSpinLastMs = now;
    this.orbitSpinLastAzimuth = az;
    this.orbitSpinLastPolar = pol;
  };
  private onControlSpinEnd = () => {
    if (!this.orbitSpinTracking) return;
    this.orbitSpinTracking = false;
    const speed = Math.hypot(this.orbitSpinVelocity.x, this.orbitSpinVelocity.y);
    const inertia = Math.min(1, Math.max(0, this.cameraInertia));
    const minSpeedToKeep = THREE.MathUtils.lerp(0.12, 0.01, inertia);
    this.orbitSpinActive = speed > minSpeedToKeep;
  };

  private flushControlInertia(controls: any) {
    if (!controls?.update) return;
    const hadEnableDamping = typeof controls.enableDamping === "boolean";
    const prevEnableDamping = hadEnableDamping ? !!controls.enableDamping : false;
    const prevDampingFactor = typeof controls.dampingFactor === "number" ? controls.dampingFactor : undefined;
    if (hadEnableDamping) controls.enableDamping = false;
    controls.update();
    if (hadEnableDamping) {
      controls.enableDamping = prevEnableDamping;
      if (typeof prevDampingFactor === "number") controls.dampingFactor = prevDampingFactor;
    }
  }

  private rearmSpinMomentumAfterZoom() {
    if (!this.orbitSpinTracking && Math.hypot(this.orbitSpinVelocity.x, this.orbitSpinVelocity.y) > 0.005) {
      this.orbitSpinActive = true;
    }
    if (!this.starsSpinTracking && Math.hypot(this.starsSpinVelocity.x, this.starsSpinVelocity.y) > 0.005) {
      this.starsSpinActive = true;
    }
    if (!this.nebulaSpinTracking && Math.hypot(this.nebulaSpinVelocity.x, this.nebulaSpinVelocity.y) > 0.005) {
      this.nebulaSpinActive = true;
    }
    if (!this.swarmSpinTracking && Math.hypot(this.swarmSpinVelocity.x, this.swarmSpinVelocity.y) > 0.005) {
      this.swarmSpinActive = true;
    }
  }

  private isZoomMomentumHoldActive() {
    return performance.now() < this.zoomMomentumHoldUntilMs;
  }
  private onCanvasPointerMove = (e: PointerEvent) => {
    if (!this.axisGizmoEnabled) {
      this.setAxisHoverTarget(null);
      return;
    }
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w <= 0 || h <= 0) return;

    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const vp = this.getAxisGizmoViewportRect(w, h);
    if (px < vp.left || px > vp.left + vp.size || py < vp.top || py > vp.top + vp.size) {
      this.setAxisHoverTarget(null);
      return;
    }

    this.updateAxisGizmoCameraFromMainCamera();
    this.axisPointerNdc.set(((px - vp.left) / vp.size) * 2 - 1, -(((py - vp.top) / vp.size) * 2 - 1));
    this.axisRaycaster.setFromCamera(this.axisPointerNdc, this.axisCamera);
    const hits = this.axisRaycaster.intersectObjects(this.axisGizmoPickables, false);
    this.setAxisHoverTarget(hits[0]?.object ?? null);
  };
  private onCanvasPointerLeave = () => {
    this.setAxisHoverTarget(null);
  };
  private onWindowKeyDown = (e: KeyboardEvent) => {
    if (this.visualSceneMode === "off") return;
    if (e.key !== "Escape") return;
    e.preventDefault();
    this.setVisualSceneMode("off");
  };

  private mesh: THREE.Mesh | null = null;
  private displayStyleMode: DisplayStyleMode = "shaded";
  private backgroundMode: BackgroundMode = "dark_blue";
  private paramMeshOffset = new THREE.Vector3(0, 0, 0);
  private paramMeshRotDeg = new THREE.Vector3(0, 0, 0);
  private paramMeshMirrorXZ = false;

  private modelVisible = true;
  private visualSceneMode: VisualSceneMode = "off";
  private starsScene: THREE.Scene | null = null;
  private starsCamera: THREE.PerspectiveCamera | null = null;
  private starsControls: any = null;
  private starsNodeGroup: THREE.Group | null = null;
  private starsWireSegments: THREE.LineSegments | null = null;
  private starsWirePositions: Float32Array | null = null;
  private starsNodes: StarsNode[] = [];
  private starsNodeCount = STARS_NODE_COUNT_DEFAULT;
  private starsNodeGeometry: THREE.SphereGeometry | null = null;
  private starsSpinActive = false;
  private starsSpinTracking = false;
  private starsSpinVelocity = new THREE.Vector2(0, 0); // azimuth, polar (rad/s)
  private starsSpinLastMs = 0;
  private starsSpinLastAzimuth = 0;
  private starsSpinLastPolar = 0;
  private starsCentrifugalScale = 1;
  private starsDistanceScale = 1;
  private starsMotionScale = 1;
  private starsGlowScale = 1;
  private starsWireOpacity = 0.24;
  private starsLineLikelihood = 0.5;
  private starsNodeScale = 1;
  private starsWireMaxDist = STARS_WIRE_MAX_DIST;
  private nebulaScene: THREE.Scene | null = null;
  private nebulaCamera: THREE.PerspectiveCamera | null = null;
  private nebulaControls: any = null;
  private nebulaClouds: THREE.Points[] = [];
  private nebulaCloudBasePositions: Float32Array[] = [];
  private nebulaDensity = 1;
  private nebulaScale = 1;
  private nebulaTurbulence = 0.35;
  private nebulaDrift = 1;
  private nebulaGlow = 1;
  private nebulaColorShift = 0;
  private nebulaSpinLastMs = 0;
  private nebulaSpinLastAzimuth = 0;
  private nebulaSpinLastPolar = 0;
  private nebulaSpinVelocity = new THREE.Vector2(0, 0);
  private nebulaCentrifugalScale = 1;
  private nebulaSpinTracking = false;
  private nebulaSpinActive = false;
  private swarmScene: THREE.Scene | null = null;
  private swarmCamera: THREE.PerspectiveCamera | null = null;
  private swarmControls: any = null;
  private swarmPoints: THREE.Points | null = null;
  private swarmPositions: Float32Array | null = null;
  private swarmAgents: SwarmAgent[] = [];
  private swarmCount = SWARM_BASE_COUNT;
  private swarmSpeed = 1;
  private swarmCohesion = 0.45;
  private swarmSeparation = 0.5;
  private swarmAlignment = 0.5;
  private swarmJitter = 0.2;
  private swarmBounds = 170;
  private swarmSpinLastMs = 0;
  private swarmSpinLastAzimuth = 0;
  private swarmSpinLastPolar = 0;
  private swarmSpinVelocity = new THREE.Vector2(0, 0);
  private swarmCentrifugalScale = 1;
  private swarmSpinTracking = false;
  private swarmSpinActive = false;
  private swarmSpinDecaySeconds: number | null = null; // null => use global decay
  private swarmAnimProgress = 0; // 0..1
  private swarmAnimManualOverride = false;
  private swarmExplodeEnabled = false;
  private swarmExplodeStrength = 1;
  private starsSavedState: {
    cameraPos: THREE.Vector3;
    cameraUp: THREE.Vector3;
    target: THREE.Vector3;
    mode: CameraControlMode;
    orthoLikeEnabled: boolean;
    fov: number;
  } | null = null;

  setModelVisible(v: boolean) {
    this.modelVisible = !!v;
    if (this.mesh) this.mesh.visible = this.modelVisible;
  }

  setModelWireframeEnabled(enabled: boolean) {
    this.setDisplayStyleMode(enabled ? "edges" : "shaded");
  }

  getModelWireframeEnabled() {
    return this.displayStyleMode === "edges";
  }

  setDisplayStyleMode(mode: DisplayStyleMode) {
    // Compatibility: old xray_edges mode now maps to shaded_edges.
    this.displayStyleMode = mode === "xray_edges" ? "shaded_edges" : mode;
    this.applyDisplayStyleToAll();
    // Re-assert per-asset material states (especially transparency) after style switches.
    this.applyShoeState();
  }

  getDisplayStyleMode() {
    return this.displayStyleMode;
  }

  setBackgroundMode(mode: BackgroundMode) {
    this.backgroundMode = mode;
    this.applyBackgroundMode();
  }

  getBackgroundMode() {
    return this.backgroundMode;
  }

  private applyBackgroundMode() {
    const color = this.backgroundMode === "dark_blue" ? 0x0b0b0f : 0x000000;
    this.renderer.setClearColor(color, 1);
    const show = this.backgroundMode === "grid";
    if (this.sceneGrid) this.sceneGrid.visible = show;
    if (this.sceneGridMajor) this.sceneGridMajor.visible = show;
  }

  setGridSize(size: number) {
    const next = Number.isFinite(size) ? Math.round(Math.max(100, Math.min(4000, size))) : this.sceneGridSize;
    if (next === this.sceneGridSize) return;
    this.sceneGridSize = next;
    this.rebuildSceneGrid();
  }

  getGridSize() {
    return this.sceneGridSize;
  }

  setGridDivisions(divisions: number) {
    const next = Number.isFinite(divisions) ? Math.round(Math.max(4, Math.min(240, divisions))) : this.sceneGridDivisions;
    if (next === this.sceneGridDivisions) return;
    this.sceneGridDivisions = next;
    this.rebuildSceneGrid();
  }

  getGridDivisions() {
    return this.sceneGridDivisions;
  }

  setGridMajorStep(step: number) {
    const next = Number.isFinite(step) ? Math.round(Math.max(1, Math.min(40, step))) : this.sceneGridMajorStep;
    if (next === this.sceneGridMajorStep) return;
    this.sceneGridMajorStep = next;
    this.rebuildSceneGrid();
  }

  getGridMajorStep() {
    return this.sceneGridMajorStep;
  }

  setGridOpacity(opacity: number) {
    const next = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : this.sceneGridOpacity;
    this.sceneGridOpacity = next;
    this.applyGridMaterialOpacity();
  }

  getGridOpacity() {
    return this.sceneGridOpacity;
  }

  setGridHighContrast(enabled: boolean) {
    const next = !!enabled;
    if (next === this.sceneGridHighContrast) return;
    this.sceneGridHighContrast = next;
    this.rebuildSceneGrid();
  }

  getGridHighContrast() {
    return this.sceneGridHighContrast;
  }

  private applyGridMaterialOpacity() {
    const applyOpacity = (grid: THREE.GridHelper | undefined | null, opacity: number) => {
      if (!grid) return;
      const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
      for (const mat of mats) {
        mat.transparent = true;
        mat.opacity = opacity;
        mat.needsUpdate = true;
      }
    };
    applyOpacity(this.sceneGrid, this.sceneGridOpacity);
    applyOpacity(this.sceneGridMajor, Math.min(1, this.sceneGridOpacity * 1.3));
  }

  private rebuildSceneGrid() {
    if (this.sceneGrid?.parent) this.sceneGrid.parent.remove(this.sceneGrid);
    if (this.sceneGridMajor?.parent) this.sceneGridMajor.parent.remove(this.sceneGridMajor);
    const c1 = this.sceneGridHighContrast ? 0x7b97bf : 0x4b607f;
    const c2 = this.sceneGridHighContrast ? 0x4f6484 : 0x2b3443;
    const majorC1 = this.sceneGridHighContrast ? 0xb8cff5 : 0x7b97bf;
    const majorC2 = this.sceneGridHighContrast ? 0x8ea9d0 : 0x4f6484;
    this.sceneGrid = new THREE.GridHelper(this.sceneGridSize, this.sceneGridDivisions, c1, c2);
    this.sceneGrid.rotation.x = Math.PI / 2;
    const majorDivisions = Math.max(1, Math.round(this.sceneGridDivisions / this.sceneGridMajorStep));
    this.sceneGridMajor = new THREE.GridHelper(this.sceneGridSize, majorDivisions, majorC1, majorC2);
    this.sceneGridMajor.rotation.x = Math.PI / 2;
    this.applyGridMaterialOpacity();
    this.scene.add(this.sceneGrid);
    this.scene.add(this.sceneGridMajor);
    this.applyBackgroundMode();
  }

  private applyDisplayStyleToMaterial(mat: any) {
    if (!mat) return;
    if (Array.isArray(mat)) {
      mat.forEach((m) => this.applyDisplayStyleToMaterial(m));
      return;
    }

    const anyMat = mat as any;
    if (!anyMat.userData) anyMat.userData = {};
    if (!anyMat.userData._displayBase) {
      anyMat.userData._displayBase = {
        color: anyMat.color?.clone?.(),
        metalness: typeof anyMat.metalness === "number" ? anyMat.metalness : undefined,
        roughness: typeof anyMat.roughness === "number" ? anyMat.roughness : undefined,
        transparent: typeof anyMat.transparent === "boolean" ? anyMat.transparent : undefined,
        opacity: typeof anyMat.opacity === "number" ? anyMat.opacity : undefined,
        depthWrite: typeof anyMat.depthWrite === "boolean" ? anyMat.depthWrite : undefined,
        side: typeof anyMat.side === "number" ? anyMat.side : undefined,
        wireframe: typeof anyMat.wireframe === "boolean" ? anyMat.wireframe : undefined,
      };
    }
    const base = anyMat.userData._displayBase;
    if (base?.color && anyMat.color?.copy) anyMat.color.copy(base.color);
    if (typeof base?.metalness === "number") anyMat.metalness = base.metalness;
    if (typeof base?.roughness === "number") anyMat.roughness = base.roughness;
    if (typeof base?.transparent === "boolean") anyMat.transparent = base.transparent;
    if (typeof base?.opacity === "number") anyMat.opacity = base.opacity;
    if (typeof base?.depthWrite === "boolean") anyMat.depthWrite = base.depthWrite;
    if (typeof base?.side === "number") anyMat.side = base.side;
    if (typeof base?.wireframe === "boolean") anyMat.wireframe = base.wireframe;

    if (this.displayStyleMode === "edges") {
      if ("wireframe" in anyMat) anyMat.wireframe = true;
      if ("transparent" in anyMat) anyMat.transparent = false;
      if ("opacity" in anyMat) anyMat.opacity = 1;
      if ("depthWrite" in anyMat) anyMat.depthWrite = true;
    } else if (this.displayStyleMode === "shaded_edges") {
      if ("wireframe" in anyMat) anyMat.wireframe = false;
      if ("transparent" in anyMat) anyMat.transparent = false;
      if ("opacity" in anyMat) anyMat.opacity = 1;
      if ("depthWrite" in anyMat) anyMat.depthWrite = true;
    } else if (this.displayStyleMode === "xray_edges") {
      if ("wireframe" in anyMat) anyMat.wireframe = false;
      if ("transparent" in anyMat) anyMat.transparent = true;
      if ("opacity" in anyMat) {
        const baseOpacity = Number(base?.opacity ?? 1);
        const safeBase = Number.isFinite(baseOpacity) ? Math.max(0, Math.min(1, baseOpacity)) : 1;
        anyMat.opacity = Math.max(0.18, Math.min(0.65, safeBase * 0.55));
      }
      // Keep depth writes on to prevent transparent self-sorting artifacts
      // on dense meshes (shoe laces/textured submeshes).
      if ("depthWrite" in anyMat) anyMat.depthWrite = true;
      if ("side" in anyMat) anyMat.side = THREE.DoubleSide;
    } else if (this.displayStyleMode === "xray") {
      if ("wireframe" in anyMat) anyMat.wireframe = false;
      if ("transparent" in anyMat) anyMat.transparent = true;
      if ("opacity" in anyMat) {
        const baseOpacity = Number(base?.opacity ?? 1);
        const safeBase = Number.isFinite(baseOpacity) ? Math.max(0, Math.min(1, baseOpacity)) : 1;
        anyMat.opacity = Math.max(0.18, Math.min(0.65, safeBase * 0.55));
      }
      if ("depthWrite" in anyMat) anyMat.depthWrite = true;
      if ("side" in anyMat) anyMat.side = THREE.DoubleSide;
    } else if (this.displayStyleMode === "clay") {
      if (anyMat.color?.setHex) anyMat.color.setHex(0xb6b0a3);
      if ("metalness" in anyMat) anyMat.metalness = 0;
      if ("roughness" in anyMat) anyMat.roughness = 1;
      if ("wireframe" in anyMat) anyMat.wireframe = false;
      if ("transparent" in anyMat) anyMat.transparent = false;
      if ("opacity" in anyMat) anyMat.opacity = 1;
      if ("depthWrite" in anyMat) anyMat.depthWrite = true;
    } else {
      if ("wireframe" in anyMat) anyMat.wireframe = false;
      if ("depthWrite" in anyMat) anyMat.depthWrite = true;
    }
    anyMat.needsUpdate = true;
  }

  private applyDisplayStyleToObject(obj: THREE.Object3D | null) {
    if (!obj) return;
    obj.traverse((child: any) => {
      if (!child?.isMesh) return;
      this.applyDisplayStyleToMaterial(child.material);
      this.syncEdgeOverlayForMesh(child as THREE.Mesh);
    });
  }

  private syncEdgeOverlayForMesh(mesh: THREE.Mesh) {
    const wantOverlay = this.displayStyleMode === "xray_edges" || this.displayStyleMode === "shaded_edges";
    const existing = mesh.userData._edgeOverlay as THREE.Mesh | undefined;

    if (!wantOverlay) {
      if (existing && existing.parent === mesh) existing.removeFromParent();
      mesh.userData._edgeOverlay = null;
      return;
    }

    if (existing && existing.parent === mesh) {
      const mat = existing.material as THREE.MeshBasicMaterial | undefined;
      if (mat) {
        mat.opacity = this.displayStyleMode === "shaded_edges" ? 0.6 : 0.8;
        mat.depthTest = this.displayStyleMode === "shaded_edges";
        mat.needsUpdate = true;
      }
      return;
    }

    const overlayMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: this.displayStyleMode === "shaded_edges" ? 0.6 : 0.8,
      depthWrite: false,
      depthTest: this.displayStyleMode === "shaded_edges",
    });
    const overlay = new THREE.Mesh(mesh.geometry, overlayMat);
    overlay.name = `${mesh.name || "mesh"}_edgeOverlay`;
    overlay.matrixAutoUpdate = false;
    overlay.renderOrder = (mesh.renderOrder || 0) + 1;
    overlay.raycast = () => null;
    mesh.add(overlay);
    mesh.userData._edgeOverlay = overlay;
  }

  private applyDisplayStyleToAll() {
    this.applyDisplayStyleToMaterial(this.mesh?.material as any);
    if (this.mesh) this.syncEdgeOverlayForMesh(this.mesh);
    this.applyDisplayStyleToMaterial(this.shoeMaterial as any);
    this.applyDisplayStyleToMaterial(this.shoeFlatFallbackMaterial as any);
    this.applyDisplayStyleToMaterial(this.footpadFlatFallbackMaterial as any);
    for (const mat of this.footpadMaterials) this.applyDisplayStyleToMaterial(mat as any);
    for (const mat of this.hookMaterials) this.applyDisplayStyleToMaterial(mat as any);
    this.applyDisplayStyleToObject(this.shoeRoot);
    for (const root of this.footpadRoots) this.applyDisplayStyleToObject(root);
    for (const root of this.hookRoots) this.applyDisplayStyleToObject(root);
  }

  setParamMeshOffset(x: number, y: number, z: number) {
    this.paramMeshOffset.set(Number(x) || 0, Number(y) || 0, Number(z) || 0);
    this.applyParamMeshTransform();
  }

  setParamMeshRotationDeg(rx: number, ry: number, rz: number) {
    this.paramMeshRotDeg.set(Number(rx) || 0, Number(ry) || 0, Number(rz) || 0);
    this.applyParamMeshTransform();
  }

  setParamMeshMirrorXZ(v: boolean) {
    this.paramMeshMirrorXZ = !!v;
    this.applyParamMeshTransform();
  }

  private applyParamMeshTransform() {
    const rx = THREE.MathUtils.degToRad(this.paramMeshRotDeg.x);
    const ry = THREE.MathUtils.degToRad(this.paramMeshRotDeg.y);
    const rz = THREE.MathUtils.degToRad(this.paramMeshRotDeg.z);
    let mirrorYOffset = 0;
    if (this.paramMeshMirrorXZ && this.mesh) {
      const geo = this.mesh.geometry as THREE.BufferGeometry | undefined;
      if (geo) {
        if (!geo.boundingBox) geo.computeBoundingBox();
        const box = geo.boundingBox;
        if (box) mirrorYOffset = Math.max(0, box.max.y - box.min.y);
      }
    }

    const applyToObject = (obj: THREE.Object3D | null | undefined) => {
      if (!obj) return;
      obj.position.set(
        this.paramMeshOffset.x,
        this.paramMeshOffset.y + mirrorYOffset,
        this.paramMeshOffset.z
      );
      obj.rotation.set(rx, ry, rz);
      obj.scale.set(1, this.paramMeshMirrorXZ ? -1 : 1, 1);
      obj.updateMatrixWorld(true);
    };

    applyToObject(this.mesh);
    // Keep viewer-only control point visualizers aligned with the transformed param mesh.
    applyToObject(this.baseplateVizGroup);
    applyToObject(this.arcVizGroup);

    if (!this.mesh) return;
    // Section cut stencil meshes must mirror the visible mesh transform.
    this.rebuildSectionStencils();
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

    back.position.copy(mesh.position);
    back.quaternion.copy(mesh.quaternion);
    back.scale.copy(mesh.scale);
    front.position.copy(mesh.position);
    front.quaternion.copy(mesh.quaternion);
    front.scale.copy(mesh.scale);
    back.updateMatrixWorld(true);
    front.updateMatrixWorld(true);

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
  private shoeMirrorGroup: THREE.Group | null = null;
  private shoeRoot: THREE.Object3D | null = null;
  private shoeMaterial: THREE.MeshStandardMaterial | null = null;
  private shoeFlatFallbackMaterial: THREE.MeshStandardMaterial | null = null;
  private shoeRequested = false;

  private shoeVisible = true;
  private shoeScale = 1.0;
  private shoeTransparency = 0.5;
  private shoeUnitScale = 1.0;
  private shoeMirrorXZ = false;
  private shoeMaterialsEnabled = true;

  private shoeRotDeg: XYZ = { x: 0, y: 0, z: 0 };
  private shoeOffset: XYZ = { x: 0, y: 0, z: 0 };

  private onShoeStatus?: (line: string) => void;

  // -----------------------------
  // Reference footpads (3x STL) via PIVOTS
  // -----------------------------
  private footpadPivots: Array<THREE.Group | null> = [null, null, null];
  private footpadRoots: Array<THREE.Object3D | null> = [null, null, null];
  private footpadMaterials: Array<THREE.MeshStandardMaterial | null> = [null, null, null];
  private footpadMaterialsEnabled = true;
  private footpadFlatFallbackMaterial: THREE.MeshStandardMaterial | null = null;

  private footpadRequested: boolean[] = [false, false, false];
  private footpadVisible: boolean[] = [false, false, false];

  private footpadUnitScale = 1.0;
  private footpadScale = 1.0;
  private footpadRotDeg: XYZ = { x: 0, y: 0, z: 0 };
  private footpadOffset: XYZ = { x: 0, y: 0, z: 0 };
  private footpadAssetOffset: XYZ[] = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ];

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
    this.camera.position.set(-200, -160, 200);

    this.controls = this.createControlsForMode(this.controlMode);
    this.attachControlEventHooks(this.controlMode, this.controls);
    this.renderer.domElement.addEventListener("wheel", this.onOrbitZoomInput, { capture: true, passive: true });
    this.renderer.domElement.addEventListener("pointermove", this.onCanvasPointerMove, { passive: true });
    this.renderer.domElement.addEventListener("pointerleave", this.onCanvasPointerLeave, { passive: true });
    window.addEventListener("keydown", this.onWindowKeyDown);

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

    this.sceneGrid = new THREE.GridHelper(1, 1, 0x4b607f, 0x2b3443);
    this.sceneGridMajor = new THREE.GridHelper(1, 1, 0x7b97bf, 0x4f6484);
    this.scene.add(this.sceneGrid);
    this.scene.add(this.sceneGridMajor);
    this.rebuildSceneGrid();
    this.applyBackgroundMode();

    this.axisScene = new THREE.Scene();
    this.axisScene.up.set(0, 0, 1);

    this.axisCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    this.axisCamera.up.copy(this.camera.up);
    this.axisCamera.position.set(2.5, 2.5, 2.5);
    this.axisCamera.lookAt(0, 0, 0);

    this.axisHelper = new THREE.AxesHelper(1.2);
    this.axisHelper.scale.setScalar(0.5);
    this.axisScene.add(this.axisHelper);
    this.axisGizmoGroup = new THREE.Group();
    this.axisGizmoGroup.name = "axisGizmoGroup";
    this.axisScene.add(this.axisGizmoGroup);
    this.buildClickableAxisGizmo();

    // Intercept clicks in the gizmo viewport before OrbitControls handles dragging.
    this.renderer.domElement.addEventListener("pointerdown", this.onCanvasPointerDown, { capture: true });

    this.baseplateVizGroup = new THREE.Group();
    this.baseplateVizGroup.name = "baseplateVizGroup";
    this.baseplateVizGroup.visible = false;

    this.baseplateCtrlGroup = new THREE.Group();
    this.baseplateCtrlGroup.name = "baseplateCtrlGroup";

    this.baseplateVizGroup.add(this.baseplateCtrlGroup);
    this.scene.add(this.baseplateVizGroup);

    this.ctrlSphereGeo = new THREE.SphereGeometry(2.8, 16, 16);
    this.ctrlMatBlue = new THREE.MeshBasicMaterial({ color: 0x2d7cff, depthTest: false, depthWrite: false });
    this.ctrlMatBlue2 = new THREE.MeshBasicMaterial({ color: 0x1aa3ff, depthTest: false, depthWrite: false });

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
      new THREE.MeshBasicMaterial({ color: 0xffcc00, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xffee66, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, depthTest: false, depthWrite: false }),
    ];

    this.bArcMats = [
      new THREE.MeshBasicMaterial({ color: 0xff66cc, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xcc66ff, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xff99dd, depthTest: false, depthWrite: false }),
    ];

    this.cArcMats = [
      new THREE.MeshBasicMaterial({ color: 0x66ff66, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x33cc99, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0x99ff99, depthTest: false, depthWrite: false }),
    ];

    this.heelArcMats = [
      new THREE.MeshBasicMaterial({ color: 0xff8844, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xff4444, depthTest: false, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xffbb66, depthTest: false, depthWrite: false }),
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
    if (this.starsCamera) {
      this.starsCamera.aspect = w / h;
      this.starsCamera.updateProjectionMatrix();
    }
    if (this.nebulaCamera) {
      this.nebulaCamera.aspect = w / h;
      this.nebulaCamera.updateProjectionMatrix();
    }
    if (this.swarmCamera) {
      this.swarmCamera.aspect = w / h;
      this.swarmCamera.updateProjectionMatrix();
    }
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
    this.shoeMirrorGroup = null;
    this.shoeRoot = null;

    if (this.shoeMaterial) {
      this.shoeMaterial.dispose();
      this.shoeMaterial = null;
    }
    if (this.shoeFlatFallbackMaterial) {
      this.shoeFlatFallbackMaterial.dispose();
      this.shoeFlatFallbackMaterial = null;
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

    if (this.shoeMirrorGroup) {
      this.shoeMirrorGroup.position.set(0, 0, 0);
      this.shoeMirrorGroup.rotation.set(
        this.shoeMirrorXZ ? Math.PI : 0,
        0,
        0
      );
      this.shoeMirrorGroup.scale.set(1, this.shoeMirrorXZ ? -1 : 1, 1);
      this.shoeMirrorGroup.updateMatrixWorld(true);
    }

    const getFlatShoeMaterial = () => {
      if (!this.shoeFlatFallbackMaterial) {
        this.shoeFlatFallbackMaterial = new THREE.MeshStandardMaterial({
          color: 0xa7b0bf,
          metalness: 0.0,
          roughness: 0.92,
          transparent: true,
          opacity: 1 - this.shoeTransparency,
          depthWrite: false,
        });
      }
      return this.shoeFlatFallbackMaterial;
    };

    if (this.shoeRoot) {
      const flatMat = this.shoeMaterialsEnabled ? null : getFlatShoeMaterial();
      this.shoeRoot.traverse((child: any) => {
        if (!child?.isMesh) return;
        if (!("shoeOriginalMaterial" in child.userData)) {
          child.userData.shoeOriginalMaterial = child.material;
        }
        const originalMat = child.userData.shoeOriginalMaterial as THREE.Material | THREE.Material[] | undefined;
        const nextMat = this.shoeMaterialsEnabled ? (originalMat ?? child.material) : (flatMat ?? child.material);
        if (child.material !== nextMat) child.material = nextMat;
        this.applyClippingToMaterial(child.material);
        this.applyDisplayStyleToMaterial(child.material);
      });
    }

    const applyOpacity = (mat: any) => {
      if (!mat) return;
      this.applyDisplayStyleToMaterial(mat);
      const desiredOpacity = 1 - this.shoeTransparency;
      if ("opacity" in mat) mat.opacity = desiredOpacity;
      if ("transparent" in mat) mat.transparent = (mat.opacity ?? 1) < 1;
      if ("depthWrite" in mat) mat.depthWrite = true;
      mat.needsUpdate = true;
    };
    if (this.shoeRoot) {
      this.shoeRoot.traverse((child: any) => {
        if (!child?.isMesh) return;
        const mat = child.material as any;
        if (Array.isArray(mat)) mat.forEach(applyOpacity);
        else applyOpacity(mat);
      });
    } else if (this.shoeMaterial) {
      applyOpacity(this.shoeMaterial);
    }
  }

  private createControlsForMode(mode: CameraControlMode) {
    let controls: any;
    if (mode === "trackball") {
      controls = new TrackballControls(this.camera, this.renderer.domElement);
      controls.rotateSpeed = 0.9;
      controls.zoomSpeed = 0.85;
      controls.panSpeed = 0.55;
      controls.noRoll = true;
      controls.staticMoving = true;
    } else if (mode === "arcball") {
      controls = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
      if (typeof controls.setGizmosVisible === "function") controls.setGizmosVisible(false);
      controls.enableFocus = false;
    } else {
      controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 0.9;
      controls.panSpeed = 0.7;
      controls.screenSpacePanning = false;
      // Avoid exact top/bottom pole singularities where azimuth spin appears to freeze.
      controls.minPolarAngle = 0.001;
      controls.maxPolarAngle = Math.PI - 0.001;
    }
    this.applyCameraInertiaToControls(mode, controls);
    const t = controls?.target as THREE.Vector3 | undefined;
    if (t?.copy) t.copy(this.controlTargetFallback);
    return controls;
  }

  private applyCameraInertiaToControls(mode: CameraControlMode, controls: any) {
    const i = Math.min(1, Math.max(0, this.cameraInertia));
    if (mode === "trackball") {
      const unlimited = i >= 0.999;
      controls.staticMoving = false;
      controls.dynamicDampingFactor = unlimited
        ? 0
        : THREE.MathUtils.lerp(0.42, 0.02, i);
      return;
    }
    if (mode === "arcball") {
      // Arcball inertia is animation-driven; lower damping => more glide.
      // Remap arcball response so 99% slider reaches full inertia.
      const arcI = Math.min(1, i / 0.99);
      controls.enableAnimations = arcI > 0.02 || arcI >= 0.999;
      controls.dampingFactor = arcI >= 0.999
        ? 0
        : THREE.MathUtils.lerp(45, 6, arcI);
      return;
    }
    // Orbit/current (both OrbitControls instances)
    controls.enableDamping = i > 0.02;
    controls.dampingFactor = THREE.MathUtils.lerp(0.18, 0.02, i);
    controls.autoRotate = false;
  }

  private attachControlEventHooks(mode: CameraControlMode, controls: any) {
    if ((mode === "current" || mode === "orbit") && controls?.addEventListener) {
      controls.addEventListener("start", this.onControlSpinStart);
      controls.addEventListener("change", this.onControlSpinChange);
      controls.addEventListener("end", this.onControlSpinEnd);
    }
    if (mode === "current" && controls?.addEventListener) {
      controls.addEventListener("start", this.onOrbitStart);
    }
  }

  private detachControlEventHooks(mode: CameraControlMode, controls: any) {
    if ((mode === "current" || mode === "orbit") && controls?.removeEventListener) {
      controls.removeEventListener("start", this.onControlSpinStart);
      controls.removeEventListener("change", this.onControlSpinChange);
      controls.removeEventListener("end", this.onControlSpinEnd);
    }
    if (mode === "current" && controls?.removeEventListener) {
      controls.removeEventListener("start", this.onOrbitStart);
    }
  }

  private disposeCurrentControls() {
    if (this.controls?.dispose) this.controls.dispose();
  }

  private getControlTarget() {
    const t = this.controls?.target as THREE.Vector3 | undefined;
    if (t?.copy) return t;
    return this.controlTargetFallback;
  }

  private setControlTarget(v: THREE.Vector3) {
    this.controlTargetFallback.copy(v);
    const t = this.controls?.target as THREE.Vector3 | undefined;
    if (t?.copy) t.copy(v);
  }

  setCameraControlMode(mode: CameraControlMode) {
    if (mode === this.controlMode) return;
    const savedPos = this.camera.position.clone();
    const savedUp = this.camera.up.clone();
    const savedTarget = this.getControlTarget().clone();
    this.detachControlEventHooks(this.controlMode, this.controls);
    this.disposeCurrentControls();
    this.controlMode = mode;
    this.controls = this.createControlsForMode(this.controlMode);
    this.setControlTarget(savedTarget);
    this.camera.position.copy(savedPos);
    this.camera.up.copy(savedUp);
    if (mode === "current") {
      // Keep OrbitControls input axes consistent when switching from free-roll modes.
      const upSign: 1 | -1 = this.camera.up.z < 0 ? -1 : 1;
      this.enforceCardinalUpForOrbit(upSign);
      this.camera.lookAt(this.getControlTarget());
    } else if (mode === "orbit") {
      // Arcball/Trackball may leave rolled/twisted camera state. Rebuild
      // a deterministic Orbit camera basis with canonical +Z up.
      const target = this.getControlTarget().clone();
      const offset = this.camera.position.clone().sub(target);
      const dist = Math.max(1, offset.length());
      if (offset.lengthSq() < 1e-9) offset.set(1, -1, 1);
      offset.normalize();
      const zUp = new THREE.Vector3(0, 0, 1);
      if (Math.abs(offset.dot(zUp)) > 0.9995) {
        offset.add(new THREE.Vector3(0.0015, 0.0015, 0)).normalize();
      }
      this.camera.up.copy(zUp);
      this.camera.position.copy(target).addScaledVector(offset, dist);
      this.camera.lookAt(target);
      this.setControlTarget(target);
      this.controls.update?.();
      this.controls.saveState?.();
    }
    this.attachControlEventHooks(this.controlMode, this.controls);
    this.axisSnapAnim = null;
    this.lastSnapWasTopBottom = false;
    this.orbitSpinTracking = false;
    this.orbitSpinActive = false;
    this.orbitSpinVelocity.set(0, 0);
    this.controls.update?.();
  }

  setCameraInertia(value: number) {
    const next = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : this.cameraInertia;
    this.cameraInertia = next;
    this.applyCameraInertiaToControls(this.controlMode, this.controls);
    this.applyCameraInertiaToVisualControls();
    // Avoid forcing an immediate control-step in Trackball/Arcball; that can
    // consume stale internal deltas and cause an apparent camera snap/jump.
    if (this.controlMode === "current" || this.controlMode === "orbit") {
      this.controls.update?.();
    }
  }

  setAutoSpinEnabled(v: boolean) {
    this.autoSpinEnabled = !!v;
  }

  getAutoSpinEnabled() {
    return this.autoSpinEnabled;
  }

  setAutoSpinSpeed(value: number) {
    const next = Number.isFinite(value) ? THREE.MathUtils.clamp(value, -20, 20) : this.autoSpinSpeedRadPerSec;
    this.autoSpinSpeedRadPerSec = next;
  }

  getAutoSpinSpeed() {
    return this.autoSpinSpeedRadPerSec;
  }

  setMomentumDecaySeconds(seconds: number | null) {
    if (seconds == null) {
      this.momentumDecaySeconds = null;
      return;
    }
    if (!Number.isFinite(seconds)) {
      this.momentumDecaySeconds = Infinity;
      return;
    }
    this.momentumDecaySeconds = Math.max(0.001, seconds);
  }

  getMomentumDecaySeconds() {
    return this.momentumDecaySeconds;
  }

  // Backward-compatible aliases for existing UI wiring.
  setOrbitSpinEnabled(v: boolean) {
    this.setAutoSpinEnabled(v);
  }

  getOrbitSpinEnabled() {
    return this.getAutoSpinEnabled();
  }

  setZoomStopsInertia(v: boolean) {
    this.zoomStopsInertia = !!v;
  }

  getZoomStopsInertia() {
    return this.zoomStopsInertia;
  }

  getCameraControlMode(): CameraControlMode {
    return this.controlMode;
  }

  private getVisualSceneActiveCamera() {
    if (this.visualSceneMode === "stars") return this.starsCamera;
    if (this.visualSceneMode === "nebula") return this.nebulaCamera;
    if (this.visualSceneMode === "swarm") return this.swarmCamera;
    return null;
  }

  private getVisualSceneActiveControls() {
    if (this.visualSceneMode === "stars") return this.starsControls;
    if (this.visualSceneMode === "nebula") return this.nebulaControls;
    if (this.visualSceneMode === "swarm") return this.swarmControls;
    return null;
  }

  setVisualSceneMode(mode: VisualSceneMode) {
    const next = mode ?? "off";
    if (next === this.visualSceneMode) return;
    const prevActiveCamera = this.getVisualSceneActiveCamera();
    const prevActiveControls = this.getVisualSceneActiveControls();
    const transitionCameraPos = (prevActiveCamera ?? this.camera).position.clone();
    const transitionCameraUp = (prevActiveCamera ?? this.camera).up.clone();
    const transitionTarget = (prevActiveControls?.target as THREE.Vector3 | undefined)?.clone?.() ?? this.getControlTarget().clone();

    if (next !== "off") {
      if (!this.starsSavedState) {
        this.starsSavedState = {
          cameraPos: this.camera.position.clone(),
          cameraUp: this.camera.up.clone(),
          target: this.getControlTarget().clone(),
          mode: this.controlMode,
          orthoLikeEnabled: this.orthoLikeEnabled,
          fov: this.camera.fov,
        };
      }
      if (this.controls) this.controls.enabled = false;
      this.orbitSpinActive = false;
      this.axisSnapAnim = null;
      this.setAxisHoverTarget(null);
      this.starsSpinTracking = false;
      this.starsSpinActive = false;
      this.starsSpinVelocity.set(0, 0);
    }

    if (next === "stars") {
      this.ensureStarsScene();
    } else if (next === "nebula") {
      this.ensureNebulaScene();
      this.nebulaSpinLastMs = 0;
      this.nebulaSpinTracking = false;
      this.nebulaSpinActive = false;
      this.nebulaSpinVelocity.set(0, 0);
      this.nebulaCentrifugalScale = 1;
    } else if (next === "swarm") {
      this.ensureSwarmScene();
      this.swarmSpinLastMs = 0;
      this.swarmSpinTracking = false;
      this.swarmSpinActive = false;
      this.swarmSpinVelocity.set(0, 0);
      this.swarmCentrifugalScale = 1;
      this.swarmAnimProgress = 0;
      this.swarmAnimManualOverride = false;
    }

    this.visualSceneMode = next;
    if (next === "off") {
      if (this.starsControls) this.starsControls.enabled = false;
      if (this.nebulaControls) this.nebulaControls.enabled = false;
      if (this.swarmControls) this.swarmControls.enabled = false;
      this.starsSpinTracking = false;
      this.starsSpinActive = false;
      this.starsSpinVelocity.set(0, 0);
      this.nebulaSpinTracking = false;
      this.nebulaSpinActive = false;
      this.nebulaSpinVelocity.set(0, 0);
      this.swarmSpinTracking = false;
      this.swarmSpinActive = false;
      this.swarmSpinVelocity.set(0, 0);
      if (this.controls) this.controls.enabled = true;
      if (this.starsSavedState) {
        this.camera.position.copy(this.starsSavedState.cameraPos);
        this.camera.up.copy(this.starsSavedState.cameraUp);
        this.setControlTarget(this.starsSavedState.target);
        this.orthoLikeEnabled = this.starsSavedState.orthoLikeEnabled;
        this.camera.fov = this.starsSavedState.fov;
        this.camera.updateProjectionMatrix();
        this.controls.update?.();
        this.starsSavedState = null;
      }
      return;
    }

    if (this.starsControls) this.starsControls.enabled = next === "stars";
    if (this.nebulaControls) this.nebulaControls.enabled = next === "nebula";
    if (this.swarmControls) this.swarmControls.enabled = next === "swarm";
    const activeCamera = this.getVisualSceneActiveCamera();
    const activeControls = this.getVisualSceneActiveControls();
    if (activeCamera) {
      activeCamera.position.copy(transitionCameraPos);
      activeCamera.up.copy(transitionCameraUp);
      const srcCamera = prevActiveCamera ?? this.camera;
      activeCamera.fov = srcCamera.fov;
      activeCamera.near = srcCamera.near;
      activeCamera.far = srcCamera.far;
      activeCamera.aspect = srcCamera.aspect;
      activeCamera.updateProjectionMatrix();
    }
    if (activeControls) {
      activeControls.target.copy(transitionTarget);
      activeCamera?.lookAt(activeControls.target);
      activeControls.update?.();
    }
  }

  getVisualSceneMode(): VisualSceneMode {
    return this.visualSceneMode;
  }

  toggleVisualScene(mode: Exclude<VisualSceneMode, "off">) {
    this.setVisualSceneMode(this.visualSceneMode === mode ? "off" : mode);
  }

  // Backward-compatible stars API shims.
  setStarsModeActive(active: boolean) {
    this.setVisualSceneMode(active ? "stars" : "off");
  }

  getStarsModeActive() {
    return this.visualSceneMode === "stars";
  }

  toggleStarsMode() {
    this.toggleVisualScene("stars");
  }

  setStarsMotionScale(value: number) {
    const v = Number.isFinite(value) ? Math.max(0, value) : this.starsMotionScale;
    this.starsMotionScale = v;
  }

  setStarsGlowScale(value: number) {
    const v = Number.isFinite(value) ? Math.max(0, value) : this.starsGlowScale;
    this.starsGlowScale = v;
    for (const node of this.starsNodes) {
      const mat = node.mesh.material as THREE.MeshStandardMaterial;
      if (!mat) continue;
      mat.emissiveIntensity = 0.85 * this.starsGlowScale;
      mat.needsUpdate = true;
    }
  }

  setStarsWireOpacity(value: number) {
    const v = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : this.starsWireOpacity;
    this.starsWireOpacity = v;
    const mat = this.starsWireSegments?.material as THREE.LineBasicMaterial | undefined;
    if (mat) {
      mat.opacity = this.starsWireOpacity;
      mat.needsUpdate = true;
    }
  }

  setStarsLineLikelihood(value: number) {
    const v = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : this.starsLineLikelihood;
    this.starsLineLikelihood = v;
  }

  setStarsLineDistanceScale(value: number) {
    const v = Number.isFinite(value) ? Math.min(10, Math.max(0.1, value)) : 1;
    this.starsWireMaxDist = STARS_WIRE_MAX_DIST * v;
    if (this.starsWireSegments) this.updateStarsWireGeometry();
  }

  setStarsNodeScale(value: number) {
    const v = Number.isFinite(value) ? Math.max(0.1, value) : this.starsNodeScale;
    this.starsNodeScale = v;
    for (const node of this.starsNodes) {
      node.mesh.scale.setScalar(this.starsNodeScale);
    }
  }

  setStarsDistanceScale(value: number) {
    const v = Number.isFinite(value) ? Math.max(0.1, value) : this.starsDistanceScale;
    this.starsDistanceScale = v;
  }

  setStarsNodeCount(value: number) {
    const next = Number.isFinite(value)
      ? Math.round(Math.min(STARS_NODE_COUNT_MAX, Math.max(20, value)))
      : this.starsNodeCount;
    if (next === this.starsNodeCount) return;
    this.starsNodeCount = next;
    if (this.starsScene && this.starsNodeGroup) this.rebuildStarsNodeSystem();
  }

  setNebulaDensity(value: number) {
    this.nebulaDensity = Number.isFinite(value) ? Math.min(10, Math.max(0.1, value)) : this.nebulaDensity;
  }

  setNebulaScale(value: number) {
    this.nebulaScale = Number.isFinite(value) ? Math.min(10, Math.max(0.2, value)) : this.nebulaScale;
  }

  setNebulaTurbulence(value: number) {
    this.nebulaTurbulence = Number.isFinite(value) ? Math.min(1.5, Math.max(0, value)) : this.nebulaTurbulence;
  }

  setNebulaDrift(value: number) {
    this.nebulaDrift = Number.isFinite(value) ? Math.min(3, Math.max(0, value)) : this.nebulaDrift;
  }

  setNebulaGlow(value: number) {
    this.nebulaGlow = Number.isFinite(value) ? Math.min(3, Math.max(0, value)) : this.nebulaGlow;
  }

  setNebulaColorShift(value: number) {
    this.nebulaColorShift = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : this.nebulaColorShift;
  }

  setSwarmCount(value: number) {
    const next = Number.isFinite(value) ? Math.round(Math.min(SWARM_COUNT_MAX, Math.max(50, value))) : this.swarmCount;
    if (next === this.swarmCount) return;
    this.swarmCount = next;
    this.rebuildSwarmAgents();
  }

  setSwarmSpeed(value: number) {
    this.swarmSpeed = Number.isFinite(value) ? Math.min(3, Math.max(0.1, value)) : this.swarmSpeed;
  }

  setSwarmCohesion(value: number) {
    this.swarmCohesion = Number.isFinite(value) ? Math.min(2, Math.max(0, value)) : this.swarmCohesion;
  }

  setSwarmSeparation(value: number) {
    this.swarmSeparation = Number.isFinite(value) ? Math.min(2, Math.max(0, value)) : this.swarmSeparation;
  }

  setSwarmAlignment(value: number) {
    this.swarmAlignment = Number.isFinite(value) ? Math.min(2, Math.max(0, value)) : this.swarmAlignment;
  }

  setSwarmJitter(value: number) {
    this.swarmJitter = Number.isFinite(value) ? Math.min(2, Math.max(0, value)) : this.swarmJitter;
  }

  setSwarmSpinDecaySeconds(seconds: number | null) {
    if (seconds == null) {
      this.swarmSpinDecaySeconds = null;
      return;
    }
    if (!Number.isFinite(seconds)) {
      this.swarmSpinDecaySeconds = Infinity;
      return;
    }
    this.swarmSpinDecaySeconds = Math.max(0.001, seconds);
  }

  getSwarmSpinDecaySeconds() {
    return this.swarmSpinDecaySeconds;
  }

  setSwarmAnimationProgressPercent(percent: number) {
    const v = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
    this.swarmAnimProgress = v / 100;
    this.swarmAnimManualOverride = true;
    // Allow manual reverse to collapse/expand immediately.
    this.swarmCentrifugalScale = 1 + this.swarmAnimProgress;
  }

  getSwarmAnimationProgressPercent() {
    return Math.round(this.swarmAnimProgress * 100);
  }

  setSwarmExplodeEnabled(enabled: boolean) {
    this.swarmExplodeEnabled = !!enabled;
  }

  getSwarmExplodeEnabled() {
    return this.swarmExplodeEnabled;
  }

  setSwarmExplodeStrength(value: number) {
    this.swarmExplodeStrength = Number.isFinite(value) ? Math.min(3, Math.max(0, value)) : this.swarmExplodeStrength;
  }


  private ensureStarsScene() {
    if (this.starsScene && this.starsCamera && this.starsNodeGroup && this.starsControls) return;

    this.starsScene = new THREE.Scene();
    this.starsScene.background = null;

    this.starsCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 4000);
    this.starsCamera.up.set(0, 0, 1);
    this.starsCamera.position.set(220, 180, 220);
    this.starsCamera.lookAt(0, 0, 0);
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.starsCamera.aspect = w / h;
    this.starsCamera.updateProjectionMatrix();

    this.starsControls = new OrbitControls(this.starsCamera, this.renderer.domElement);
    this.starsControls.rotateSpeed = 0.5;
    this.starsControls.zoomSpeed = 0.9;
    this.starsControls.panSpeed = 0.7;
    this.starsControls.screenSpacePanning = false;
    this.applyCameraInertiaToVisualControls();
    this.starsControls.enabled = false;
    this.starsControls.target.set(0, 0, 0);
    this.starsControls.addEventListener("start", this.onStarsControlSpinStart);
    this.starsControls.addEventListener("change", this.onStarsControlSpinChange);
    this.starsControls.addEventListener("end", this.onStarsControlSpinEnd);

    const ambient = new THREE.AmbientLight(0x88aaff, 0.35);
    const key = new THREE.PointLight(0x66ccff, 1.15, 1200, 1.5);
    key.position.set(160, 120, 220);
    const fill = new THREE.PointLight(0xaac6ff, 0.6, 1400, 1.7);
    fill.position.set(-220, -160, -120);
    this.starsScene.add(ambient, key, fill);

    this.starsNodeGroup = new THREE.Group();
    this.starsNodeGroup.name = "starsNodeGroup";
    this.starsScene.add(this.starsNodeGroup);
    this.rebuildStarsNodeSystem();
  }

  private rebuildStarsNodeSystem() {
    if (!this.starsScene || !this.starsNodeGroup) return;
    if (!this.starsNodeGeometry) this.starsNodeGeometry = new THREE.SphereGeometry(2.4, 12, 12);

    if (this.starsWireSegments) {
      this.starsScene.remove(this.starsWireSegments);
      const wireGeo = this.starsWireSegments.geometry as THREE.BufferGeometry;
      const wireMat = this.starsWireSegments.material as THREE.Material;
      wireGeo.dispose();
      wireMat.dispose();
      this.starsWireSegments = null;
    }

    for (const node of this.starsNodes) {
      const mat = node.mesh.material as THREE.Material | undefined;
      mat?.dispose?.();
    }
    this.starsNodes = [];
    this.starsNodeGroup.clear();

    const palette = [0x70d4ff, 0x66a3ff, 0xc6e2ff, 0x8cc8ff, 0x5de0ff];
    for (let i = 0; i < this.starsNodeCount; i++) {
      const c = palette[i % palette.length];
      const mat = new THREE.MeshStandardMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 0.85 * this.starsGlowScale,
        metalness: 0.1,
        roughness: 0.35,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(this.starsNodeGeometry, mat);
      const pivot = new THREE.Object3D();
      const axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
      const radius = 35 + Math.random() * (STARS_CLUSTER_RADIUS - 35);
      const phase = Math.random() * Math.PI * 2;
      const speed = 0.06 + Math.random() * 0.28;
      mesh.position.set(radius, 0, 0);
      mesh.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), phase);
      pivot.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis.clone().add(new THREE.Vector3(1e-4, 0, 0)).normalize());
      pivot.add(mesh);
      mesh.scale.setScalar(this.starsNodeScale);
      this.starsNodeGroup.add(pivot);
      this.starsNodes.push({ mesh, pivot, phase, speed, radius, axis });
    }

    const maxPairs = (this.starsNodeCount * (this.starsNodeCount - 1)) / 2;
    this.starsWirePositions = new Float32Array(maxPairs * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(this.starsWirePositions, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x7fb9ff,
      transparent: true,
      opacity: this.starsWireOpacity,
      depthTest: true,
      depthWrite: false,
    });
    this.starsWireSegments = new THREE.LineSegments(lineGeo, lineMat);
    this.starsScene.add(this.starsWireSegments);
    this.updateStarsWireGeometry();
  }

  private ensureNebulaScene() {
    if (this.nebulaScene && this.nebulaCamera && this.nebulaControls && this.nebulaClouds.length > 0) return;

    this.nebulaScene = new THREE.Scene();
    this.nebulaScene.background = null;
    this.nebulaCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 4000);
    this.nebulaCamera.up.set(0, 0, 1);
    this.nebulaCamera.position.set(220, 180, 220);
    this.nebulaCamera.lookAt(0, 0, 0);
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.nebulaCamera.aspect = w / h;
    this.nebulaCamera.updateProjectionMatrix();

    this.nebulaControls = new OrbitControls(this.nebulaCamera, this.renderer.domElement);
    this.nebulaControls.rotateSpeed = 0.5;
    this.nebulaControls.zoomSpeed = 0.9;
    this.nebulaControls.panSpeed = 0.7;
    this.nebulaControls.screenSpacePanning = false;
    this.nebulaControls.enabled = false;
    this.nebulaControls.target.set(0, 0, 0);
    this.nebulaControls.addEventListener("start", this.onNebulaControlSpinStart);
    this.nebulaControls.addEventListener("change", this.onNebulaControlSpinChange);
    this.nebulaControls.addEventListener("end", this.onNebulaControlSpinEnd);

    const ambient = new THREE.AmbientLight(0x88aaff, 0.55);
    const key = new THREE.PointLight(0x8ebfff, 1.2, 1800, 1.7);
    key.position.set(120, 260, 300);
    this.nebulaScene.add(ambient, key);

    const layerDefs = [
      { color: 0x6eb1ff, alpha: 0.45, size: 2.2, spread: 1.0 },
      { color: 0x7b6fff, alpha: 0.35, size: 2.9, spread: 1.35 },
      { color: 0x9ed6ff, alpha: 0.28, size: 1.8, spread: 0.72 },
    ];
    this.nebulaClouds = [];
    this.nebulaCloudBasePositions = [];
    const totalCount = NEBULA_POINTS_MAX;
    for (let layer = 0; layer < layerDefs.length; layer++) {
      const def = layerDefs[layer];
      const count = Math.floor(totalCount / layerDefs.length);
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const c = new THREE.Color(def.color);
      for (let i = 0; i < count; i++) {
        const r = Math.random() * STARS_CLUSTER_RADIUS * def.spread;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const x = Math.sin(p) * Math.cos(t) * r;
        const y = Math.sin(p) * Math.sin(t) * r;
        const z = Math.cos(p) * r * 0.6;
        positions[i * 3 + 0] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.setDrawRange(0, count);
      const mat = new THREE.PointsMaterial({
        size: def.size,
        transparent: true,
        opacity: def.alpha,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      this.nebulaScene.add(points);
      this.nebulaClouds.push(points);
      this.nebulaCloudBasePositions.push(positions);
    }
    this.applyCameraInertiaToVisualControls();
  }

  private ensureSwarmScene() {
    if (this.swarmScene && this.swarmCamera && this.swarmControls && this.swarmPoints) return;

    this.swarmScene = new THREE.Scene();
    this.swarmScene.background = null;
    this.swarmCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 5000);
    this.swarmCamera.up.set(0, 0, 1);
    this.swarmCamera.position.set(220, 180, 220);
    this.swarmCamera.lookAt(0, 0, 0);
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.swarmCamera.aspect = w / h;
    this.swarmCamera.updateProjectionMatrix();

    this.swarmControls = new OrbitControls(this.swarmCamera, this.renderer.domElement);
    this.swarmControls.rotateSpeed = 0.55;
    this.swarmControls.zoomSpeed = 0.9;
    this.swarmControls.panSpeed = 0.7;
    this.swarmControls.screenSpacePanning = false;
    this.swarmControls.enabled = false;
    this.swarmControls.target.set(0, 0, 0);
    this.swarmControls.addEventListener("start", this.onSwarmControlSpinStart);
    this.swarmControls.addEventListener("change", this.onSwarmControlSpinChange);
    this.swarmControls.addEventListener("end", this.onSwarmControlSpinEnd);

    const ambient = new THREE.AmbientLight(0x9abaff, 0.5);
    const key = new THREE.PointLight(0x76d2ff, 1.0, 1400, 1.5);
    key.position.set(220, 120, 220);
    this.swarmScene.add(ambient, key);

    const geo = new THREE.BufferGeometry();
    this.swarmPositions = new Float32Array(SWARM_COUNT_MAX * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(this.swarmPositions, 3));
    geo.setDrawRange(0, this.swarmCount);
    const mat = new THREE.PointsMaterial({
      color: 0x8fd6ff,
      size: 2.0,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.swarmPoints = new THREE.Points(geo, mat);
    this.swarmScene.add(this.swarmPoints);
    this.rebuildSwarmAgents();
    this.applyCameraInertiaToVisualControls();
  }

  private updateStars(dt: number) {
    if (!this.starsScene || !this.starsNodeGroup || !this.starsCamera || !this.starsControls) return;
    const spinMag = Math.hypot(this.starsSpinVelocity.x, this.starsSpinVelocity.y);
    const spinActiveNow = this.starsSpinTracking || this.starsSpinActive;
    const centrifugalTarget = spinActiveNow
      ? Math.min(1.9, 1 + spinMag * 0.18)
      : 1;
    this.starsCentrifugalScale = THREE.MathUtils.lerp(
      this.starsCentrifugalScale,
      centrifugalTarget,
      Math.min(1, dt * 4.5)
    );
    const radialScale = this.starsCentrifugalScale;
    const axialScale = THREE.MathUtils.lerp(1, 0.82, Math.min(1, Math.max(0, this.starsCentrifugalScale - 1)));

    for (let i = 0; i < this.starsNodes.length; i++) {
      const node = this.starsNodes[i];
      node.phase += node.speed * dt * this.starsMotionScale;
      node.pivot.rotation.x += (0.07 + node.speed * 0.15) * dt * this.starsMotionScale;
      node.pivot.rotation.y += (0.11 + node.speed * 0.2) * dt * this.starsMotionScale;
      const r = node.radius * this.starsDistanceScale * radialScale;
      node.mesh.position.set(
        Math.cos(node.phase) * r,
        Math.sin(node.phase * 0.8) * (r * 0.55),
        Math.sin(node.phase) * (r * 0.45 * axialScale)
      );
    }
    this.updateStarsWireGeometry();
    this.starsNodeGroup.rotation.z += 0.03 * dt;
    this.starsNodeGroup.rotation.y += 0.018 * dt;

    if (
      this.starsSpinActive &&
      !this.starsSpinTracking &&
      this.starsControls?.rotateLeft &&
      this.starsControls?.rotateUp
    ) {
      this.starsControls.rotateLeft(-this.starsSpinVelocity.x * dt);
      this.starsControls.rotateUp(-this.starsSpinVelocity.y * dt);
      const decayPerSec = this.getMomentumDecayPerSec();
      if (decayPerSec > 0 && !this.isZoomMomentumHoldActive()) {
        const decay = Math.exp(-decayPerSec * dt);
        this.starsSpinVelocity.multiplyScalar(decay);
        if (Math.hypot(this.starsSpinVelocity.x, this.starsSpinVelocity.y) < 0.005) {
          this.starsSpinActive = false;
        }
      }
    }

    // Keep entry seamless: do not force target recenter on stars mode.
    if (!this.starsControls.enabled) this.starsControls.enabled = true;
    this.starsControls.update();
    this.syncMainCameraFromVisualScene();
  }

  private updateNebula(dt: number) {
    if (!this.nebulaScene || !this.nebulaCamera || !this.nebulaControls) return;
    if (
      this.nebulaSpinActive &&
      !this.nebulaSpinTracking &&
      this.nebulaControls?.rotateLeft &&
      this.nebulaControls?.rotateUp
    ) {
      this.nebulaControls.rotateLeft(-this.nebulaSpinVelocity.x * dt);
      this.nebulaControls.rotateUp(-this.nebulaSpinVelocity.y * dt);
      const decayPerSec = this.getMomentumDecayPerSec();
      if (decayPerSec > 0 && !this.isZoomMomentumHoldActive()) {
        const decay = Math.exp(-Math.max(0.01, decayPerSec) * dt);
        this.nebulaSpinVelocity.multiplyScalar(decay);
        if (Math.hypot(this.nebulaSpinVelocity.x, this.nebulaSpinVelocity.y) < 0.005) {
          this.nebulaSpinActive = false;
        }
      }
    }
    const nebulaSpinMag = Math.hypot(this.nebulaSpinVelocity.x, this.nebulaSpinVelocity.y);
    const nebulaCentrifugalTarget = Math.min(2.0, 1 + nebulaSpinMag * 0.2);
    this.nebulaCentrifugalScale = THREE.MathUtils.lerp(
      this.nebulaCentrifugalScale,
      nebulaCentrifugalTarget,
      Math.min(1, dt * 4.5)
    );
    for (let layer = 0; layer < this.nebulaClouds.length; layer++) {
      const points = this.nebulaClouds[layer];
      const base = this.nebulaCloudBasePositions[layer];
      const posAttr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
      if (!posAttr || !base) continue;
      const out = posAttr.array as Float32Array;
      const layerPhase = layer * 0.9;
      for (let i = 0; i < out.length; i += 3) {
        const bx = base[i + 0] * this.nebulaScale * this.nebulaCentrifugalScale;
        const by = base[i + 1] * this.nebulaScale * this.nebulaCentrifugalScale;
        const bz = base[i + 2] * this.nebulaScale * THREE.MathUtils.lerp(1, 0.85, this.nebulaCentrifugalScale - 1);
        const n = (i * 0.007 + performance.now() * 0.00015 * this.nebulaDrift + layerPhase);
        const wobble = Math.sin(n) * this.nebulaTurbulence * 6;
        out[i + 0] = bx + wobble;
        out[i + 1] = by + Math.cos(n * 0.8) * this.nebulaTurbulence * 6;
        out[i + 2] = bz + Math.sin(n * 1.3) * this.nebulaTurbulence * 4;
      }
      // Keep 100% density (value=1.0) near the historical baseline point count,
      // and allow slider values above 100% to progressively reveal more particles.
      const visibleRatio = Math.min(1, Math.max(0.01, this.nebulaDensity / 10));
      const maxVisible = Math.min(out.length / 3, Math.floor((out.length / 3) * visibleRatio));
      points.geometry.setDrawRange(0, maxVisible);
      posAttr.needsUpdate = true;
      const mat = points.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.clamp((0.18 + this.nebulaGlow * 0.2) * (0.7 + layer * 0.15), 0, 1);
      mat.size = (1.6 + layer * 0.55) * THREE.MathUtils.lerp(0.85, 1.5, this.nebulaGlow / 3);
      const cool = new THREE.Color(0x6eb1ff);
      const warm = new THREE.Color(0xff8cc2);
      mat.color.copy(cool).lerp(warm, this.nebulaColorShift);
    }
    if (!this.nebulaControls.enabled) this.nebulaControls.enabled = true;
    this.nebulaControls.update();
    this.syncMainCameraFromVisualScene();
  }

  private rebuildSwarmAgents() {
    if (!this.swarmPositions || !this.swarmPoints) return;
    this.swarmAgents = [];
    for (let i = 0; i < this.swarmCount; i++) {
      const p = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(this.swarmBounds * 2),
        THREE.MathUtils.randFloatSpread(this.swarmBounds * 2),
        THREE.MathUtils.randFloatSpread(this.swarmBounds * 1.2)
      );
      const v = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1)
      ).normalize().multiplyScalar(24 * this.swarmSpeed);
      this.swarmAgents.push({ position: p, velocity: v });
      this.swarmPositions[i * 3 + 0] = p.x;
      this.swarmPositions[i * 3 + 1] = p.y;
      this.swarmPositions[i * 3 + 2] = p.z;
    }
    const attr = this.swarmPoints.geometry.getAttribute("position") as THREE.BufferAttribute;
    this.swarmPoints.geometry.setDrawRange(0, this.swarmCount);
    attr.needsUpdate = true;
  }

  private updateSwarm(dt: number) {
    if (!this.swarmScene || !this.swarmCamera || !this.swarmControls || !this.swarmPoints || !this.swarmPositions) return;
    const swarmSpinMag = Math.hypot(this.swarmSpinVelocity.x, this.swarmSpinVelocity.y);
    const spinInfluence = THREE.MathUtils.clamp(swarmSpinMag * 0.22, 0, 1.8);
    const targetProgress = THREE.MathUtils.clamp(spinInfluence / 1.8, 0, 1);
    if (!this.swarmAnimManualOverride) {
      // Keep auto progression one-way; manual slider can reverse it.
      this.swarmAnimProgress = Math.max(this.swarmAnimProgress, targetProgress);
    }
    const p = this.swarmAnimProgress;
    // Spin-response curve:
    // 1) low/moderate spin => slow swarm motion
    // 2) high spin => reverse swirl influence (without collapsing to center)
    const slowPhase = THREE.MathUtils.clamp(p / 0.55, 0, 1);
    let swarmMotionScale = THREE.MathUtils.lerp(1.0, 0.22, slowPhase);
    const reversePhase = p > 0.62
      ? THREE.MathUtils.clamp((p - 0.62) / 0.38, 0, 1)
      : 0;
    if (p > 0.62) {
      // Keep translation stable; reversal is expressed via swirl force instead.
      swarmMotionScale = THREE.MathUtils.lerp(0.22, 0.35, reversePhase);
    }
    const swarmCentrifugalTarget = 1 + p;
    this.swarmCentrifugalScale = THREE.MathUtils.lerp(
      this.swarmCentrifugalScale,
      swarmCentrifugalTarget,
      Math.min(1, dt * 5.5)
    );
    const count = this.swarmAgents.length;
    if (count === 0) return;
    const neighborRadiusSq = 42 * 42;
    const sepRadiusSq = 18 * 18;
    const dynamicCohesion = this.swarmCohesion * THREE.MathUtils.lerp(1.0, 0.5, p);
    const dynamicSeparation = this.swarmSeparation * THREE.MathUtils.lerp(1.0, 2.9, p);
    const dynamicAlignment = this.swarmAlignment * THREE.MathUtils.lerp(1.0, 1.25, p);
    const dynamicJitter = this.swarmJitter * THREE.MathUtils.lerp(1.0, 1.6, p);
    const temp = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const a = this.swarmAgents[i];
      const center = new THREE.Vector3();
      const avgVel = new THREE.Vector3();
      const separation = new THREE.Vector3();
      let neighbors = 0;
      for (let j = 0; j < count; j++) {
        if (i === j) continue;
        const b = this.swarmAgents[j];
        const d2 = a.position.distanceToSquared(b.position);
        if (d2 > neighborRadiusSq) continue;
        neighbors++;
        center.add(b.position);
        avgVel.add(b.velocity);
        if (d2 < sepRadiusSq && d2 > 1e-5) {
          temp.copy(a.position).sub(b.position).multiplyScalar(1 / d2);
          separation.add(temp);
        }
      }
      const accel = new THREE.Vector3();
      if (neighbors > 0) {
        center.multiplyScalar(1 / neighbors).sub(a.position).multiplyScalar(0.45 * dynamicCohesion);
        avgVel.multiplyScalar(1 / neighbors).sub(a.velocity).multiplyScalar(0.32 * dynamicAlignment);
        separation.multiplyScalar(1.35 * dynamicSeparation);
        accel.add(center).add(avgVel).add(separation);
      }
      accel.add(new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2)
      ).multiplyScalar(0.55 * dynamicJitter));
      // Additional radial "push apart" feel while spinning.
      if (p > 0.02) {
        const radial = a.position.clone();
        const radialLenSq = radial.lengthSq();
        if (radialLenSq > 1e-6) {
          radial.normalize().multiplyScalar(0.52 * p);
          accel.add(radial);
        }
      }
      if (this.swarmExplodeEnabled) {
        const explodeRadial = a.position.clone();
        if (explodeRadial.lengthSq() > 1e-6) {
          explodeRadial.normalize().multiplyScalar(1.8 * this.swarmExplodeStrength);
          accel.add(explodeRadial);
        }
      }
      // Swirl around Z; flips at high spin (reversePhase).
      const swirl = new THREE.Vector3(-a.position.y, a.position.x, 0);
      if (swirl.lengthSq() > 1e-6) {
        const swirlSign = reversePhase > 0 ? -1 : 1;
        swirl.normalize().multiplyScalar(0.22 * p * swirlSign);
        accel.add(swirl);
      }
      // Reduce inward centering as spin rises; push outward at strong spin.
      const centerScalar = this.swarmExplodeEnabled
        ? THREE.MathUtils.lerp(0.0006, 0.004, Math.min(1, this.swarmExplodeStrength / 3))
        : THREE.MathUtils.lerp(-0.0028, 0.0018, p);
      accel.add(a.position.clone().multiplyScalar(centerScalar));
      a.velocity.addScaledVector(accel, dt * 60);
      const maxSpeed = 42 * this.swarmSpeed;
      if (a.velocity.lengthSq() > maxSpeed * maxSpeed) a.velocity.setLength(maxSpeed);
      a.position.addScaledVector(a.velocity, dt * Math.max(0.05, swarmMotionScale));
      if (Math.abs(a.position.x) > this.swarmBounds) a.velocity.x *= -1;
      if (Math.abs(a.position.y) > this.swarmBounds) a.velocity.y *= -1;
      if (Math.abs(a.position.z) > this.swarmBounds * 0.9) a.velocity.z *= -1;
      a.position.x = THREE.MathUtils.clamp(a.position.x, -this.swarmBounds, this.swarmBounds);
      a.position.y = THREE.MathUtils.clamp(a.position.y, -this.swarmBounds, this.swarmBounds);
      a.position.z = THREE.MathUtils.clamp(a.position.z, -this.swarmBounds * 0.9, this.swarmBounds * 0.9);
      this.swarmPositions[i * 3 + 0] = a.position.x * this.swarmCentrifugalScale;
      this.swarmPositions[i * 3 + 1] = a.position.y * this.swarmCentrifugalScale;
      this.swarmPositions[i * 3 + 2] = a.position.z * THREE.MathUtils.lerp(1, 0.88, this.swarmCentrifugalScale - 1);
    }
    const attr = this.swarmPoints.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.needsUpdate = true;
    if (!this.swarmControls.enabled) this.swarmControls.enabled = true;
    if (this.swarmSpinActive && !this.swarmSpinTracking && this.swarmControls?.rotateLeft && this.swarmControls?.rotateUp) {
      this.swarmControls.rotateLeft(-this.swarmSpinVelocity.x * dt);
      this.swarmControls.rotateUp(-this.swarmSpinVelocity.y * dt);
      const decayPerSec = this.getSwarmMomentumDecayPerSec();
      if (decayPerSec > 0 && !this.isZoomMomentumHoldActive()) {
        const decay = Math.exp(-decayPerSec * dt);
        this.swarmSpinVelocity.multiplyScalar(decay);
        if (Math.hypot(this.swarmSpinVelocity.x, this.swarmSpinVelocity.y) < 0.005) {
          this.swarmSpinActive = false;
        }
      }
    }
    this.swarmControls.update();
    this.syncMainCameraFromVisualScene();
  }

  private syncMainCameraFromVisualScene() {
    const camera = this.getVisualSceneActiveCamera();
    const controls = this.getVisualSceneActiveControls();
    if (!camera || !controls) return;
    this.camera.position.copy(camera.position);
    this.camera.quaternion.copy(camera.quaternion);
    this.camera.up.copy(camera.up);
    this.camera.fov = camera.fov;
    this.camera.near = camera.near;
    this.camera.far = camera.far;
    this.camera.updateProjectionMatrix();
    this.setControlTarget(controls.target);
  }

  private applyCameraInertiaToVisualControls() {
    const i = Math.min(1, Math.max(0, this.cameraInertia));
    const applyOrbitLike = (controls: any) => {
      if (!controls) return;
      controls.enableDamping = i > 0.02;
      controls.dampingFactor = THREE.MathUtils.lerp(0.2, 0.015, i);
    };
    applyOrbitLike(this.starsControls);
    applyOrbitLike(this.nebulaControls);
    applyOrbitLike(this.swarmControls);
  }

  private getMomentumDecayPerSec() {
    if (this.momentumDecaySeconds != null) {
      return Number.isFinite(this.momentumDecaySeconds)
        ? Math.log(100) / Math.max(0.001, this.momentumDecaySeconds)
        : 0;
    }
    const inertia = Math.min(1, Math.max(0, this.cameraInertia));
    const shaped = Math.pow(inertia, 1.6);
    return inertia >= 0.999 ? 0 : THREE.MathUtils.lerp(24.0, 0.12, shaped);
  }

  private getSwarmMomentumDecayPerSec() {
    if (this.swarmSpinDecaySeconds != null) {
      return Number.isFinite(this.swarmSpinDecaySeconds)
        ? Math.log(100) / Math.max(0.001, this.swarmSpinDecaySeconds)
        : 0;
    }
    return this.getMomentumDecayPerSec();
  }

  private onStarsControlSpinStart = () => {
    if (this.visualSceneMode !== "stars" || !this.starsControls?.getAzimuthalAngle || !this.starsControls?.getPolarAngle) return;
    this.starsSpinTracking = true;
    this.starsSpinLastMs = performance.now();
    this.starsSpinLastAzimuth = Number(this.starsControls.getAzimuthalAngle()) || 0;
    this.starsSpinLastPolar = Number(this.starsControls.getPolarAngle()) || 0;
    this.starsSpinActive = false;
    this.starsSpinVelocity.set(0, 0);
  };

  private onStarsControlSpinChange = () => {
    if (!this.starsSpinTracking || !this.starsControls?.getAzimuthalAngle || !this.starsControls?.getPolarAngle) return;
    const now = performance.now();
    const dt = Math.max(1e-3, (now - this.starsSpinLastMs) / 1000);
    const az = Number(this.starsControls.getAzimuthalAngle()) || 0;
    const pol = Number(this.starsControls.getPolarAngle()) || 0;
    const dAzRaw = az - this.starsSpinLastAzimuth;
    const dAz = Math.atan2(Math.sin(dAzRaw), Math.cos(dAzRaw));
    const dPol = pol - this.starsSpinLastPolar;
    this.starsSpinVelocity.x = THREE.MathUtils.lerp(this.starsSpinVelocity.x, dAz / dt, 0.35);
    this.starsSpinVelocity.y = THREE.MathUtils.lerp(this.starsSpinVelocity.y, dPol / dt, 0.35);
    this.starsSpinLastMs = now;
    this.starsSpinLastAzimuth = az;
    this.starsSpinLastPolar = pol;
  };

  private onStarsControlSpinEnd = () => {
    if (!this.starsSpinTracking) return;
    this.starsSpinTracking = false;
    const speed = Math.hypot(this.starsSpinVelocity.x, this.starsSpinVelocity.y);
    const inertia = Math.min(1, Math.max(0, this.cameraInertia));
    const minSpeedToKeep = THREE.MathUtils.lerp(0.12, 0.01, inertia);
    this.starsSpinActive = speed > minSpeedToKeep;
  };

  private onNebulaControlSpinStart = () => {
    if (this.visualSceneMode !== "nebula" || !this.nebulaControls?.getAzimuthalAngle || !this.nebulaControls?.getPolarAngle) return;
    this.nebulaSpinTracking = true;
    this.nebulaSpinLastMs = performance.now();
    this.nebulaSpinLastAzimuth = Number(this.nebulaControls.getAzimuthalAngle()) || 0;
    this.nebulaSpinLastPolar = Number(this.nebulaControls.getPolarAngle()) || 0;
    this.nebulaSpinActive = false;
    this.nebulaSpinVelocity.set(0, 0);
  };

  private onNebulaControlSpinChange = () => {
    if (!this.nebulaSpinTracking || !this.nebulaControls?.getAzimuthalAngle || !this.nebulaControls?.getPolarAngle) return;
    const now = performance.now();
    const dt = Math.max(1e-3, (now - this.nebulaSpinLastMs) / 1000);
    const az = Number(this.nebulaControls.getAzimuthalAngle()) || 0;
    const pol = Number(this.nebulaControls.getPolarAngle()) || 0;
    const dAzRaw = az - this.nebulaSpinLastAzimuth;
    const dAz = Math.atan2(Math.sin(dAzRaw), Math.cos(dAzRaw));
    const dPol = pol - this.nebulaSpinLastPolar;
    this.nebulaSpinVelocity.x = THREE.MathUtils.lerp(this.nebulaSpinVelocity.x, dAz / dt, 0.35);
    this.nebulaSpinVelocity.y = THREE.MathUtils.lerp(this.nebulaSpinVelocity.y, dPol / dt, 0.35);
    this.nebulaSpinLastMs = now;
    this.nebulaSpinLastAzimuth = az;
    this.nebulaSpinLastPolar = pol;
  };

  private onNebulaControlSpinEnd = () => {
    if (!this.nebulaSpinTracking) return;
    this.nebulaSpinTracking = false;
    const speed = Math.hypot(this.nebulaSpinVelocity.x, this.nebulaSpinVelocity.y);
    const inertia = Math.min(1, Math.max(0, this.cameraInertia));
    const minSpeedToKeep = THREE.MathUtils.lerp(0.12, 0.01, inertia);
    this.nebulaSpinActive = speed > minSpeedToKeep;
  };

  private onSwarmControlSpinStart = () => {
    if (this.visualSceneMode !== "swarm" || !this.swarmControls?.getAzimuthalAngle || !this.swarmControls?.getPolarAngle) return;
    this.swarmAnimManualOverride = false;
    this.swarmSpinTracking = true;
    this.swarmSpinLastMs = performance.now();
    this.swarmSpinLastAzimuth = Number(this.swarmControls.getAzimuthalAngle()) || 0;
    this.swarmSpinLastPolar = Number(this.swarmControls.getPolarAngle()) || 0;
    this.swarmSpinActive = false;
    this.swarmSpinVelocity.set(0, 0);
  };

  private onSwarmControlSpinChange = () => {
    if (!this.swarmSpinTracking || !this.swarmControls?.getAzimuthalAngle || !this.swarmControls?.getPolarAngle) return;
    const now = performance.now();
    const dt = Math.max(1e-3, (now - this.swarmSpinLastMs) / 1000);
    const az = Number(this.swarmControls.getAzimuthalAngle()) || 0;
    const pol = Number(this.swarmControls.getPolarAngle()) || 0;
    const dAzRaw = az - this.swarmSpinLastAzimuth;
    const dAz = Math.atan2(Math.sin(dAzRaw), Math.cos(dAzRaw));
    const dPol = pol - this.swarmSpinLastPolar;
    this.swarmSpinVelocity.x = THREE.MathUtils.lerp(this.swarmSpinVelocity.x, dAz / dt, 0.35);
    this.swarmSpinVelocity.y = THREE.MathUtils.lerp(this.swarmSpinVelocity.y, dPol / dt, 0.35);
    this.swarmSpinLastMs = now;
    this.swarmSpinLastAzimuth = az;
    this.swarmSpinLastPolar = pol;
  };

  private onSwarmControlSpinEnd = () => {
    if (!this.swarmSpinTracking) return;
    this.swarmSpinTracking = false;
    const speed = Math.hypot(this.swarmSpinVelocity.x, this.swarmSpinVelocity.y);
    const inertia = Math.min(1, Math.max(0, this.cameraInertia));
    const minSpeedToKeep = THREE.MathUtils.lerp(0.12, 0.01, inertia);
    this.swarmSpinActive = speed > minSpeedToKeep;
  };

  private updateStarsWireGeometry() {
    if (!this.starsWireSegments || !this.starsWirePositions) return;
    const world: THREE.Vector3[] = [];
    for (let i = 0; i < this.starsNodes.length; i++) {
      const p = new THREE.Vector3();
      this.starsNodes[i].mesh.getWorldPosition(p);
      world.push(p);
    }

    let cursor = 0;
    const maxLinksPerNode = 6;
    const linkCount = new Array(world.length).fill(0);
    const maxDistSq = this.starsWireMaxDist * this.starsWireMaxDist;
    for (let i = 0; i < world.length; i++) {
      if (linkCount[i] >= maxLinksPerNode) continue;
      for (let j = i + 1; j < world.length; j++) {
        if (linkCount[j] >= maxLinksPerNode) continue;
        const d2 = world[i].distanceToSquared(world[j]);
        if (d2 > maxDistSq) continue;
        const gate = this.starsPairHash01(i, j);
        if (gate > this.starsLineLikelihood) continue;
        this.starsWirePositions[cursor++] = world[i].x;
        this.starsWirePositions[cursor++] = world[i].y;
        this.starsWirePositions[cursor++] = world[i].z;
        this.starsWirePositions[cursor++] = world[j].x;
        this.starsWirePositions[cursor++] = world[j].y;
        this.starsWirePositions[cursor++] = world[j].z;
        linkCount[i]++;
        linkCount[j]++;
        if (linkCount[i] >= maxLinksPerNode) break;
      }
    }
    const posAttr = this.starsWireSegments.geometry.getAttribute("position") as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    this.starsWireSegments.geometry.setDrawRange(0, Math.floor(cursor / 3));
    this.starsWireSegments.geometry.computeBoundingSphere();
  }

  private starsPairHash01(i: number, j: number) {
    let x = (((i + 1) * 73856093) ^ ((j + 1) * 19349663)) >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  }

  setCameraFov(fovDeg: number) {
    const fov = Number.isFinite(fovDeg) ? Math.min(100, Math.max(5, fovDeg)) : this.camera.fov;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    if (!this.orthoLikeEnabled) this.savedPerspectiveFov = fov;
    this.applyCameraZoomToFocus();
  }

  getCameraFov() {
    return this.camera.fov;
  }

  setCameraZoomFactor(factor: number) {
    const next = Number.isFinite(factor) ? Math.min(4, Math.max(0.25, factor)) : this.cameraZoomFactor;
    this.cameraZoomFactor = next;
    this.applyCameraZoomToFocus();
  }

  getCameraZoomFactor() {
    const { radius } = this.getFocusSphere();
    const target = this.getControlTarget();
    const dist = Math.max(1e-6, this.camera.position.distanceTo(target));
    const fitDist = Math.max(1e-6, radius / Math.sin((this.camera.fov * Math.PI) / 360));
    const live = fitDist / dist;
    this.cameraZoomFactor = Math.min(4, Math.max(0.25, live));
    return this.cameraZoomFactor;
  }

  setPerspectiveView(shouldResetView = true) {
    this.orthoLikeEnabled = false;
    this.camera.fov = this.savedPerspectiveFov;
    this.camera.updateProjectionMatrix();
    if (shouldResetView) {
      // Keep projection toggle behavior consistent with orthographic mode.
      this.resetCameraView();
    } else {
      this.controls.update?.();
    }
  }

  private preserveFramingAcrossFovChange(nextFovDeg: number) {
    const nextFov = Math.max(0.1, nextFovDeg);
    const prevFov = Math.max(0.1, this.camera.fov);
    const target = this.getControlTarget();
    const dir = new THREE.Vector3().copy(this.camera.position).sub(target);
    const currentDist = Math.max(1e-6, dir.length());
    if (dir.lengthSq() < 1e-9) dir.set(-1, -1, 1);
    dir.normalize();

    const { radius } = this.getFocusSphere();
    const prevFitDist = Math.max(1e-6, radius / Math.sin((prevFov * Math.PI) / 360));
    const zoomFactor = Math.max(1e-3, prevFitDist / currentDist);
    const nextFitDist = Math.max(1e-6, radius / Math.sin((nextFov * Math.PI) / 360));
    const nextDist = Math.max(1, nextFitDist / zoomFactor);

    this.camera.position.copy(target).addScaledVector(dir, nextDist);
    this.camera.near = Math.max(0.1, nextDist / 1000);
    this.camera.far = Math.max(this.camera.far, nextDist * 1000);
  }

  setOrthographicLikeView() {
    if (!this.orthoLikeEnabled) this.savedPerspectiveFov = this.camera.fov;
    this.preserveFramingAcrossFovChange(2);
    this.orthoLikeEnabled = true;
    // Perspective camera with narrow FOV for practical orthographic-like viewing.
    this.camera.fov = 2;
    this.camera.updateProjectionMatrix();
    this.controls.update?.();
  }

  isOrthographicLikeView() {
    return this.orthoLikeEnabled;
  }

  snapToTopView() {
    this.snapCameraToDirection(new THREE.Vector3(0, 0, 1));
  }

  snapToFrontView() {
    this.snapCameraToDirection(new THREE.Vector3(0, -1, 0));
  }

  resetCameraView() {
    // Reset should fully stop momentum/inertia carry-over across all modes/scenes.
    this.axisSnapAnim = null;
    this.orbitSpinTracking = false;
    this.orbitSpinActive = false;
    this.orbitSpinVelocity.set(0, 0);
    this.starsSpinTracking = false;
    this.starsSpinActive = false;
    this.starsSpinVelocity.set(0, 0);
    this.nebulaSpinTracking = false;
    this.nebulaSpinActive = false;
    this.nebulaSpinVelocity.set(0, 0);
    this.swarmSpinTracking = false;
    this.swarmSpinActive = false;
    this.swarmSpinVelocity.set(0, 0);

    if (this.visualSceneMode !== "off") {
      const activeCamera = this.getVisualSceneActiveCamera();
      const activeControls = this.getVisualSceneActiveControls();
      if (activeCamera && activeControls) {
        const target = (activeControls.target as THREE.Vector3 | undefined)?.clone?.() ?? new THREE.Vector3(0, 0, 0);
        const sceneRadius = this.visualSceneMode === "swarm"
          ? Math.max(80, this.swarmBounds)
          : Math.max(80, STARS_CLUSTER_RADIUS * (this.visualSceneMode === "nebula" ? this.nebulaScale : this.starsDistanceScale));
        const fitDist = sceneRadius / Math.sin((activeCamera.fov * Math.PI) / 360);
        const dir = new THREE.Vector3(-1, -1, 1).normalize();
        activeCamera.up.set(0, 0, 1);
        activeCamera.position.copy(target).addScaledVector(dir, fitDist);
        activeCamera.near = Math.max(0.1, fitDist / 1000);
        activeCamera.far = Math.max(activeCamera.far, fitDist * 1000);
        activeCamera.lookAt(target);
        activeCamera.updateProjectionMatrix();
        if (activeControls.target) activeControls.target.copy(target);
        activeControls.update?.();
        this.syncMainCameraFromVisualScene();
        return;
      }
    }

    this.camera.up.set(0, 0, 1);
    const { center, radius } = this.getFocusSphere();
    this.setControlTarget(center);
    const fitDist = radius / Math.sin((this.camera.fov * Math.PI) / 360);
    const dist = fitDist / this.cameraZoomFactor;
    const dir = this.orthoLikeEnabled
      ? new THREE.Vector3(-1, 0, 0) // orthographic reset: left (-X)
      : new THREE.Vector3(-1, -1, 1).normalize(); // perspective default: between -Y and -X
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = Math.max(this.camera.far, dist * 1000);
    this.camera.updateProjectionMatrix();
    this.controls.update?.();
  }

  private getFocusSphere() {
    const box = new THREE.Box3();
    let hasBounds = false;
    const includeObject = (obj: THREE.Object3D | null | undefined) => {
      if (!obj || !obj.visible) return;
      const b = new THREE.Box3().setFromObject(obj);
      if (b.isEmpty()) return;
      if (!hasBounds) {
        box.copy(b);
        hasBounds = true;
      } else {
        box.union(b);
      }
    };

    includeObject(this.mesh);
    includeObject(this.shoePivot);
    for (const p of this.footpadPivots) includeObject(p);
    for (const p of this.hookPivots) includeObject(p);

    if (hasBounds) {
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);
      return {
        center: sphere.center.clone(),
        radius: Math.max(1, sphere.radius),
      };
    }

    return {
      center: this.getControlTarget().clone(),
      radius: 140,
    };
  }

  private applyCameraZoomToFocus() {
    const { center, radius } = this.getFocusSphere();
    const target = this.getControlTarget();
    const dir = new THREE.Vector3().copy(this.camera.position).sub(target);
    if (dir.lengthSq() < 1e-9) dir.set(-1, -1, 1);
    dir.normalize();

    this.setControlTarget(center);
    const fitDist = radius / Math.sin((this.camera.fov * Math.PI) / 360);
    const dist = Math.max(1, fitDist / this.cameraZoomFactor);
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = Math.max(this.camera.far, dist * 1000);
    this.camera.updateProjectionMatrix();
    this.controls.update?.();
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

  setShoeMirrorXZ(v: boolean) {
    this.shoeMirrorXZ = !!v;
    this.applyShoeState();
  }

  setShoeMaterialsEnabled(v: boolean) {
    this.shoeMaterialsEnabled = !!v;
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
        const mirrorGroup = new THREE.Group();
        mirrorGroup.name = "shoeMirrorGroup";
        mirrorGroup.add(object);
        pivot.add(mirrorGroup);

        this.shoePivot = pivot;
        this.shoeMirrorGroup = mirrorGroup;
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

        const mirrorGroup = new THREE.Group();
        mirrorGroup.name = "shoeMirrorGroup";
        mirrorGroup.add(mesh);
        pivot.add(mirrorGroup);

        this.shoePivot = pivot;
        this.shoeMirrorGroup = mirrorGroup;
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

    const assetOff = this.footpadAssetOffset[i] ?? { x: 0, y: 0, z: 0 };
    pivot.position.set(
      this.footpadOffset.x + (assetOff.x || 0),
      this.footpadOffset.y + (assetOff.y || 0),
      this.footpadOffset.z + (assetOff.z || 0)
    );

    const root = this.footpadRoots[i];
    if (root) {
      if (!this.footpadFlatFallbackMaterial) {
        this.footpadFlatFallbackMaterial = new THREE.MeshStandardMaterial({
          color: 0x4aa66b,
          metalness: 0.0,
          roughness: 0.92,
          transparent: false,
          opacity: 1.0,
        });
      }
      const flatMat = this.footpadFlatFallbackMaterial;
      root.traverse((child: any) => {
        if (!child?.isMesh) return;
        if (!("footpadOriginalMaterial" in child.userData)) {
          child.userData.footpadOriginalMaterial = child.material;
        }
        const originalMat = child.userData.footpadOriginalMaterial as THREE.Material | THREE.Material[] | undefined;
        const nextMat = this.footpadMaterialsEnabled ? (originalMat ?? child.material) : flatMat;
        if (child.material !== nextMat) child.material = nextMat;
        this.applyClippingToMaterial(child.material);
        this.applyDisplayStyleToMaterial(child.material);
      });
    }
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
    this.footpadAssetOffset[i] = { x: 0, y: 0, z: 0 };

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

  loadFootpadOBJWithMTL(
    slot: 1 | 2 | 3,
    objUrl: string,
    mtlUrl: string,
    modelScale = 1,
    assetRotDeg: Partial<XYZ> = {},
    assetOffset: Partial<XYZ> = {}
  ) {
    const i = slot - 1;
    if (this.footpadRequested[i]) return;
    this.footpadRequested[i] = true;
    this.footpadAssetOffset[i] = {
      x: Number(assetOffset.x) || 0,
      y: Number(assetOffset.y) || 0,
      z: Number(assetOffset.z) || 0,
    };

    this.log(`footpad${slot}: loading OBJ+MTL ${objUrl}`);

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    const resourceBase = (() => {
      const idx = mtlUrl.lastIndexOf("/");
      return idx >= 0 ? mtlUrl.slice(0, idx + 1) : "";
    })();
    mtlLoader.setResourcePath(resourceBase);

    mtlLoader.load(
      mtlUrl,
      (materials: any) => {
        try { materials.preload?.(); } catch {}
        objLoader.setMaterials(materials);
        objLoader.load(
          objUrl,
          (object: any) => {
            this.clearFootpad(i);

            object.traverse((child: any) => {
              if (child?.isMesh) this.applyClippingToMaterial(child.material);
            });

            const assetScale = Number.isFinite(modelScale) ? Math.max(0.0001, modelScale) : 1;
            object.scale.setScalar(assetScale);
            object.rotation.set(
              THREE.MathUtils.degToRad(Number(assetRotDeg.x) || 0),
              THREE.MathUtils.degToRad(Number(assetRotDeg.y) || 0),
              THREE.MathUtils.degToRad(Number(assetRotDeg.z) || 0)
            );

            const pivot = new THREE.Group();
            pivot.name = `footpadPivot${slot}`;
            this.centerUnderPivot(object);
            pivot.add(object);

            this.footpadPivots[i] = pivot;
            this.footpadRoots[i] = object;
            this.footpadMaterials[i] = null;

            this.applyFootpadState(i);
            pivot.renderOrder = -2;
            this.scene.add(pivot);
            this.rebuildSectionStencils();
            this.log(`footpad${slot}: OBJ+MTL loaded OK`);
          },
          undefined,
          (err: any) => {
            console.error(`Failed to load footpad ${slot} OBJ:`, objUrl, err);
            this.footpadRequested[i] = false;
            this.log(`footpad${slot}: OBJ load FAILED`);
          }
        );
      },
      undefined,
      (err: any) => {
        console.error(`Failed to load footpad ${slot} MTL:`, mtlUrl, err);
        this.footpadRequested[i] = false;
        this.log(`footpad${slot}: MTL load FAILED`);
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

  setFootpadMaterialsEnabled(v: boolean) {
    this.footpadMaterialsEnabled = !!v;
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
      wireframe: this.displayStyleMode === "edges",
    });

    this.applyClippingToMaterial(material);
    this.applyDisplayStyleToMaterial(material);

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
    this.syncEdgeOverlayForMesh(this.mesh);
    this.applyParamMeshTransform();

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

  loadOBJWithMTL(objUrl: string, mtlUrl: string) {
    if (this.shoeRequested) return;
    this.shoeRequested = true;

    this.log(`shoe: loading OBJ+MTL ${objUrl}`);

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const resourceBase = (() => {
      const idx = mtlUrl.lastIndexOf("/");
      return idx >= 0 ? mtlUrl.slice(0, idx + 1) : "";
    })();

    mtlLoader.setResourcePath(resourceBase);
    mtlLoader.load(
      mtlUrl,
      (materials: any) => {
        try {
          materials.preload?.();
        } catch {}
        objLoader.setMaterials(materials);
        objLoader.load(
          objUrl,
          (object: any) => {
            this.clearShoe();

            object.traverse((child: any) => {
              if (!child?.isMesh) return;
              this.applyClippingToMaterial(child.material);
            });

            const pivot = new THREE.Group();
            pivot.name = "shoePivot";

            this.centerUnderPivot(object);
            const mirrorGroup = new THREE.Group();
            mirrorGroup.name = "shoeMirrorGroup";
            mirrorGroup.add(object);
            pivot.add(mirrorGroup);

            this.shoePivot = pivot;
            this.shoeMirrorGroup = mirrorGroup;
            this.shoeRoot = object;
            this.shoeMaterial = null;

            this.applyShoeState();
            this.scene.add(pivot);

            this.rebuildSectionStencils();
            this.log("shoe: OBJ+MTL loaded OK");
          },
          undefined,
          (err: any) => {
            console.error("OBJ (with MTL) load failed:", err);
            this.log("shoe: OBJ load FAILED (MTL path)");
            this.shoeRequested = false;
          }
        );
      },
      undefined,
      (err: any) => {
        console.error("MTL load failed:", err);
        this.log("shoe: MTL load FAILED");
        this.shoeRequested = false;
      }
    );
  }

  private frameSpherePreserveView(center: THREE.Vector3, radiusRaw: number) {
    const radius = Math.max(radiusRaw, 1);

    // Preserve the current viewing angle by keeping the camera->target direction.
    const dir = new THREE.Vector3().copy(this.camera.position).sub(this.getControlTarget());
    if (dir.lengthSq() < 1e-9) dir.set(1, -0.7, 1);
    dir.normalize();

    const dist = radius / Math.sin((this.camera.fov * Math.PI) / 360);

    this.setControlTarget(center);
    this.camera.position.copy(center).addScaledVector(dir, dist);

    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = dist * 1000;
    this.camera.updateProjectionMatrix();

    this.controls.update();
  }

  private frameMeshesPreserveView(meshes: THREE.Mesh[]) {
    if (!meshes.length) return;

    const box = new THREE.Box3();
    const p = new THREE.Vector3();
    let count = 0;

    for (const m of meshes) {
      if (!m) continue;
      m.getWorldPosition(p);
      if (count === 0) box.set(p, p);
      else box.expandByPoint(p);
      count++;
    }

    if (count === 0 || box.isEmpty()) return;

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    this.frameSpherePreserveView(sphere.center, sphere.radius);
  }

  frameShoe() {
    if (!this.shoePivot) return;

    const box = new THREE.Box3().setFromObject(this.shoePivot);
    if (box.isEmpty()) return;

    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    this.frameSpherePreserveView(sphere.center, sphere.radius);
  }

  frameBaseplateControlPoints() {
    this.frameMeshesPreserveView(this.ctrlMeshes);
  }

  frameAControlPoints() {
    this.frameMeshesPreserveView(this.aArcMeshes);
  }

  frameBControlPoints() {
    this.frameMeshesPreserveView(this.bArcMeshes);
  }

  frameCControlPoints() {
    this.frameMeshesPreserveView(this.cArcMeshes);
  }

  private frameToGeometry(geometry: THREE.BufferGeometry) {
    geometry.computeBoundingSphere();
    const sphere = geometry.boundingSphere;
    if (!sphere) return;

    const center = sphere.center;
    const radius = Math.max(sphere.radius, 1);

    this.setControlTarget(center);

    const dist = radius / Math.sin((this.camera.fov * Math.PI) / 360);
    this.camera.position.set(center.x - dist, center.y - dist * 0.7, center.z + dist);

    this.camera.near = Math.max(0.1, dist / 1000);
    this.camera.far = dist * 1000;
    this.camera.updateProjectionMatrix();

    this.controls.update();
  }

  private getAxisGizmoViewportRect(viewW: number, viewH: number) {
    const size = Math.min(this.axisViewportSize, Math.min(viewW, viewH));
    const pad = this.axisViewportPadding;
    const left = viewW - size - pad;
    const top = pad;
    const glX = left;
    const glY = viewH - size - pad;
    return { size, left, top, glX, glY };
  }

  setAxisGizmoViewportSize(size: number) {
    const next = Number.isFinite(size) ? Math.round(Math.max(72, size)) : this.axisViewportSize;
    this.axisViewportSize = next;
    return this.axisViewportSize;
  }

  getAxisGizmoViewportSize() {
    return this.axisViewportSize;
  }
  setAxisGizmoEnabled(enabled: boolean) {
    this.axisGizmoEnabled = !!enabled;
    if (!this.axisGizmoEnabled) this.setAxisHoverTarget(null);
  }
  getAxisGizmoEnabled() {
    return this.axisGizmoEnabled;
  }

  getCardinalUpLabel() {
    return this.getCardinalUpSign() < 0 ? "-Z" : "+Z";
  }

  private getCardinalUpSign(): 1 | -1 {
    return this.camera.up.z < 0 ? -1 : 1;
  }

  toggleCardinalUp() {
    const nextSign: 1 | -1 = this.getCardinalUpSign() < 0 ? 1 : -1;
    this.axisSnapAnim = null;
    this.orbitSpinActive = false;
    this.orbitSpinVelocity.set(0, 0);
    this.enforceCardinalUpForOrbit(nextSign);
    this.lastSnapWasTopBottom = false;
    this.controls.update();
  }

  rollViewByDegrees(deltaDeg: number) {
    const target = this.getControlTarget();
    const offset = new THREE.Vector3().copy(this.camera.position).sub(target);
    if (offset.lengthSq() < 1e-9) return;
    const forward = offset.clone().multiplyScalar(-1).normalize(); // camera -> target
    const q = new THREE.Quaternion().setFromAxisAngle(forward, THREE.MathUtils.degToRad(deltaDeg));
    this.camera.up.applyQuaternion(q).normalize();
    this.lastSnapWasTopBottom = false;
    this.controls.update();
  }

  getAxisGizmoViewportScreenRect() {
    const viewW = this.canvas.clientWidth;
    const viewH = this.canvas.clientHeight;
    if (viewW <= 0 || viewH <= 0) return null;
    const vp = this.getAxisGizmoViewportRect(viewW, viewH);
    const rect = this.canvas.getBoundingClientRect();
    return {
      left: rect.left + vp.left,
      top: rect.top + vp.top,
      size: vp.size,
    };
  }

  private updateAxisGizmoCameraFromMainCamera() {
    const srcCam = this.getSnapCamera();
    const srcTarget = this.getSnapTarget();
    const dir = new THREE.Vector3().copy(srcCam.position).sub(srcTarget);
    if (dir.lengthSq() < 1e-9) dir.set(1, 1, 1);
    dir.normalize();
    this.axisCamera.position.copy(dir).multiplyScalar(3);

    // Keep gizmo camera up synchronized, but avoid singularity when up ~ view dir.
    const up = srcCam.up.clone();
    if (up.lengthSq() < 1e-9) up.set(0, 0, 1);
    up.normalize();
    if (Math.abs(up.dot(dir)) > 0.995) {
      const worldZ = new THREE.Vector3(0, 0, 1);
      const altUp = worldZ.clone().projectOnPlane(dir);
      if (altUp.lengthSq() > 1e-9) up.copy(altUp.normalize());
      else {
        up.set(1, 0, 0).projectOnPlane(dir);
        if (up.lengthSq() < 1e-9) up.set(0, 1, 0).projectOnPlane(dir);
        up.normalize();
      }
    }
    this.axisCamera.up.copy(up);
    this.axisCamera.lookAt(0, 0, 0);
    this.axisCamera.updateProjectionMatrix();
  }

  private makeAxisLabelSprite(text: string, colorHex: number) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      const fallback = new THREE.Sprite(
        new THREE.SpriteMaterial({ color: colorHex, depthTest: false, depthWrite: false })
      );
      fallback.scale.setScalar(0.42);
      return fallback;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 84px system-ui, Arial, sans-serif";
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(8,10,14,0.95)";
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, "0")}`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.renderOrder = 120;
    sprite.scale.setScalar(0.42);
    return sprite;
  }

  private buildClickableAxisGizmo() {
    const axisGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const cornerGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const allNodePositions: THREE.Vector3[] = [];
    const cornerNodes: Array<{
      sx: -1 | 1;
      sy: -1 | 1;
      sz: -1 | 1;
      pos: THREE.Vector3;
      dir: THREE.Vector3;
    }> = [];

    const addPickSphere = (pos: THREE.Vector3, color: number, dir: THREE.Vector3, name: string, geo = axisGeo) => {
      const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, depthWrite: false });
      const mesh = new THREE.Mesh(
        geo,
        mat
      );
      const halo = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      halo.scale.setScalar(1.05);
      halo.renderOrder = 125;
      mesh.add(halo);
      mesh.position.copy(pos);
      mesh.name = name;
      mesh.userData.gizmoDir = [dir.x, dir.y, dir.z];
      mesh.userData.baseColor = color;
      mesh.userData.gizmoHalo = halo;
      mesh.userData.pickKind = "sphere";
      this.axisGizmoGroup.add(mesh);
      this.axisGizmoPickables.push(mesh);
      allNodePositions.push(pos.clone());
    };

    const addPickEdge = (
      a: THREE.Vector3,
      b: THREE.Vector3,
      dir: THREE.Vector3,
      name: string
    ) => {
      const edgeDir = b.clone().sub(a);
      const len = edgeDir.length();
      if (len < 1e-6) return;
      edgeDir.normalize();
      const edgeGeo = new THREE.CylinderGeometry(0.05, 0.05, len, 8, 1, true);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: 0x4b5970,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
      });
      const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
      edgeMesh.position.copy(a).addScaledVector(edgeDir, len * 0.5);
      edgeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), edgeDir);
      edgeMesh.name = name;
      edgeMesh.userData.gizmoDir = [dir.x, dir.y, dir.z];
      edgeMesh.userData.baseColor = 0x4b5970;
      edgeMesh.userData.pickKind = "edge";
      this.axisGizmoGroup.add(edgeMesh);
      this.axisGizmoPickables.push(edgeMesh);
    };

    // Axis endpoints (Z-up app convention; "front" mapped to -Y)
    addPickSphere(new THREE.Vector3(1.2, 0, 0), 0xff3b6b, new THREE.Vector3(1, 0, 0), "gizmoRight");
    addPickSphere(new THREE.Vector3(-1.2, 0, 0), 0xf07a95, new THREE.Vector3(-1, 0, 0), "gizmoLeft");
    addPickSphere(new THREE.Vector3(0, -1.2, 0), 0x43d67a, new THREE.Vector3(0, -1, 0), "gizmoFront");
    addPickSphere(new THREE.Vector3(0, 1.2, 0), 0x2ecc71, new THREE.Vector3(0, 1, 0), "gizmoBack");
    addPickSphere(new THREE.Vector3(0, 0, 1.2), 0x2d7cff, new THREE.Vector3(0, 0, 1), "gizmoTop");
    addPickSphere(new THREE.Vector3(0, 0, -1.2), 0x5ea1ff, new THREE.Vector3(0, 0, -1), "gizmoBottom");

    // Axis labels (visual-only; not pickable).
    this.axisLabelX = this.makeAxisLabelSprite("X", 0xff6d8d);
    this.axisLabelY = this.makeAxisLabelSprite("Y", 0x55e38c);
    this.axisLabelZ = this.makeAxisLabelSprite("Z", 0x63a2ff);
    const axisLabelNegX = this.makeAxisLabelSprite("-X", 0xf07a95);
    const axisLabelNegY = this.makeAxisLabelSprite("-Y", 0x43d67a);
    const axisLabelNegZ = this.makeAxisLabelSprite("-Z", 0x5ea1ff);
    this.axisLabelX.position.set(1.55, 0, 0);
    this.axisLabelY.position.set(0, 1.55, 0);
    this.axisLabelZ.position.set(0, 0, 1.55);
    axisLabelNegX.position.set(-1.72, 0, 0);
    axisLabelNegY.position.set(0, -1.72, 0);
    axisLabelNegZ.position.set(0, 0, -1.72);
    this.axisGizmoGroup.add(this.axisLabelX);
    this.axisGizmoGroup.add(this.axisLabelY);
    this.axisGizmoGroup.add(this.axisLabelZ);
    this.axisGizmoGroup.add(axisLabelNegX);
    this.axisGizmoGroup.add(axisLabelNegY);
    this.axisGizmoGroup.add(axisLabelNegZ);
    this.axisGizmoLabels = [
      this.axisLabelX,
      this.axisLabelY,
      this.axisLabelZ,
      axisLabelNegX,
      axisLabelNegY,
      axisLabelNegZ,
    ];

    // 8 corner/isometric directions
    const signs = [-1, 1] as const;
    for (const sx of signs) {
      for (const sy of signs) {
        for (const sz of signs) {
          const d = new THREE.Vector3(sx, sy, sz).normalize();
          const p = d.clone().multiplyScalar(1.45);
          addPickSphere(p, 0xd9dbe1, d, `gizmoCorner_${sx}_${sy}_${sz}`, cornerGeo);
          cornerNodes.push({ sx, sy, sz, pos: p.clone(), dir: d.clone() });
        }
      }
    }

    // Draw only the 12 cube edges between corner nodes, color-coded by axis.
    if (cornerNodes.length > 1) {
      const xEdgePts: number[] = [];
      const yEdgePts: number[] = [];
      const zEdgePts: number[] = [];
      let edgeIdx = 0;
      for (let i = 0; i < cornerNodes.length; i++) {
        for (let j = i + 1; j < cornerNodes.length; j++) {
          const aN = cornerNodes[i];
          const bN = cornerNodes[j];
          const diff =
            (aN.sx !== bN.sx ? 1 : 0) +
            (aN.sy !== bN.sy ? 1 : 0) +
            (aN.sz !== bN.sz ? 1 : 0);
          if (diff !== 1) continue; // cube edge only

          const a = aN.pos;
          const b = bN.pos;
          if (aN.sx !== bN.sx) {
            xEdgePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          } else if (aN.sy !== bN.sy) {
            yEdgePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          } else {
            zEdgePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }

          // Edge-click snap direction = edge midpoint direction (two-axis aligned).
          const midDir = aN.dir.clone().add(bN.dir).normalize();
          addPickEdge(a, b, midDir, `gizmoEdge_${edgeIdx++}`);
        }
      }
      this.axisGizmoEdgeLineMaterials = [];
      const addEdgeLines = (pts: number[], color: number) => {
        if (!pts.length) return;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        const mat = new THREE.LineBasicMaterial({
          color,
          linewidth: 2,
          transparent: true,
          opacity: this.axisGizmoLineOpacity,
          depthTest: false,
          depthWrite: false,
        });
        const lines = new THREE.LineSegments(geo, mat);
        this.axisGizmoGroup.add(lines);
        this.axisGizmoEdgeLineMaterials.push(mat);
      };
      addEdgeLines(xEdgePts, 0x8b3e56);
      addEdgeLines(yEdgePts, 0x3f765b);
      addEdgeLines(zEdgePts, 0x3d5f87);
      this.axisGizmoLineMaterial = this.axisGizmoEdgeLineMaterials[0] ?? null;
    }

    // Add back full "connect everything" web in lighter white.
    if (allNodePositions.length > 1) {
      const webPts: number[] = [];
      for (let i = 0; i < allNodePositions.length; i++) {
        for (let j = i + 1; j < allNodePositions.length; j++) {
          const a = allNodePositions[i];
          const b = allNodePositions[j];
          webPts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
      const webGeo = new THREE.BufferGeometry();
      webGeo.setAttribute("position", new THREE.Float32BufferAttribute(webPts, 3));
      const webMat = new THREE.LineBasicMaterial({
        color: 0xf2f6ff,
        transparent: true,
        opacity: this.axisGizmoLineOpacity * 0.35,
        depthTest: false,
        depthWrite: false,
      });
      const webLines = new THREE.LineSegments(webGeo, webMat);
      this.axisGizmoGroup.add(webLines);
      this.axisGizmoWebLineMaterial = webMat;
    }

    // Shrink the clickable/drawn gizmo itself while keeping the viewport slightly larger.
    this.axisGizmoGroup.scale.setScalar(this.axisGizmoDrawScale);
    this.applyAxisGizmoVisualSettings();
  }

  private applyAxisGizmoVisualSettings() {
    if (this.axisGizmoLineMaterial) {
      this.axisGizmoLineMaterial.opacity = this.axisGizmoLineOpacity;
      this.axisGizmoLineMaterial.transparent = this.axisGizmoLineOpacity < 0.999;
      this.axisGizmoLineMaterial.needsUpdate = true;
    }
    for (const mat of this.axisGizmoEdgeLineMaterials) {
      if (!mat) continue;
      mat.opacity = this.axisGizmoLineOpacity;
      mat.transparent = this.axisGizmoLineOpacity < 0.999;
      mat.needsUpdate = true;
    }
    if (this.axisGizmoWebLineMaterial) {
      this.axisGizmoWebLineMaterial.opacity = this.axisGizmoLineOpacity * 0.35;
      this.axisGizmoWebLineMaterial.transparent = this.axisGizmoLineOpacity < 0.999;
      this.axisGizmoWebLineMaterial.needsUpdate = true;
    }

    for (const sprite of this.axisGizmoLabels) {
      if (!sprite) continue;
      sprite.scale.setScalar(0.42 * this.axisGizmoTextScale);
    }

    for (const obj of this.axisGizmoPickables) {
      const mesh = obj as THREE.Mesh;
      if (!mesh) continue;
      if (mesh.userData.pickKind !== "sphere") continue;
      const isHovered = obj === this.axisHoveredPickable;
      mesh.scale.setScalar(this.axisGizmoSphereScale * (isHovered ? 1.35 : 1));
    }
  }

  private setAxisHoverTarget(next: THREE.Object3D | null) {
    if (this.axisHoveredPickable === next) return;
    this.axisHoveredPickable = next;
    for (const obj of this.axisGizmoPickables) {
      const mesh = obj as THREE.Mesh;
      const isHovered = obj === next;
      if (mesh.userData.pickKind === "sphere") {
        mesh.scale.setScalar(this.axisGizmoSphereScale * (isHovered ? 1.35 : 1));
      }
      const mat = mesh.material as THREE.MeshBasicMaterial | undefined;
      if (mat) {
        const baseColor = Number(mesh.userData.baseColor ?? 0xffffff);
        mat.color.setHex(baseColor);
        if (isHovered) mat.color.multiplyScalar(1.18);
        if (mesh.userData.pickKind === "edge") {
          mat.opacity = isHovered ? 0.24 : 0;
        }
      }
      const halo = mesh.userData.gizmoHalo as THREE.Mesh | undefined;
      const haloMat = halo?.material as THREE.MeshBasicMaterial | undefined;
      if (haloMat) haloMat.opacity = isHovered ? 0.2 : 0;
    }
  }

  setAxisGizmoScale(scale: number) {
    const next = Number.isFinite(scale) ? Math.min(2.5, Math.max(0.2, scale)) : this.axisGizmoDrawScale;
    this.axisGizmoDrawScale = next;
    if (this.axisGizmoGroup) this.axisGizmoGroup.scale.setScalar(this.axisGizmoDrawScale);
  }

  setAxisGizmoLineOpacity(opacity: number) {
    const next = Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : this.axisGizmoLineOpacity;
    this.axisGizmoLineOpacity = next;
    this.applyAxisGizmoVisualSettings();
  }

  getAxisGizmoLineOpacity() {
    return this.axisGizmoLineOpacity;
  }

  setAxisGizmoSphereScale(scale: number) {
    const next = Number.isFinite(scale) ? Math.min(2.5, Math.max(0.4, scale)) : this.axisGizmoSphereScale;
    this.axisGizmoSphereScale = next;
    this.applyAxisGizmoVisualSettings();
  }

  getAxisGizmoSphereScale() {
    return this.axisGizmoSphereScale;
  }

  setAxisGizmoTextScale(scale: number) {
    const next = Number.isFinite(scale) ? Math.min(3, Math.max(0.5, scale)) : this.axisGizmoTextScale;
    this.axisGizmoTextScale = next;
    this.applyAxisGizmoVisualSettings();
  }

  getAxisGizmoTextScale() {
    return this.axisGizmoTextScale;
  }

  private startAxisSnapAnimation(toPos: THREE.Vector3, toUp: THREE.Vector3, target: THREE.Vector3) {
    const camera = this.getSnapCamera();
    const controls = this.getSnapControls();
    this.axisSnapAnim = {
      startMs: performance.now(),
      durationMs: 220,
      cameraRef: camera,
      controlsRef: controls,
      fromPos: camera.position.clone(),
      toPos: toPos.clone(),
      fromUp: camera.up.clone(),
      toUp: toUp.clone().normalize(),
      target: target.clone(),
    };
  }

  private updateAxisSnapAnimation(nowMs: number) {
    const anim = this.axisSnapAnim;
    if (!anim) return;

    const rawT = (nowMs - anim.startMs) / Math.max(1, anim.durationMs);
    const t = Math.min(1, Math.max(0, rawT));
    const ease = t * t * (3 - 2 * t); // smoothstep

    this.setSnapTarget(anim.target);
    anim.cameraRef.position.lerpVectors(anim.fromPos, anim.toPos, ease);
    anim.cameraRef.up.lerpVectors(anim.fromUp, anim.toUp, ease);
    if (anim.cameraRef.up.lengthSq() > 1e-9) anim.cameraRef.up.normalize();
    else anim.cameraRef.up.set(0, 0, 1);
    if (this.controlMode === "arcball") {
      // Arcball mode doesn't run controls.update() in the main animate loop.
      // Ensure snap animation still keeps camera aimed at the snap target.
      anim.cameraRef.lookAt(this.getSnapTarget());
    }

    const dist = Math.max(1, anim.cameraRef.position.distanceTo(this.getSnapTarget()));
    anim.cameraRef.near = Math.max(0.1, dist / 1000);
    anim.cameraRef.far = Math.max(anim.cameraRef.far, dist * 1000);
    anim.cameraRef.updateProjectionMatrix();

    if (t >= 1) this.axisSnapAnim = null;
  }

  private enforceCardinalUpForOrbit(upSign: 1 | -1 = 1) {
    const cardinalUp = new THREE.Vector3(0, 0, upSign);
    const target = this.getControlTarget();
    const offset = new THREE.Vector3().copy(this.camera.position).sub(target);
    const dist = Math.max(1, offset.length());
    if (offset.lengthSq() < 1e-9) return;
    offset.normalize();

    // Near top/bottom view relative to chosen cardinal up, gently push off-pole
    // to prevent first-drag singularity jumps.
    if (Math.abs(offset.dot(cardinalUp)) > 0.9995) {
      const nudge = this.getCurrentCameraRightWorld().projectOnPlane(cardinalUp);
      if (nudge.lengthSq() < 1e-9) nudge.set(1, 0, 0);
      nudge.normalize();
      offset.addScaledVector(nudge, 0.0015).normalize();
    }

    this.camera.position.copy(target).add(offset.multiplyScalar(dist));
    this.camera.up.copy(cardinalUp);
  }

  private getCurrentCameraRightWorld() {
    const camera = this.getSnapCamera();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    if (right.lengthSq() > 1e-9) return right.normalize();
    return new THREE.Vector3(1, 0, 0);
  }

  private getCurrentCameraUpWorld() {
    const camera = this.getSnapCamera();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    if (up.lengthSq() > 1e-9) return up.normalize();
    return new THREE.Vector3(0, 1, 0);
  }

  private getSnapCamera() {
    return this.getVisualSceneActiveCamera() ?? this.camera;
  }

  private getSnapControls() {
    return this.getVisualSceneActiveControls() ?? this.controls;
  }

  private getSnapTarget() {
    const controls = this.getSnapControls();
    const t = controls?.target as THREE.Vector3 | undefined;
    if (t?.copy) return t;
    return this.controlTargetFallback;
  }

  private setSnapTarget(v: THREE.Vector3) {
    const controls = this.getSnapControls();
    const t = controls?.target as THREE.Vector3 | undefined;
    if (controls === this.controls) this.controlTargetFallback.copy(v);
    if (t?.copy) t.copy(v);
  }

  private classifyDir(dir: THREE.Vector3): SnapClass {
    if (dir.z > 0.999) return "top";
    if (dir.z < -0.999) return "bottom";
    return "side";
  }

  private getCurrentViewState(): SnapViewState {
    const camera = this.getSnapCamera();
    const target = this.getSnapTarget().clone();
    const offset = new THREE.Vector3().copy(camera.position).sub(target);
    const distance = Math.max(1, offset.length());
    const viewDir = offset.lengthSq() > 1e-9 ? offset.normalize() : new THREE.Vector3(1, 1, 1).normalize();
    return {
      target,
      viewDir,
      screenRightWorld: this.getCurrentCameraRightWorld(),
      screenUpWorld: this.getCurrentCameraUpWorld(),
      distance,
    };
  }

  private getHorizontalRightFromState(state: SnapViewState) {
    const worldUp = new THREE.Vector3(0, 0, 1);
    const right = state.screenRightWorld.clone();
    right.projectOnPlane(worldUp);
    if (right.lengthSq() > 1e-9) return right.normalize();

    // Fallback: derive from current view direction if near a pole.
    const fallbackRight = new THREE.Vector3().crossVectors(worldUp, state.viewDir);
    fallbackRight.projectOnPlane(worldUp);
    if (fallbackRight.lengthSq() > 1e-9) return fallbackRight.normalize();

    // Deterministic final fallback.
    return new THREE.Vector3(0, 1, 0);
  }

  private getTopBottomBiasDirFromRight(horizontalRight: THREE.Vector3) {
    const worldUp = new THREE.Vector3(0, 0, 1);
    // For Z-up lookAt, camera screen-right is approximately worldUp x biasDir.
    const biasDir = new THREE.Vector3().crossVectors(horizontalRight, worldUp);
    biasDir.projectOnPlane(worldUp);
    if (biasDir.lengthSq() > 1e-9) return biasDir.normalize();
    return new THREE.Vector3(1, 0, 0);
  }

  private snapHorizontalRightToNearestCardinal(horizontalRight: THREE.Vector3) {
    const candidates = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
    ];
    let best = candidates[0];
    let bestDot = -Infinity;
    for (const c of candidates) {
      const d = horizontalRight.dot(c);
      if (d > bestDot) {
        bestDot = d;
        best = c;
      }
    }
    return best.clone();
  }

  private solveSnapPosition(dir: THREE.Vector3, distance: number, prior: SnapViewState) {
    const offset = dir.clone().multiplyScalar(distance);
    const toClass = this.classifyDir(dir);

    let snappedTopBottomRight: THREE.Vector3 | null = null;
    if (toClass !== "side") {
      const horizontalRight = this.snapHorizontalRightToNearestCardinal(this.getHorizontalRightFromState(prior));
      snappedTopBottomRight = horizontalRight.clone();
      const biasDir = this.getTopBottomBiasDirFromRight(horizontalRight);
      offset.addScaledVector(biasDir, distance * 0.0025);
      offset.setLength(distance);
    }

    return { offset, snappedTopBottomRight };
  }

  private computeUpFromDesiredRight(
    cameraOffsetFromTarget: THREE.Vector3,
    desiredRightWorld: THREE.Vector3,
    fallbackScreenUpWorld: THREE.Vector3
  ) {
    // `cameraOffsetFromTarget` points from target -> camera. The camera forward vector
    // (camera -> target) is the opposite direction.
    const fwd = cameraOffsetFromTarget.clone().multiplyScalar(-1).normalize();
    const desiredRight = desiredRightWorld.clone().projectOnPlane(fwd);

    if (desiredRight.lengthSq() < 1e-9) {
      const desiredUp = fallbackScreenUpWorld.clone().projectOnPlane(fwd);
      if (desiredUp.lengthSq() > 1e-9) {
        desiredUp.normalize();
        const up = desiredUp;
        const rightFromUp = new THREE.Vector3().crossVectors(fwd, up);
        if (rightFromUp.lengthSq() > 1e-9) desiredRight.copy(rightFromUp.normalize());
      }
    }

    if (desiredRight.lengthSq() < 1e-9) {
      const worldUp = new THREE.Vector3(0, 0, 1);
      desiredRight.copy(new THREE.Vector3().crossVectors(fwd, worldUp));
      if (desiredRight.lengthSq() < 1e-9) desiredRight.set(1, 0, 0).projectOnPlane(fwd);
    }
    desiredRight.normalize();

    const up = new THREE.Vector3().crossVectors(desiredRight, fwd);
    if (up.lengthSq() < 1e-9) return new THREE.Vector3(0, 0, 1);
    return up.normalize();
  }

  private solveSnapUp(
    toClass: SnapClass,
    prior: SnapViewState,
    solvedOffset: THREE.Vector3,
    snappedTopBottomRight: THREE.Vector3 | null
  ) {
    // Full ant-crawl: always preserve relative orientation continuity.
    // Top/bottom entries use the cardinalized screen-right basis.
    const desiredRight = toClass === "side"
      ? prior.screenRightWorld
      : (snappedTopBottomRight ?? prior.screenRightWorld);
    const up = this.computeUpFromDesiredRight(solvedOffset, desiredRight, prior.screenUpWorld);
    const fromClass = this.classifyDir(prior.viewDir);
    if (toClass === "side" && fromClass === "side") {
      // Keep side->side snaps deterministic against chosen cardinal-up polarity.
      // For top/bottom->side, allow ant-crawl upside-down continuity.
      const cardinalUp = new THREE.Vector3(0, 0, this.getCardinalUpSign());
      if (up.dot(cardinalUp) < 0) return up.multiplyScalar(-1);
    }
    return up;
  }

  private snapCameraToDirection(dirRaw: THREE.Vector3) {
    const dir = dirRaw.clone();
    if (dir.lengthSq() < 1e-9) return;
    dir.normalize();

    const prior = this.getCurrentViewState();
    const toClass = this.classifyDir(dir);
    this.orbitSpinActive = false;
    this.orbitSpinVelocity.set(0, 0);
    this.lastSnapWasTopBottom = toClass !== "side";
    const solvedPos = this.solveSnapPosition(dir, prior.distance, prior);

    const toPos = prior.target.clone().add(solvedPos.offset);
    const toUp = this.solveSnapUp(toClass, prior, solvedPos.offset, solvedPos.snappedTopBottomRight);
    const isCornerSnap =
      Math.abs(dir.x) > 0.45 &&
      Math.abs(dir.y) > 0.45 &&
      Math.abs(dir.z) > 0.45;
    if (this.controlMode === "orbit" || (this.controlMode === "current" && isCornerSnap)) {
      // Keep Orbit (and Ant Crawl corner picks) canonical Z-up.
      toUp.set(0, 0, 1);
    }
    this.startAxisSnapAnimation(toPos, toUp, prior.target);
    // Apply an initial step immediately so the snap feels responsive.
    this.updateAxisSnapAnimation(performance.now());
    const snapCam = this.getSnapCamera();
    const snapControls = this.getSnapControls();
    if (this.controlMode === "arcball" && snapCam === this.camera) {
      snapCam.lookAt(this.getSnapTarget());
    } else {
      snapControls?.update?.();
    }
  }

  private onCanvasPointerDown = (e: PointerEvent) => {
    if (!this.axisGizmoEnabled) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w <= 0 || h <= 0) return;

    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const vp = this.getAxisGizmoViewportRect(w, h);

    if (px < vp.left || px > vp.left + vp.size || py < vp.top || py > vp.top + vp.size) return;

    this.updateAxisGizmoCameraFromMainCamera();
    this.axisPointerNdc.set(((px - vp.left) / vp.size) * 2 - 1, -(((py - vp.top) / vp.size) * 2 - 1));
    this.axisRaycaster.setFromCamera(this.axisPointerNdc, this.axisCamera);

    const hits = this.axisRaycaster.intersectObjects(this.axisGizmoPickables, false);
    const hit = hits[0];
    const arr = hit?.object?.userData?.gizmoDir as number[] | undefined;
    if (!arr || arr.length < 3) return;

    e.preventDefault();
    e.stopPropagation();
    this.snapCameraToDirection(new THREE.Vector3(arr[0], arr[1], arr[2]));
  };

  private renderAxisGizmo(viewW: number, viewH: number) {
    if (!this.axisGizmoEnabled) return;
    const vp = this.getAxisGizmoViewportRect(viewW, viewH);
    this.updateAxisGizmoCameraFromMainCamera();

    this.renderer.clearDepth();
    this.renderer.setScissorTest(true);
    this.renderer.setScissor(vp.glX, vp.glY, vp.size, vp.size);
    this.renderer.setViewport(vp.glX, vp.glY, vp.size, vp.size);
    const prevAutoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;
    this.renderer.render(this.axisScene, this.axisCamera);
    this.renderer.autoClear = prevAutoClear;
    this.renderer.setScissorTest(false);

    this.renderer.setViewport(0, 0, viewW, viewH);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    const nowMs = performance.now();
    const prevMs = this.orbitSpinLastMs || nowMs;
    const dt = Math.max(1 / 240, Math.min(1 / 15, (nowMs - prevMs) / 1000));
    this.orbitSpinLastMs = nowMs;

    if (
      this.orbitSpinActive &&
      !this.orbitSpinTracking &&
      !this.axisSnapAnim &&
      (this.controlMode === "current" || this.controlMode === "orbit") &&
      this.controls?.rotateLeft &&
      this.controls?.rotateUp
    ) {
      // OrbitControls rotateLeft/rotateUp apply inverse-sign spherical deltas,
      // so feed negated measured angular velocity to continue in drag direction.
      this.controls.rotateLeft(-this.orbitSpinVelocity.x * dt);
      this.controls.rotateUp(-this.orbitSpinVelocity.y * dt);
      let decayPerSec: number;
      if (this.momentumDecaySeconds != null) {
        decayPerSec = Number.isFinite(this.momentumDecaySeconds)
          ? Math.log(100) / Math.max(0.001, this.momentumDecaySeconds)
          : 0;
      } else {
        const inertia = Math.min(1, Math.max(0, this.cameraInertia));
        // Non-linear mapping so low/mid slider values feel clearly distinct.
        const shaped = Math.pow(inertia, 1.6);
        decayPerSec = inertia >= 0.999 ? 0 : THREE.MathUtils.lerp(24.0, 0.12, shaped);
      }
      if (decayPerSec > 0 && !this.isZoomMomentumHoldActive()) {
        const decay = Math.exp(-decayPerSec * dt);
        this.orbitSpinVelocity.multiplyScalar(decay);
        if (Math.hypot(this.orbitSpinVelocity.x, this.orbitSpinVelocity.y) < 0.005) {
          this.orbitSpinActive = false;
        }
      }
    }
    if (
      this.autoSpinEnabled &&
      !this.orbitSpinTracking &&
      !this.axisSnapAnim &&
      (this.controlMode === "current" || this.controlMode === "orbit") &&
      this.controls?.rotateLeft
    ) {
      this.controls.rotateLeft(this.autoSpinSpeedRadPerSec * dt);
    }

    this.updateAxisSnapAnimation(performance.now());
    if (this.visualSceneMode === "off" && this.controlMode !== "arcball") this.controls.update();

    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    this.renderer.setViewport(0, 0, w, h);

    // Robust stencil clearing
    this.renderer.clear(true, true, true);
    if (this.visualSceneMode !== "off") {
      this.renderer.setScissorTest(false);
      const prevAutoClear = this.renderer.autoClear;
      this.renderer.autoClear = false;
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
      if (this.visualSceneMode === "stars" && this.starsScene && this.starsCamera) {
        this.updateStars(dt);
        this.renderer.render(this.starsScene, this.starsCamera);
      } else if (this.visualSceneMode === "nebula" && this.nebulaScene && this.nebulaCamera) {
        this.updateNebula(dt);
        this.renderer.render(this.nebulaScene, this.nebulaCamera);
      } else if (this.visualSceneMode === "swarm" && this.swarmScene && this.swarmCamera) {
        this.updateSwarm(dt);
        this.renderer.render(this.swarmScene, this.swarmCamera);
      }
      this.renderAxisGizmo(w, h);
      this.renderer.autoClear = prevAutoClear;
    } else {
      this.renderer.render(this.scene, this.camera);
      this.renderAxisGizmo(w, h);
    }
  };
}

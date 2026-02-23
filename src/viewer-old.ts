// FILE: src/viewer.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type MeshPayload = {
  positions: number[];
  normals?: number[];
  indices: number[];
};

export class Viewer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private mesh: THREE.Mesh | null = null;

  // NEW: only frame once automatically (prevents camera jump on rebuild)
  private hasFramedOnce = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

  // NEW: optional flag to force framing when you want it
  setMesh(payload: MeshPayload, opts?: { frame?: boolean }) {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(payload.positions, 3)
    );

    if (payload.normals && payload.normals.length === payload.positions.length) {
      geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(payload.normals, 3)
      );
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

    if (this.mesh) this.scene.remove(this.mesh);

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    const forceFrame = !!opts?.frame;
    if (!this.hasFramedOnce || forceFrame) {
      this.frameToGeometry(geometry);
      this.hasFramedOnce = true;
    }
  }

  // OPTIONAL: expose a public method so UI can "Frame" on demand
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

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
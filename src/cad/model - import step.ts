// FILE: src/cad/model.ts
import { importSTEP, type Shape3D } from "replicad";

export type ParamMap = Record<string, unknown>;

export async function buildModel(_input: ParamMap): Promise<Shape3D> {
  const res = await fetch("/models/reference.step");
  if (!res.ok) throw new Error(`STEP fetch failed: ${res.status} ${res.statusText}`);

  const stepBlob = await res.blob();
  let shape: Shape3D = await importSTEP(stepBlob);

  // Replicad API: rotate(angle, position, direction) :contentReference[oaicite:1]{index=1}
  // Rotate 90 degrees around X axis, axis passes through origin
  shape = (shape as any).rotate(90, [0, 0, 0], [1, 0, 0]);

  return shape;
}
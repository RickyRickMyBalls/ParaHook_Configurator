import { initOpenCascade } from './opencascadeBrowser'
import type { OpenCascadeInstance } from './opencascadeTypes'

let warmPromise: Promise<OpenCascadeInstance> | null = null

const bootOc = async (): Promise<OpenCascadeInstance> => initOpenCascade()

export const warmOc = (): Promise<OpenCascadeInstance> => {
  if (warmPromise === null) {
    warmPromise = bootOc()
  }
  return warmPromise
}

export const getOc = (): Promise<OpenCascadeInstance> => warmOc()

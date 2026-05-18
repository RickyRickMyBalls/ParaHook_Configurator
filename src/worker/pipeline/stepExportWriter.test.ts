import { describe, expect, it } from 'vitest'
import type { AuthoritativeShapeSetResource } from '../authoritativeGeometryStore'
import type { OpenCascadeInstance } from '../oc/opencascadeTypes'
import { writeStepFromAuthoritativeShapeSet } from './stepExportWriter'

const createFakeOc = (options?: {
  writeToMangledFile?: boolean
  transferDone?: boolean
  writeDone?: boolean
}) => {
  const files = new Map<string, string>()
  const retDone = { value: 1 }
  const retFail = { value: 3 }
  const calls = {
    transferShape: null as unknown,
    compoundAdds: [] as unknown[],
  }

  class STEPControl_Writer_1 {
    public Transfer(shape: unknown): unknown {
      calls.transferShape = shape
      return options?.transferDone === false ? retFail : retDone
    }

    public Write(filename: string): unknown {
      const target = options?.writeToMangledFile === true ? '/mangled-step-name' : `/${filename}`
      files.set(target, 'ISO-10303-21;\nFAKE STEP;\nEND-ISO-10303-21;\n')
      return options?.writeDone === false ? retFail : retDone
    }

    public delete(): void {}
  }

  class BRep_Builder {
    public MakeCompound(): void {}

    public Add(_compound: unknown, shape: unknown): void {
      calls.compoundAdds.push(shape)
    }

    public delete(): void {}
  }

  class TopoDS_Compound {
    public readonly kind = 'compound'

    public delete(): void {}
  }

  const oc = {
    STEPControl_Writer_1,
    BRep_Builder,
    TopoDS_Compound,
    IFSelect_ReturnStatus: {
      IFSelect_RetDone: retDone,
    },
    FS: {
      readdir: () => [
        '.',
        '..',
        'tmp',
        'home',
        'dev',
        'proc',
        ...[...files.keys()].map((file) => file.slice(1)),
      ],
      readFile: (filename: string) => {
        const content = files.get(filename)
        if (content === undefined) {
          throw new Error('FS error')
        }
        return content
      },
      unlink: (filename: string) => {
        files.delete(filename)
      },
    },
  } satisfies OpenCascadeInstance

  return {
    oc,
    calls,
  }
}

describe('writeStepFromAuthoritativeShapeSet', () => {
  it('writes STEP text from one authoritative B-rep shape', () => {
    const { oc, calls } = createFakeOc()
    const shape = { delete: () => undefined }
    const result = writeStepFromAuthoritativeShapeSet(
      oc,
      { ownedResources: [shape] },
      'parahook-build.step',
    )

    expect(calls.transferShape).toBe(shape)
    expect(result).toContain('ISO-10303-21')
    expect(result).toContain('END-ISO-10303-21')
  })

  it('reads the newly written MEMFS file when OpenCascade mangles the requested filename', () => {
    const { oc } = createFakeOc({ writeToMangledFile: true })
    const result = writeStepFromAuthoritativeShapeSet(
      oc,
      { ownedResources: [{ delete: () => undefined }] },
      'parahook-build.step',
    )

    expect(result).toContain('FAKE STEP')
  })

  it('combines multiple retained shapes into a compound before transfer', () => {
    const { oc, calls } = createFakeOc()
    const shapeA = { delete: () => undefined }
    const shapeB = { delete: () => undefined }
    writeStepFromAuthoritativeShapeSet(
      oc,
      { ownedResources: [shapeA, shapeB] },
      'parahook-build.step',
    )

    expect(calls.compoundAdds).toEqual([shapeA, shapeB])
    expect(calls.transferShape).toMatchObject({ kind: 'compound' })
  })

  it('rejects empty shape sets and failed writer statuses', () => {
    const { oc } = createFakeOc()
    expect(() =>
      writeStepFromAuthoritativeShapeSet(
        oc,
        { ownedResources: [] } satisfies AuthoritativeShapeSetResource,
        'parahook-build.step',
      ),
    ).toThrow('Authoritative shape set is empty.')

    const failingTransfer = createFakeOc({ transferDone: false }).oc
    expect(() =>
      writeStepFromAuthoritativeShapeSet(
        failingTransfer,
        { ownedResources: [{ delete: () => undefined }] },
        'parahook-build.step',
      ),
    ).toThrow('STEP writer transfer failed.')

    const failingWrite = createFakeOc({ writeDone: false }).oc
    expect(() =>
      writeStepFromAuthoritativeShapeSet(
        failingWrite,
        { ownedResources: [{ delete: () => undefined }] },
        'parahook-build.step',
      ),
    ).toThrow('STEP writer file write failed.')
  })
})

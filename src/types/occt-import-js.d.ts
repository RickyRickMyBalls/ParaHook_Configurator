declare module 'occt-import-js/dist/occt-import-js.js' {
  export type OcctImportLinearUnit =
    | 'millimeter'
    | 'centimeter'
    | 'meter'
    | 'inch'
    | 'foot'

  export type OcctImportParams = {
    linearUnit?: OcctImportLinearUnit
    linearDeflectionType?: 'bounding_box_ratio' | 'absolute_value'
    linearDeflection?: number
    angularDeflection?: number
  }

  export type OcctImportFaceColor = {
    first: number
    last: number
    color: [number, number, number] | null
  }

  export type OcctImportMesh = {
    name?: string
    color?: [number, number, number]
    brep_faces?: OcctImportFaceColor[]
    attributes: {
      position: {
        array: number[]
      }
      normal?: {
        array: number[]
      }
    }
    index: {
      array: number[]
    }
  }

  export type OcctImportNode = {
    name: string
    meshes: number[]
    children: OcctImportNode[]
  }

  export type OcctImportResult = {
    success: boolean
    root: OcctImportNode
    meshes: OcctImportMesh[]
  }

  export type OcctImportJsModule = {
    ReadStepFile(content: Uint8Array, params: OcctImportParams | null): OcctImportResult
  }

  export type OcctImportJsFactoryOptions = {
    locateFile?: (path: string, scriptDirectory: string) => string
  }

  export default function occtimportjs(
    options?: OcctImportJsFactoryOptions,
  ): Promise<OcctImportJsModule>
}

declare module 'occt-import-js/dist/occt-import-js.wasm?url' {
  const url: string
  export default url
}

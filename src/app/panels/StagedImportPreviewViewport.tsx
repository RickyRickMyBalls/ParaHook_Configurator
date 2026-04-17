import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  Box3,
  DirectionalLight,
  GridHelper,
  MathUtils,
  Object3D,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { disposeReferenceObjectTree, loadReferenceAssetObject } from '../../viewer/referenceAssetLoader'
import {
  resolveStagedImportScaleMultiplier,
  resolveStagedImportUpAxisRotationDeg,
} from '../references/stagedImportTransforms'
import type { StagedImportDraftFileRecord } from '../store/useAppStore'

type StagedImportPreviewViewportProps = {
  selectedFile: StagedImportDraftFileRecord | null
}

type PreviewViewportState =
  | { status: 'idle' }
  | { status: 'loading'; fileName: string }
  | { status: 'ready'; fileName: string; renderingUnavailable: boolean }
  | { status: 'error'; fileName: string; errorMessage: string }

const DEFAULT_STATUS: PreviewViewportState = { status: 'idle' }

const canRenderPreviewViewport = () =>
  typeof window !== 'undefined' &&
  (typeof WebGLRenderingContext !== 'undefined' || typeof WebGL2RenderingContext !== 'undefined')

const resolvePreviewSize = (canvas: HTMLCanvasElement) => {
  const width = Math.max(Math.floor(canvas.clientWidth), 1)
  const height = Math.max(Math.floor(canvas.clientHeight), 1)
  return { width, height }
}

const applyPreviewObjectUpAxis = (
  object: Object3D,
  upAxis: Pick<StagedImportDraftFileRecord, 'upAxis'>['upAxis'],
) => {
  const rotationDeg = resolveStagedImportUpAxisRotationDeg(upAxis)
  object.rotation.set(
    MathUtils.degToRad(rotationDeg.x),
    MathUtils.degToRad(rotationDeg.y),
    MathUtils.degToRad(rotationDeg.z),
  )
}

const applyPreviewObjectScale = (
  object: Object3D,
  file: Pick<StagedImportDraftFileRecord, 'scaleAlignment' | 'scaleMultiplier'>,
) => {
  const scaleFactor = resolveStagedImportScaleMultiplier(file)
  object.scale.setScalar(scaleFactor)
}

const applyPreviewObjectStagedTransforms = (
  object: Object3D,
  file: Pick<StagedImportDraftFileRecord, 'upAxis' | 'scaleAlignment' | 'scaleMultiplier'>,
) => {
  applyPreviewObjectUpAxis(object, file.upAxis)
  applyPreviewObjectScale(object, file)
  object.updateMatrixWorld(true)
}

const resolvePreviewObjectBoundingSphere = (object: Object3D) => {
  const bounds = new Box3().setFromObject(object)
  const sphere = bounds.isEmpty()
    ? new Sphere(new Vector3(0, 0, 0), 0.5)
    : bounds.getBoundingSphere(new Sphere())
  return {
    center: sphere.center.clone(),
    radius: Math.max(sphere.radius, 0.5),
  }
}

export const framePreviewCameraToObject = (camera: PerspectiveCamera, object: Object3D) => {
  const { center, radius } = resolvePreviewObjectBoundingSphere(object)
  const viewDirection = new Vector3(1, 0.75, 1).normalize()
  const verticalHalfFov = MathUtils.degToRad(camera.fov) * 0.5
  const horizontalHalfFov = Math.atan(
    Math.tan(verticalHalfFov) * Math.max(camera.aspect, 0.01),
  )
  const limitingHalfFov = Math.max(
    Math.min(verticalHalfFov, horizontalHalfFov),
    MathUtils.degToRad(8),
  )
  const distance = (radius / Math.tan(limitingHalfFov)) * 1.18

  camera.near = Math.max(radius / 100, 0.01)
  camera.far = Math.max(distance + radius * 12, radius * 24)
  camera.position.copy(center).addScaledVector(viewDirection, distance)
  camera.lookAt(center)
  camera.updateProjectionMatrix()
  return center
}

const recenterPreviewCameraToObjectAtCurrentDistance = (
  camera: PerspectiveCamera,
  controls: OrbitControls,
  object: Object3D,
) => {
  const { center, radius } = resolvePreviewObjectBoundingSphere(object)
  const currentOffset = camera.position.clone().sub(controls.target)
  if (currentOffset.lengthSq() === 0) {
    currentOffset.copy(new Vector3(1, 0.75, 1).normalize().multiplyScalar(Math.max(radius * 2, 1)))
  }

  const currentDistance = Math.max(currentOffset.length(), 0.1)
  camera.near = Math.max(radius / 100, 0.01)
  camera.far = Math.max(currentDistance + radius * 12, radius * 24)
  camera.position.copy(center).add(currentOffset)
  camera.lookAt(center)
  camera.updateProjectionMatrix()
  controls.target.copy(center)
  controls.minDistance = Math.max(camera.near * 10, 0.1)
  controls.maxDistance = Math.max(camera.far * 0.5, controls.minDistance + 1)
  controls.update()
}

const disposePreviewRenderer = (
  renderer: WebGLRenderer | null,
  rootObject: Object3D | null,
  resizeObserver: ResizeObserver | null,
  controls: OrbitControls | null,
) => {
  controls?.dispose()
  resizeObserver?.disconnect()
  if (rootObject !== null) {
    disposeReferenceObjectTree(rootObject)
  }
  renderer?.dispose()
}

export function StagedImportPreviewViewport(props: StagedImportPreviewViewportProps) {
  const { selectedFile } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fitPreviewRef = useRef<(() => void) | null>(null)
  const runtimeRef = useRef<{
    camera: PerspectiveCamera | null
    renderer: WebGLRenderer | null
    rootObject: Object3D
    resizeObserver: ResizeObserver | null
    controls: OrbitControls | null
    fitPreviewToObject: (() => void) | null
    renderScene: (() => void) | null
    gridHelper: GridHelper | null
  } | null>(null)
  const [previewState, setPreviewState] = useState<PreviewViewportState>(DEFAULT_STATUS)
  const [gridVisible, setGridVisible] = useState(false)

  const disposeCurrentRuntime = () => {
    const runtime = runtimeRef.current
    fitPreviewRef.current = null
    if (runtime === null) {
      return
    }
    disposePreviewRenderer(
      runtime.renderer,
      runtime.rootObject,
      runtime.resizeObserver,
      runtime.controls,
    )
    runtimeRef.current = null
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (selectedFile === null) {
      disposeCurrentRuntime()
      setPreviewState(DEFAULT_STATUS)
      return
    }

    disposeCurrentRuntime()

    let cancelled = false
    let renderer: WebGLRenderer | null = null
    let rootObject: Object3D | null = null
    let resizeObserver: ResizeObserver | null = null
    let controls: OrbitControls | null = null

    setPreviewState({
      status: 'loading',
      fileName: selectedFile.fileName,
    })

    void loadReferenceAssetObject({
      fileType: selectedFile.fileType,
      assetPath: selectedFile.objectUrl,
    })
      .then((loadedObject) => {
        if (cancelled) {
          disposeReferenceObjectTree(loadedObject)
          return
        }

        rootObject = loadedObject
        applyPreviewObjectStagedTransforms(loadedObject, selectedFile)

        if (canvas === null || !canRenderPreviewViewport()) {
          runtimeRef.current = {
            camera: null,
            renderer: null,
            rootObject: loadedObject,
            resizeObserver: null,
            controls: null,
            fitPreviewToObject: null,
            renderScene: null,
            gridHelper: null,
          }
          fitPreviewRef.current = null
          setPreviewState({
            status: 'ready',
            fileName: selectedFile.fileName,
            renderingUnavailable: true,
          })
          return
        }

        const scene = new Scene()
        const camera = new PerspectiveCamera(42, 1, 0.1, 1000)
        const ambientLight = new AmbientLight(0xffffff, 1.05)
        const keyLight = new DirectionalLight(0xffffff, 1.35)
        keyLight.position.set(6, 8, 10)
        const fillLight = new DirectionalLight(0xaec5ff, 0.65)
        fillLight.position.set(-6, 4, -8)
        const gridHelper = new GridHelper(300, 30, 0x7ca0ff, 0x3e4e78)
        gridHelper.visible = gridVisible
        scene.add(ambientLight, keyLight, fillLight, gridHelper, loadedObject)

        renderer = new WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        controls = new OrbitControls(camera, canvas)
        controls.enableDamping = false
        controls.enablePan = false

        const renderScene = () => {
          if (renderer === null) {
            return
          }
          const { width, height } = resolvePreviewSize(canvas)
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
        }

        const fitPreviewToObject = () => {
          const { width, height } = resolvePreviewSize(canvas)
          camera.aspect = width / height
          const framedCenter = framePreviewCameraToObject(camera, loadedObject)
          controls?.target.copy(framedCenter)
          controls!.minDistance = Math.max(camera.near * 10, 0.1)
          controls!.maxDistance = Math.max(camera.far * 0.5, controls!.minDistance + 1)
          controls?.update()
          renderScene()
        }

        fitPreviewRef.current = fitPreviewToObject
        runtimeRef.current = {
          camera,
          renderer,
          rootObject: loadedObject,
          resizeObserver,
          controls,
          fitPreviewToObject,
          renderScene,
          gridHelper,
        }
        controls.addEventListener('change', renderScene)

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            renderScene()
          })
          resizeObserver.observe(canvas)
          runtimeRef.current.resizeObserver = resizeObserver
        }

        fitPreviewToObject()
        setPreviewState({
          status: 'ready',
          fileName: selectedFile.fileName,
          renderingUnavailable: false,
        })
      })
      .catch((error) => {
        if (cancelled) {
          return
        }
        if (renderer === null && rootObject !== null) {
          disposeReferenceObjectTree(rootObject)
          rootObject = null
        }
        setPreviewState({
          status: 'error',
          fileName: selectedFile.fileName,
          errorMessage: error instanceof Error ? error.message : 'Preview loading failed.',
        })
      })

    return () => {
      cancelled = true
      disposeCurrentRuntime()
    }
  }, [selectedFile?.stagedFileId, selectedFile?.fileType, selectedFile?.objectUrl, selectedFile?.fileName])

  useEffect(() => {
    if (selectedFile === null) {
      return
    }
    const runtime = runtimeRef.current
    if (runtime === null) {
      return
    }
    applyPreviewObjectUpAxis(runtime.rootObject, selectedFile.upAxis)
    runtime.rootObject.updateMatrixWorld(true)
    runtime.fitPreviewToObject?.()
  }, [selectedFile?.stagedFileId, selectedFile?.upAxis])

  useEffect(() => {
    if (selectedFile === null) {
      return
    }
    const runtime = runtimeRef.current
    if (runtime === null) {
      return
    }
    applyPreviewObjectScale(runtime.rootObject, selectedFile)
    runtime.rootObject.updateMatrixWorld(true)
    if (runtime.camera !== null && runtime.controls !== null) {
      recenterPreviewCameraToObjectAtCurrentDistance(
        runtime.camera,
        runtime.controls,
        runtime.rootObject,
      )
    }
    runtime.renderScene?.()
  }, [selectedFile?.stagedFileId, selectedFile?.scaleAlignment, selectedFile?.scaleMultiplier])

  useEffect(() => {
    const runtime = runtimeRef.current
    if (runtime?.gridHelper === null || runtime?.gridHelper === undefined) {
      return
    }
    runtime.gridHelper.visible = gridVisible
    runtime.renderScene?.()
  }, [gridVisible])

  const handleZoomToFit = () => {
    fitPreviewRef.current?.()
  }

  const handleToggleGrid = () => {
    setGridVisible((current) => !current)
  }

  const previewControlsEnabled =
    previewState.status === 'ready' && !previewState.renderingUnavailable

  return (
    <div className="BrowserImportDialogViewportCanvasFrame">
      <div className="BrowserImportDialogViewportCanvasShell">
        <canvas
          ref={canvasRef}
          className="BrowserImportDialogViewportCanvas"
          aria-hidden="true"
        />
        {previewState.status === 'ready' ? (
          <div className="BrowserImportDialogViewportActionStack">
            <button
              type="button"
              className="BrowserImportDialogViewportOverlayButton"
              aria-label={
                gridVisible
                  ? `Hide the 300 by 300 preview grid for ${previewState.fileName}`
                  : `Show the 300 by 300 preview grid for ${previewState.fileName}`
              }
              aria-pressed={gridVisible}
              title={gridVisible ? 'Hide 300x300 preview grid' : 'Show 300x300 preview grid'}
              onClick={handleToggleGrid}
              disabled={!previewControlsEnabled}
            >
              <svg
                className="BrowserImportDialogViewportOverlayIcon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15M7 4.5v15M12 4.5v15M17 4.5v15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="BrowserImportDialogViewportOverlayButton"
              aria-label={`Zoom ${previewState.fileName} to fit the preview viewport`}
              title="Zoom to fit preview"
              onClick={handleZoomToFit}
              disabled={!previewControlsEnabled}
            >
              <svg
                className="BrowserImportDialogViewportOverlayIcon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M14.25 14.25 19 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 7.6v4.8M7.6 10h4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
      <div className="BrowserImportDialogViewportStatus" role="status" aria-live="polite">
        {previewState.status === 'idle' ? (
          <span className="BrowserImportDialogViewportEmptyState">
            No staged object is loaded yet. Use Load Into Preview Viewport on a staged file to
            inspect and orbit it here before commit.
          </span>
        ) : null}
        {previewState.status === 'loading' ? (
          <span className="BrowserImportDialogViewportReadyState">
            Loading preview for {previewState.fileName}...
          </span>
        ) : null}
        {previewState.status === 'ready' ? (
          <div className="BrowserImportDialogViewportReadyCopy">
            <span className="BrowserImportDialogViewportReadyState">
              Preview loaded for {previewState.fileName}.
            </span>
            <span className="BrowserImportDialogViewportHint">
              {previewState.renderingUnavailable
                ? 'Rendering is unavailable in this environment, but the staged object loaded successfully.'
                : 'Orbit stays local to this preview viewport and does not add anything to project content.'}
            </span>
          </div>
        ) : null}
        {previewState.status === 'error' ? (
          <div className="BrowserImportDialogViewportErrorCopy">
            <span className="BrowserImportDialogViewportErrorTitle">
              Preview failed for {previewState.fileName}.
            </span>
            <span className="BrowserImportDialogViewportHint">{previewState.errorMessage}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

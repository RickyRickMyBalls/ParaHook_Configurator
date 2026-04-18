import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { CatalogItemPreviewMedia } from '../catalogItemContract'
import { resolveCatalogPreviewMediaSrc } from '../catalogItemContract'
import type { ReferenceFileType } from '../../references/referenceManifest'
import {
  disposeReferenceObjectTree,
  hasWarmReferenceAssetObject,
  loadReferenceAssetObject,
  readWarmReferenceAssetObjectClone,
} from '../../../viewer/referenceAssetLoader'

type CatalogCardPreviewViewportProps = {
  itemId: string
  itemLabel: string
  previewSource: {
    fileType: ReferenceFileType
    objectUrl: string
  }
  fallbackPreviewMedia: CatalogItemPreviewMedia | null
  surfaceKind?: 'card' | 'item-page'
}

type CatalogCardPreviewViewportStatus =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'rendering-unavailable' }
  | { status: 'error'; errorMessage: string }

const canRenderCatalogCardPreviewViewport = () =>
  typeof window !== 'undefined' &&
  (typeof WebGLRenderingContext !== 'undefined' || typeof WebGL2RenderingContext !== 'undefined')

const resolvePreviewViewportSize = (canvas: HTMLCanvasElement) => {
  const width = Math.max(Math.floor(canvas.clientWidth), 1)
  const height = Math.max(Math.floor(canvas.clientHeight), 1)
  return { width, height }
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

const framePreviewCameraToObject = (camera: PerspectiveCamera, object: Object3D) => {
  const { center, radius } = resolvePreviewObjectBoundingSphere(object)
  const distance = radius * 2.6
  const viewDirection = new Vector3(1, 0.75, 1).normalize()

  camera.near = Math.max(radius / 100, 0.01)
  camera.far = Math.max(distance + radius * 12, radius * 24)
  camera.position.copy(center).addScaledVector(viewDirection, distance)
  camera.lookAt(center)
  camera.updateProjectionMatrix()
  return center
}

export function CatalogCardPreviewViewport(props: CatalogCardPreviewViewportProps) {
  const {
    itemId,
    itemLabel,
    previewSource,
    fallbackPreviewMedia,
    surfaceKind = 'card',
  } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const runtimeRef = useRef<{
    renderer: WebGLRenderer | null
    rootObject: Object3D | null
    resizeObserver: ResizeObserver | null
    controls: OrbitControls | null
  } | null>(null)
  const [viewportStatus, setViewportStatus] = useState<CatalogCardPreviewViewportStatus>({
    status: canRenderCatalogCardPreviewViewport()
      ? hasWarmReferenceAssetObject({
          fileType: previewSource.fileType,
          assetPath: previewSource.objectUrl,
        })
        ? 'ready'
        : 'loading'
      : 'rendering-unavailable',
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null || !canRenderCatalogCardPreviewViewport()) {
      setViewportStatus({ status: 'rendering-unavailable' })
      return
    }

    let cancelled = false
    let renderer: WebGLRenderer | null = null
    let rootObject: Object3D | null = null
    let resizeObserver: ResizeObserver | null = null
    let controls: OrbitControls | null = null

    const previewReference = {
      fileType: previewSource.fileType,
      assetPath: previewSource.objectUrl,
    }

    const mountLoadedObject = (loadedObject: Object3D) => {
      if (cancelled) {
        disposeReferenceObjectTree(loadedObject)
        return
      }

      rootObject = loadedObject
      const scene = new Scene()
      const camera = new PerspectiveCamera(36, 1, 0.1, 1000)
      const ambientLight = new AmbientLight(0xffffff, 1.15)
      const keyLight = new DirectionalLight(0xffffff, 1.3)
      keyLight.position.set(5, 8, 10)
      const fillLight = new DirectionalLight(0x9ac4ff, 0.55)
      fillLight.position.set(-6, 4, -7)
      scene.add(ambientLight, keyLight, fillLight, loadedObject)

      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

      controls = new OrbitControls(camera, canvas)
      controls.enablePan = false
      controls.enableDamping = false

      const renderScene = () => {
        if (renderer === null) {
          return
        }
        const { width, height } = resolvePreviewViewportSize(canvas)
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
      }

      const framedCenter = framePreviewCameraToObject(camera, loadedObject)
      controls.target.copy(framedCenter)
      controls.minDistance = Math.max(camera.near * 10, 0.1)
      controls.maxDistance = Math.max(camera.far * 0.5, controls.minDistance + 1)
      controls.update()
      controls.addEventListener('change', renderScene)

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          renderScene()
        })
        resizeObserver.observe(canvas)
      }

      runtimeRef.current = {
        renderer,
        rootObject: loadedObject,
        resizeObserver,
        controls,
      }
      renderScene()
      setViewportStatus({ status: 'ready' })
    }

    const warmObject = readWarmReferenceAssetObjectClone(previewReference)
    if (warmObject !== null) {
      mountLoadedObject(warmObject)
      return () => {
        cancelled = true
        controls?.dispose()
        resizeObserver?.disconnect()
        if (rootObject !== null) {
          disposeReferenceObjectTree(rootObject)
        }
        renderer?.dispose()
        runtimeRef.current = null
      }
    }

    setViewportStatus({ status: 'loading' })

    void loadReferenceAssetObject(previewReference)
      .then((loadedObject) => {
        mountLoadedObject(loadedObject)
      })
      .catch((error) => {
        if (cancelled) {
          return
        }
        if (rootObject !== null) {
          disposeReferenceObjectTree(rootObject)
          rootObject = null
        }
        setViewportStatus({
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Interactive preview failed.',
        })
      })

    return () => {
      cancelled = true
      controls?.dispose()
      resizeObserver?.disconnect()
      if (rootObject !== null) {
        disposeReferenceObjectTree(rootObject)
      }
      renderer?.dispose()
      runtimeRef.current = null
    }
  }, [previewSource.fileType, previewSource.objectUrl])

  const fallbackPreviewSrc =
    fallbackPreviewMedia?.mediaKind === 'image'
      ? resolveCatalogPreviewMediaSrc(fallbackPreviewMedia.src)
      : null

  return (
    <div
      className={`CatalogCardPreviewViewport CatalogCardPreviewViewport--${surfaceKind} CatalogCardPreviewViewport--${viewportStatus.status}`}
      data-catalog-preview-viewport={itemId}
      data-catalog-preview-surface-kind={surfaceKind}
      onClick={(event) => {
        event.stopPropagation()
      }}
      onDoubleClick={(event) => {
        event.stopPropagation()
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
      }}
    >
      <canvas
        ref={canvasRef}
        className="CatalogCardPreviewViewportCanvas"
        aria-label={`${itemLabel} interactive preview viewport`}
      />
      {viewportStatus.status !== 'ready' && fallbackPreviewSrc !== null ? (
        <img
          className="CatalogCardPreviewViewportFallback"
          src={fallbackPreviewSrc}
          alt={fallbackPreviewMedia?.alt ?? `${itemLabel} preview`}
        />
      ) : null}
      <div className="CatalogCardPreviewViewportOverlay">
        <span className="CatalogCardPreviewViewportHint">
          {viewportStatus.status === 'ready'
            ? 'Drag to rotate'
            : viewportStatus.status === 'loading'
              ? 'Preparing 3D preview...'
              : viewportStatus.status === 'rendering-unavailable'
                ? 'Interactive preview unavailable here'
                : '3D preview failed'}
        </span>
        {viewportStatus.status === 'error' ? (
          <span className="CatalogCardPreviewViewportError">{viewportStatus.errorMessage}</span>
        ) : null}
      </div>
    </div>
  )
}

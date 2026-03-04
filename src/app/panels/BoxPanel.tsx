import { useEffect } from 'react'
import type { BoxParams } from '../../shared/buildTypes'
import { useAppStore } from '../store/useAppStore'

const sliderStyle = { width: '100%' }

type SliderProps = {
  label: string
  value: number
  onChange: (value: number) => void
  onInteractionStart: () => void
  onInteractionEnd: () => void
}

function ParamSlider({
  label,
  value,
  onChange,
  onInteractionStart,
  onInteractionEnd,
}: SliderProps) {
  return (
    <label style={{ display: 'block', marginBottom: '1rem' }}>
      <div style={{ fontSize: '12px', marginBottom: '0.4rem', color: 'var(--v15-text-dim)' }}>
        {label}: {value.toFixed(2)}
      </div>
      <input
        type="range"
        min={0.2}
        max={6}
        step={0.1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerDown={onInteractionStart}
        onPointerUp={onInteractionEnd}
        onPointerCancel={onInteractionEnd}
        onBlur={onInteractionEnd}
        style={sliderStyle}
      />
    </label>
  )
}

export function BoxPanel() {
  const box = useAppStore((state) => state.box)
  const setBoxParam = useAppStore((state) => state.setBoxParam)
  const beginInteraction = useAppStore((state) => state.beginInteraction)
  const endInteraction = useAppStore((state) => state.endInteraction)
  const isInteracting = useAppStore((state) => state.isInteracting)
  const lastBuildSeq = useAppStore((state) => state.lastBuildSeq)

  const setParam = (key: keyof BoxParams) => (value: number) => {
    setBoxParam(key, value)
  }

  useEffect(() => {
    if (!isInteracting) {
      return
    }

    const handlePointerEnd = () => {
      endInteraction()
    }
    window.addEventListener('pointerup', handlePointerEnd)
    window.addEventListener('pointercancel', handlePointerEnd)
    return () => {
      window.removeEventListener('pointerup', handlePointerEnd)
      window.removeEventListener('pointercancel', handlePointerEnd)
    }
  }, [isInteracting, endInteraction])

  return (
    <section className="V15Panel">
      <h2 className="V15PanelTitle">Box Params</h2>
      <ParamSlider
        label="Width"
        value={box.width}
        onChange={setParam('width')}
        onInteractionStart={beginInteraction}
        onInteractionEnd={endInteraction}
      />
      <ParamSlider
        label="Length"
        value={box.length}
        onChange={setParam('length')}
        onInteractionStart={beginInteraction}
        onInteractionEnd={endInteraction}
      />
      <ParamSlider
        label="Height"
        value={box.height}
        onChange={setParam('height')}
        onInteractionStart={beginInteraction}
        onInteractionEnd={endInteraction}
      />
      <div className="V15Meta">
        Last build seq: {lastBuildSeq}
      </div>
    </section>
  )
}

import type {
  RadioTransportState,
  RadioWaveformState,
  SamplerStep,
} from '../store/audioSamplerStore'

type RadioWaveformStripProps = {
  waveform: RadioWaveformState
  transport: RadioTransportState
  stepMarkers: SamplerStep[]
  activeStepIndex: number | null
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export function RadioWaveformStrip(props: RadioWaveformStripProps) {
  const { waveform, transport, stepMarkers, activeStepIndex } = props
  const normalizedPlayhead =
    transport.durationSec > 0 ? clamp(transport.currentTimeSec / transport.durationSec, 0, 1) : 0

  return (
    <div
      className={`RadioWaveformStrip is-${waveform.kind}`}
      data-waveform-kind={waveform.kind}
      aria-label="Radio waveform"
    >
      <div className="RadioWaveformStripCanvas">
        {waveform.kind === 'exact' ? (
          <div className="RadioWaveformBars" data-sample-count={waveform.samples.length}>
            {waveform.samples.map((sample, index) => (
              <span
                key={`${waveform.sourceId ?? 'waveform'}-${index}`}
                className="RadioWaveformBar"
                style={{
                  height: `${Math.max(6, Math.round(clamp(sample, 0, 1) * 100))}%`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="RadioWaveformLimitedLane">
            <div className="RadioWaveformLimitedGrid" />
          </div>
        )}

        <div
          className="RadioWaveformPlayhead"
          style={{ left: `${normalizedPlayhead * 100}%` }}
          aria-hidden="true"
        />

        {stepMarkers.map((step, index) => (
          <div
            key={step.id}
            className={`RadioWaveformStepMarker ${step.isLocked ? 'isLocked' : ''} ${
              activeStepIndex === index ? 'isActive' : ''
            }`}
            style={{ left: `${clamp(step.cueRatio, 0, 1) * 100}%` }}
            title={`Step ${index + 1}`}
            aria-hidden="true"
          />
        ))}
      </div>
      {waveform.message !== null ? (
        <div className="RadioWaveformMessage">{waveform.message}</div>
      ) : null}
    </div>
  )
}

import { afterEach, describe, expect, it, vi } from 'vitest'

const { initOpenCascadeMock } = vi.hoisted(() => ({
  initOpenCascadeMock: vi.fn<
    () => Promise<{
      readonly marker: 'oc'
    }>
  >(),
}))

vi.mock('./opencascadeBrowser', () => ({
  initOpenCascade: initOpenCascadeMock,
}))

afterEach(() => {
  initOpenCascadeMock.mockReset()
})

describe('ocInit worker boot seam', () => {
  it('memoizes OpenCascade boot so repeated warm calls reuse one init request', async () => {
    initOpenCascadeMock.mockResolvedValue({
      marker: 'oc',
    })

    vi.resetModules()
    const { warmOc } = await import('./ocInit')

    const firstPromise = warmOc()
    const secondPromise = warmOc()
    const [firstModule, secondModule] = await Promise.all([firstPromise, secondPromise])

    expect(initOpenCascadeMock).toHaveBeenCalledTimes(1)
    expect(firstPromise).toBe(secondPromise)
    expect(firstModule).toBe(secondModule)
    expect(firstModule).toEqual({
      marker: 'oc',
    })
  })

  it('keeps the getter seam aligned with the warm boot seam', async () => {
    initOpenCascadeMock.mockResolvedValue({
      marker: 'oc',
    })

    vi.resetModules()
    const { getOc, warmOc } = await import('./ocInit')

    const warmPromise = warmOc()
    const getterPromise = getOc()
    const [warmModule, getterModule] = await Promise.all([warmPromise, getterPromise])

    expect(initOpenCascadeMock).toHaveBeenCalledTimes(1)
    expect(getterPromise).toBe(warmPromise)
    expect(getterModule).toBe(warmModule)
  })
})

let warmPromise: Promise<void> | null = null

const bootOc = async (): Promise<void> => {
  await Promise.resolve()
}

export const warmOc = (): Promise<void> => {
  if (warmPromise === null) {
    warmPromise = bootOc()
  }
  return warmPromise
}

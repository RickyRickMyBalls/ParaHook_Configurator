export interface ScheduleResult<T> {
  isLatest: boolean
  value: T
}

export class LatestOnlyScheduler {
  private latestTicket = 0

  public async schedule<T>(task: () => Promise<T>): Promise<ScheduleResult<T>> {
    const ticket = ++this.latestTicket
    const value = await task()
    return {
      isLatest: ticket === this.latestTicket,
      value,
    }
  }
}

import type { Position } from './utils/index.js'


export class Notifier {

  private _notifications: Notification[]

  public constructor() {
    this._notifications = []
  }

  public get notifications(): ReadonlyArray<Notification> {
    return this._notifications
  }

  public add(args: Omit<NotificationArgs, 'duration'>): void {
    this._notifications.push(new Notification({ ...args, duration: 3 }))
  }

  public update(): void {
    this._notifications.forEach(notification => notification.update())
    this._notifications = this._notifications.filter(notif => !notif.expired)
  }
}



export class Notification {

  private _updates: number
  public readonly message: string
  public readonly position: Position
  public readonly duration: number
  
  public constructor(args: NotificationArgs) {
    this.message = args.message
    this.position = args.position
    this.duration = args.duration
    this._updates = 0
  }

  public get updates(): number {
    return this._updates
  }

  public update(): void {
    this._updates += 1
  }

  public get expired(): boolean {
    return this._updates >= this.duration
  }
}


export type NotificationArgs = {
  message: string
  position: Position
  duration: number
}
import { overwriteState } from '../actions'
import { Action, Dispatch } from '../constants'
import { State } from '../state'

export default class WebsocketAdapter {
  protected socket: WebSocket
  protected socketQueue: string[] = []

  public isDirty: boolean

  constructor(isHost: boolean) {
    this.socket = new WebSocket(`ws://${window.location.hostname}:8080`)
    this.socket.addEventListener('open', () => {
      this.socket.send(isHost ? 'host' : 'client')
      this.socketQueue.forEach(m => this.safeSend(m))
      this.socketQueue = []
    })
  }

  public sendNewState(state: State) {
    console.log('Sending new state', state)
    this.safeSend(JSON.stringify(overwriteState(state)))
  }

  // TODO: These should both check to make sure we haven't registered multiple times
  // I belieeeve we can't do this at creation because of a cyclic dependency --
  // we need the final dispatch function, not the one that exists at construction time

  public registerAsHost(dispatch: Dispatch) {
    this.socket.addEventListener('message', evt => {
      if (!evt.data) {
        return
      }
      // TODO: Whitelist actions
      const val: Action = JSON.parse(evt.data)
      console.log('Received message', val)
      dispatch(val)
    })
  }

  public registerAsClient(dispatch: Dispatch): string {
    this.socket.addEventListener('message', evt => {
      if (!evt.data) {
        return
      }
      const val: Action = JSON.parse(evt.data)
      console.log('New action', val)
      this.isDirty = false
      dispatch(val)
    })

    // TODO: Lol, this 'name generator' is dumb.
    return '' + Math.floor(Math.random() * 10000)
  }

  public dispatch = (action: Action) => {
    if ((action.type as string) === '@@redux/INIT') {
      return
    }

    if (this.isDirty) {
      console.log('Is dirty, not dispatching', action)
      return
    }

    console.log('Pushing action to remote messageQueue', action)
    console.log(this)
    this.safeSend(JSON.stringify(action))

    this.isDirty = true
  }

  protected safeSend(message: string) {
    if (this.socket.readyState !== 1) {
      this.socketQueue.push(message)
    } else {
      this.socket.send(message)
    }
  }
}

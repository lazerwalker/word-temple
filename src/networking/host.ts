const Peer = require('simple-peer');

import State from '../state';
import { Store } from 'redux';
import { overwriteState } from '../actions';

class Host {
  peer: any;
  store: Store<any>;

  constructor(store: Store<any>) {
    this.store = store;
    this.peer = new Peer({ initiator: true, trickle: false });

    this.peer.on('error', (err: String) => console.log('error', err));
    this.peer.on('signal', (data: any) => {
      let ws = new WebSocket("ws://localhost:8080");
      ws.addEventListener('open', () => {
        ws.send("host");
        ws.send(JSON.stringify(data));
      });

      ws.addEventListener("message", (d) => {
        console.log("Retransmitting WS signal", d.data);
        this.peer.signal(JSON.parse(d.data));
      });

      console.log("Sending signal to WS", JSON.stringify(data));
    });

    this.peer.on('connect', () => {
      console.log("CONNECTED");
      this.peer.send("connect");
    });

    this.peer.on('data', (data: any) => {
      let action = JSON.parse(data.toString());
      console.log("Received action", action)
      this.store.dispatch(action);
    });

    (window as any).signal = (s: any) => {
      console.log("SIGNALLING", s);
      this.peer.signal(s);
    };
  }

  sendNewState(state: State) {
    if (!this.peer.connected) {
      console.log("Not connected, not sending state to clients");
      return;
    }

    let action = overwriteState(state);
    console.log("Sending new state action", action);
    this.peer.send(JSON.stringify(action));
  }
}

export default Host;
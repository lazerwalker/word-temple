const Peer = require('simple-peer');

import { createNewRack } from '../actions';

import { Action } from '../constants';
import { Store } from 'redux';

class Client {
  peer: any;
  store: Store<any>;

  createdNewRack: boolean;

  constructor(store: Store<any>) {
    this.store = store;

    let ws = new WebSocket("ws://localhost:8080");
    ws.addEventListener('open', () => {
      ws.send("client");
    });

    ws.addEventListener("message", (d) => {
      console.log("Retransmitting signal from WS", d.data);
      this.peer.signal(JSON.parse(d.data));
    });

    this.peer = new Peer({ initiator: false, trickle: false });

    this.peer.on('error', (err: String) => console.log('error', err));
    this.peer.on('signal', (data: any) => {
      console.log("Generated signal", JSON.stringify(data));
      ws.send(JSON.stringify(data));
    });

    this.peer.on('connect', () => {
      console.log("CONNECTED");
      if (!this.createdNewRack) {
        this.dispatch(createNewRack("client"));
        this.createdNewRack = true;
      }
    });

    this.peer.on('data', (data: any) => {
      if (data.toString() === "connect") {
        if (!this.createdNewRack) {
          this.dispatch(createNewRack("client"));
          this.createdNewRack = true;
          return;
        }
      }

      console.log(data.toString());
      let action = JSON.parse(data.toString());
      this.store.dispatch(action);
    });

    (window as any).signal = (s: any) => {
      console.log("SIGNALLING", s);
      this.peer.signal(s);
    };
  }

  dispatch(action: Action) {
    setTimeout(() => {
      this.peer.send(JSON.stringify(action));
    }, 0);
  }
}
export default Client;
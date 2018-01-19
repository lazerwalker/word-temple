const Peer = require('simple-peer');

class Client {
  peer: any;

  constructor() {
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
      ws.send(JSON.stringify(data))
    });

    this.peer.on('connect', () => {
      console.log("CONNECTED");
      this.peer.send("HI MOM");
    });

    this.peer.on('data', (data: any) => {
      (window as any).data = data
      console.log("DATA", data)
    });

    (window as any).signal = (s: any) => {
      console.log("SIGNALLING", s);
      this.peer.signal(s);
    };
  }
}
export default Client;
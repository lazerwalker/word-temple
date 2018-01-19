const Peer = require('simple-peer');

class Host {
  peer: any;

  constructor() {
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

export default Host;
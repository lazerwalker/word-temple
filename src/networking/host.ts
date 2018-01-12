import createPeer from './peer';

class Host {
  peer: any;

  constructor() {
    this.peer = createPeer("host");
    this.peer.on('connection', (conn: any) => {
      console.log("Has connection");
      conn.send("Hi");
      conn.on("data", (data: any) => {
        console.log(`Received: "${data}"`);
      });
    });
  }
}

export default Host;
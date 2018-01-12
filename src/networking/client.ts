import createPeer from './peer';

class Client {
  peer: any;

  constructor() {
    this.peer = createPeer("client");
    const conn = this.peer.connect("host");
    console.log("Created connection")
    conn.on('open', () => {
      console.log("Connection open");
      conn.send("HI");
    });
    conn.on('data', (data: any) => {
      console.log(`Received: "${data}"`)
    })
  }
}

export default Client;
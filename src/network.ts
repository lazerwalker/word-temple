const Peer = require('pearjs');

const peer = new Peer({key: 'loz5e2phgwah5mi'});
alert("Opening peer");
peer.on('open', function(id: string) {
  alert('My peer ID is: ' + id);
});

peer.on('connection', (conn: any) => {
  conn.on('open', () => {
    conn.on("data", (data: any) => {
      alert(`Received: "${data}"`);
    });
    alert("connected");
  });
});

(<any> window).peer = peer;

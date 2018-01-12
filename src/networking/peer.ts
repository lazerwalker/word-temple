const Peer = require('pearjs');
export default function(id?: string) {
  if (id) {
    console.log("Peer with ID");
    return new Peer(id, {key: 'loz5e2phgwah5mi'});
  }
  return new Peer({key: 'loz5e2phgwah5mi'});
}


import Host from './host';
import Client from './client';

import { Store } from 'redux';

export default function instantiate(isHost: boolean, store: Store<any>) {
  if (isHost) {
    return new Host(store);
  } else {
    return new Client(store);
  }
}

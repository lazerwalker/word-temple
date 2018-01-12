import Host from './host';
import Client from './client';

export default function instantiate(isHost: boolean) {
  if (isHost) {
    return new Host();
  } else {
    return new Client();
  }
}
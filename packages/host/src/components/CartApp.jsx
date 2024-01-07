import { MountRemoteApp } from './MountRemote';

export default function CartApp() {
  return <MountRemoteApp key="cart" remoteName="cart" module="./bootstrap" />;
}

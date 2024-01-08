import { MountRemoteApp } from './MountRemote';

export default function CartApp() {
  return <MountRemoteApp key="auth" remoteName="auth" module="./bootstrap" />;
}

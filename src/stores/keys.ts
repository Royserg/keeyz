import { action, atom } from 'nanostores';
import { Key } from '../models';

export const keys = atom<Key[]>([]);

// export const setCapsLockStatus = action(isCapsLockOn, 'caps:toggle', (store, val: boolean) => {
//   store.set(val);
// });

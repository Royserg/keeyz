import { action, atom } from "nanostores";

// --------------
// -- CapsLock
export const isCapsLockOn = atom<boolean>(false);

export const setCapsLockStatus = action(
  isCapsLockOn,
  "caps:toggle",
  (store, val: boolean) => {
    store.set(val);
  }
);

// --------------
// -- Shift
export const isShiftOn = atom<boolean>(false);

export const setShiftStatus = action(
  isShiftOn,
  "shift:toggle",
  (store, val: boolean) => {
    store.set(val);
  }
);

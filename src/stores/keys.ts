import { action, atom, deepMap } from 'nanostores';
import { Key } from '../models';

const keyStore = atom<Key[]>([]);
const $keys = deepMap<Record<string, Key>>({});

const addKey = action($keys, 'keys:add', (store, key: Key) => {
  const currentStore = store.get();
  const lastKeyId = Object.keys(currentStore).at(-1);
  const lastKey = currentStore[lastKeyId || ''];

  if (lastKey?.value === key.value) {
    // NOTE: Bump up previous key instead of adding new Key to the list
    const updatedKey: Key = { ...lastKey, bumpCount: lastKey.bumpCount + 1 };
    store.setKey(lastKey.id, updatedKey);
  } else {
    store.setKey(key.id, key);
  }
});

const deleteKey = action($keys, 'keys:deleteOne', (store, id: string) => {
  store.setKey(id, undefined!);
});

export { $keys, keyStore, addKey, deleteKey };

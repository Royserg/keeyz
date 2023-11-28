import { Component, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { Key } from '../models';
import { $keys, deleteKey } from '../stores/keys';

interface ClickedKeyProps {
  keyId: string;
  timeToLive?: number;
}
const ClickedKey: Component<ClickedKeyProps> = (props) => {
  const [key, setKey] = createSignal<Key | null>(null);

  const keyId = props.keyId;
  const unlisten = $keys.subscribe((store) => {
    const key = store[keyId];
    if (key) {
      setKey(key);
    }
  });

  const timeToLive = props.timeToLive || 2000;

  onMount(() => {
    setTimeout(() => {
      deleteKey(keyId);
    }, timeToLive);
  });

  onCleanup(() => {
    unlisten();
  });

  return (
    <div class="relative p-2 px-3 border-solid border-r-slate-400 border-b-slate-500 border-r-4 border-b-4 rounded-md min-w-[40px] w-cax grid place-content-center bg-slate-200 font-medium">
      <Show when={key()}>
        {key()!.value}
        <Show when={key()?.bumpCount! > 0}>
          <div class="absolute top-0 right-0">{key()?.bumpCount}</div>
        </Show>
      </Show>
    </div>
  );
};

export { ClickedKey };

import { Component, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { Key } from '../models';
import { $keys, deleteKey } from '../stores/keys';
import { cn } from '../utils/cn';

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

  let timer: NodeJS.Timeout | null = null;
  const timeToLive = props.timeToLive || 2000;

  onMount(() => {
    timer = setTimeout(() => {
      deleteKey(keyId);
    }, timeToLive);
  });

  createEffect(() => {
    const currentKey = key();
    if (timer && currentKey && currentKey?.bumpCount > 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        deleteKey(keyId);
      }, timeToLive);
    }
  });

  onCleanup(() => {
    unlisten();
  });

  // FIX: Makes it go beyound borders and on top of the other keys
  const scale = (factor: number) => {
    return 1 + factor / 20;
  };

  return (
    <Show when={key()}>
      <div
        class={cn(
          'relative py-2 px-3 border-solid border-r-slate-400 border-b-slate-500 border-r-4 border-b-4 rounded-md min-w-[40px] w-cax grid place-content-center bg-slate-200 font-medium transition-all',
        )}
        style={{
          transform: `scale(${scale(key()?.bumpCount!)})`,
        }}
      >
        {key()!.value}
        <Show when={key()?.bumpCount! > 0}>
          <div class="absolute top-0 right-0">{key()?.bumpCount}</div>
        </Show>
      </div>
    </Show>
  );
};

export { ClickedKey };

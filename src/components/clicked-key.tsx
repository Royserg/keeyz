import { Component, createEffect, createSignal, onMount } from 'solid-js';
import { Key } from '../models';

interface ClickedKeyProps {
  key: Key;
  timeToLive?: number;
  onLifeEnd?: (id: string) => void;
  bumpCount?: number;
}
const ClickedKey: Component<ClickedKeyProps> = (props) => {
  // const [bumpCount, setBumpCount] = createSignal<number>(props.bumpCount || 0);
  const timeToLive = props.timeToLive || 2000;

  createEffect(() => {
    console.log('bumpCount:', props.bumpCount);
  });

  onMount(() => {
    setTimeout(() => {
      if (props.onLifeEnd) {
        props.onLifeEnd(props.key.id);
      }
    }, timeToLive);
  });

  return (
    <div class="relative p-2 px-3 border-solid border-r-slate-400 border-b-slate-500 border-r-4 border-b-4 rounded-md min-w-[40px] w-cax grid place-content-center bg-slate-200 font-medium">
      {props.key.value}

      <div class="absolute top-0 right-0">{props.key.bumpCount}</div>
    </div>
  );
};

export { ClickedKey };

import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { Component, For, createSignal, onCleanup, onMount } from 'solid-js';
import { Modifiers } from './components/modifiers';
import { KEY_EVENT, KeyEvent } from './interfaces/key.interface';
import { handleClickedKey } from './services/keys';

function App() {
  const [keys, setKeys] = createSignal<string[]>([]);

  let unlisten: UnlistenFn;
  onMount(async () => {
    unlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      console.log('EVENT', event);
      const { key, event_type } = event.payload;
      const clickedKey = handleClickedKey({
        keyName: key,
        eventType: event_type,
      });

      const updatedKeys = keys();
      if (updatedKeys.length > 5) {
        updatedKeys.pop();
      }

      if (clickedKey) {
        setKeys([clickedKey, ...updatedKeys]);
      }
    });
  });

  onCleanup(() => {
    unlisten();
  });

  return (
    <div class="container bg-black min-h-full h-24 p-1">
      <div class="flex flex-row-reverse gap-x-0.5">
        <For each={keys()}>{(item) => <ClickedKey data={item}></ClickedKey>}</For>
      </div>

      <div class="py-1"></div>

      <Modifiers />
    </div>
  );
}

export default App;

// -- ClickedKey
interface ClickedKeyProps {
  data: string;
}
const ClickedKey: Component<ClickedKeyProps> = (props) => {
  return (
    <div class="p-2 border-2 border-solid border-slate-300 rounded-md min-w-10 flex justify-center items-center bg-slate-200">
      {props.data}
    </div>
  );
};

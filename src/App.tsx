import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { ClickedKey } from './components/clicked-key';
import { Modifiers } from './components/modifiers';
import { KEY_EVENT, KeyEvent } from './interfaces/key.interface';
import { handleClickedKey } from './services/keys';

const MAX_KEYS = 4;

function App() {
  const [keys, setKeys] = createSignal<string[]>([]);

  let unlisten: UnlistenFn;
  onMount(async () => {
    unlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      const { key, event_type } = event.payload;
      const clickedKey = handleClickedKey({
        keyName: key,
        eventType: event_type,
      });

      const updatedKeys = keys();
      if (updatedKeys.length > MAX_KEYS) {
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
    <div class="container bg-black min-h-full h-24 p-1 rounded-sm">
      <div class="flex flex-row-reverse gap-x-1">
        <For each={keys()}>{(item) => <ClickedKey>{item}</ClickedKey>}</For>
      </div>

      <div class="py-1"></div>

      <Modifiers />
    </div>
  );
}

export default App;

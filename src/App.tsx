import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { ClickedKey } from './components/clicked-key';
import { Modifiers } from './components/modifiers';
import { KEY_EVENT, KeyEvent } from './interfaces/key.interface';
import { Key } from './models';
import { handleClickedKey } from './services/keys';

function App() {
  const [keys, setKeys] = createSignal<Key[]>([]);

  let unlisten: UnlistenFn;
  onMount(async () => {
    unlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      const { key, event_type } = event.payload;
      const clickedKey = handleClickedKey({
        keyName: key,
        eventType: event_type,
      });

      if (clickedKey) {
        setKeys([clickedKey, ...keys()]);
      }
    });
  });

  onCleanup(() => {
    unlisten();
  });

  const handleKeyLifeEnd = (id: string) => {
    setKeys((keys) => keys.filter((k) => k.id !== id));
  };

  return (
    <div class="container bg-black min-h-full h-24 p-1 rounded-sm">
      <div class="flex flex-row-reverse gap-x-1 overflow-hidden">
        <TransitionGroup
          onEnter={(el, done) => {
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 300,
            });
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 250,
            });
            a.finished.then(done);
          }}
        >
          <For each={keys()}>{(key) => <ClickedKey key={key} onLifeEnd={handleKeyLifeEnd} />}</For>
        </TransitionGroup>
      </div>

      <div class="py-1"></div>

      <Modifiers />
    </div>
  );
}

export default App;

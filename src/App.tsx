import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { ClickedKey } from './components/clicked-key';
import { Modifiers } from './components/modifiers';
import { KEY_EVENT, KeyEvent } from './interfaces/key.interface';
import { Key } from './models';
import { handleClickedKey } from './services/keys';
import { cn } from './utils/cn';
import { WINDOW_FOCUS_EVENT, WindowFocusEvent } from './interfaces/window.interface';

function App() {
  const [keys, setKeys] = createSignal<Key[]>([]);
  const [showBackground, setShowBackground] = createSignal(false);

  // -- Listeners
  let windowFocusUnlisten: UnlistenFn;
  let keyUnlisten: UnlistenFn;

  onMount(async () => {
    keyUnlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      const { key, event_type } = event.payload;
      const clickedKey = handleClickedKey({
        keyName: key,
        eventType: event_type,
      });

      if (clickedKey) {
        setKeys([...keys(), clickedKey]);
      }
    });

    windowFocusUnlisten = await listen(WINDOW_FOCUS_EVENT, (event: WindowFocusEvent) => {
      setShowBackground(event.payload.focused);
    });
  });

  onCleanup(() => {
    keyUnlisten();
    windowFocusUnlisten();
  });

  const handleKeyLifeEnd = (id: string) => {
    setKeys((keys) => keys.filter((k) => k.id !== id));
  };

  return (
    <div
      class={cn('container min-h-full h-24 p-1 transition-colors rounded-lg', {
        'border border-black border-solid': showBackground(),
      })}
    >
      <div class="flex justify-center gap-x-1 overflow-hidden">
        <TransitionGroup
          onEnter={(el, done) => {
            const a = el.animate(
              [
                { opacity: 0, transform: 'translateY(15px) scale(0.2)' },
                { opacity: 1, transform: 'translateY(0px) scale(1)' },
              ],
              {
                duration: 200,
              },
            );
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            const a = el.animate(
              [
                { opacity: 1, transform: 'translateX(0px) translateY(0px) scale(1)' },
                { opacity: 0, transform: 'translateX(-10px) translateY(10px) scale(0.2)' },
              ],
              {
                duration: 250,
              },
            );
            a.finished.then(done);
          }}
        >
          <For each={keys()}>{(key) => <ClickedKey key={key} timeToLive={1000} onLifeEnd={handleKeyLifeEnd} />}</For>
        </TransitionGroup>
      </div>

      <div class="py-1"></div>

      <Modifiers />
    </div>
  );
}

export default App;

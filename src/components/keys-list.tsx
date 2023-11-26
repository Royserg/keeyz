import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { KEY_EVENT, KeyEvent } from '../interfaces/key.interface';
import { Key } from '../models';
import { handleClickedKey } from '../services/keys';
import { ClickedKey } from './clicked-key';

const KeysList = () => {
  const [keys, setKeys] = createSignal<Key[]>([]);

  // -- Listeners
  let keyUnlisten: UnlistenFn;

  onMount(async () => {
    keyUnlisten = await listen(KEY_EVENT, (event: KeyEvent) => {
      const { key, event_type } = event.payload;
      const clickedKey = handleClickedKey({
        keyName: key,
        eventType: event_type,
      });

      if (clickedKey) {
        const lastElIdx = keys().length - 1;
        const lastEl = keys()[lastElIdx];

        if (lastEl?.value === clickedKey.value) {
          // NOTE: bump up previous key instead of adding another
          setKeys((prev) => {
            const lastEl = prev.pop();
            if (lastEl) {
              return [...prev, { ...lastEl, bumpCount: lastEl.bumpCount + 1 }];
            }
            return prev;
          });
        } else {
          setKeys([...keys(), clickedKey]);
        }
      }
    });
  });

  onCleanup(() => {
    keyUnlisten();
  });

  const handleKeyLifeEnd = (id: string) => {
    setKeys((keys) => keys.filter((k) => k.id !== id));
  };

  return (
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
        <For each={keys()}>{(key) => <ClickedKey key={key} timeToLive={2000} onLifeEnd={handleKeyLifeEnd} />}</For>
      </TransitionGroup>
    </div>
  );
};

export { KeysList };

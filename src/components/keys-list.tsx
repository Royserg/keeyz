import { useStore } from '@nanostores/solid';
import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { For, onCleanup, onMount } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { KEY_EVENT, KeyEvent } from '../interfaces/key.interface';
import { handleClickedKey } from '../services/keys';
import { $keys, addKey } from '../stores/keys';
import { ClickedKey } from './clicked-key';

const KeysList = () => {
  const keys = useStore($keys);

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
        addKey(clickedKey);
      }
    });
  });

  onCleanup(() => {
    keyUnlisten();
  });

  return (
    <div class="flex justify-end gap-x-1 pt-3">
      <TransitionGroup
        onEnter={(el, done) => {
          const a = el.animate(
            [
              { opacity: 0, transform: 'translateY(15px) scale(0.2)' },
              { opacity: 1, transform: 'translateY(0px) scale(1)' },
            ],
            {
              duration: 100,
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
        <For each={Object.keys(keys())}>{(keyId) => <ClickedKey keyId={keyId} />}</For>
      </TransitionGroup>
    </div>
  );
};

export { KeysList };

import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { Modifiers } from './components/modifiers';
import { cn } from './utils/cn';
import { WINDOW_FOCUS_EVENT, WindowFocusEvent } from './interfaces/window.interface';
import { KeysList } from './components/keys-list';

function App() {
  const [showBackground, setShowBackground] = createSignal(false);

  // -- Listeners
  let windowFocusUnlisten: UnlistenFn;

  onMount(async () => {
    windowFocusUnlisten = await listen(WINDOW_FOCUS_EVENT, (event: WindowFocusEvent) => {
      setShowBackground(event.payload.focused);
    });
  });

  onCleanup(() => {
    windowFocusUnlisten();
  });

  return (
    <div
      class={cn('container min-h-full h-24 p-1 transition-colors rounded-lg overflow-hidden', {
        'border border-black border-solid': showBackground(),
      })}
    >
      <KeysList />

      <div class="py-1"></div>

      <Modifiers />
    </div>
  );
}

export default App;

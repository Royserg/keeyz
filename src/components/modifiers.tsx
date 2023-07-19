import { Show, onMount } from "solid-js";

// --- Move mouse on top of the application window ---
// `mouseenter` will gets triggered to get status of CapsLock
import { useStore } from "@nanostores/solid";
import { LogicalPosition, appWindow } from "@tauri-apps/api/window";
import { isCapsLockOn, setCapsLockStatus } from "../stores/modifiers";
await appWindow.setCursorPosition(new LogicalPosition(50, 50));

export const Modifiers = () => {
  const body = document.querySelector("body")!;

  const isCapsOn = useStore(isCapsLockOn);

  const mouseEventHandler = (e: MouseEvent) => {
    const isCapsLockOn = e.getModifierState("CapsLock");

    if (isCapsLockOn) {
      setCapsLockStatus(true);
    } else {
      setCapsLockStatus(false);
    }

    body.removeEventListener("mouseenter", mouseEventHandler);
  };

  onMount(async () => {
    // Mouse event - Workaround to find Modifier key state (CapsLock)
    // Should fire one time
    body.addEventListener("mouseenter", mouseEventHandler);
  });

  return (
    <div class="flex gap-2">
      <Show when={isCapsOn()}>
        <div class="border-2 border-solid border- rounded-md p-2 bg-red-400 text-white font-bold">
          CapsLock
        </div>
      </Show>
    </div>
  );
};

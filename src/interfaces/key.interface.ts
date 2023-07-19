export const KEY_EVENT = "key-event";

export type KeyEventType = "KeyPress" | "KeyRelease";

export interface KeyEvent {
  id: number;
  event: string;
  payload: {
    event_type: KeyEventType;
    key: string;
  };
  windowLabel?: string;
}

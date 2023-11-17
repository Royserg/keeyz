export const WINDOW_FOCUS_EVENT = 'window-focus-event';

export interface WindowFocusEvent {
  id: number;
  event: string;
  payload: {
    focused: boolean;
  };
  windowLabel?: string;
}

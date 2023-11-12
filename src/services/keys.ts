import { useStore } from '@nanostores/solid';
import { KeyEventType } from '../interfaces/key.interface';
import { setCapsLockStatus, setShiftStatus, isShiftOn } from '../stores/modifiers';
import { Key } from '../models';

const isShiftActive = useStore(isShiftOn);

export const handleClickedKey = (data: { keyName: string; eventType: KeyEventType }): Key | undefined => {
  const { keyName, eventType } = data;

  // Handle modifiers: CapsLock, [Shift], [Ctrl]
  // - CapsLock
  {
    if (keyName === 'CapsLock') {
      if (eventType === 'KeyPress') {
        setCapsLockStatus(true);
      }
      if (eventType === 'KeyRelease') {
        setCapsLockStatus(false);
      }
      return;
    }
  }
  // - Shift
  {
    if (keyName === 'ShiftRight' || keyName === 'ShiftLeft') {
      if (eventType === 'KeyPress') {
        setShiftStatus(true);
      }
      if (eventType === 'KeyRelease') {
        setShiftStatus(false);
      }
      return;
    }
  }
  // - Ctrl?
  // - Fn?

  // Map to symbol that will be displayed
  if (eventType === 'KeyPress') {
    const keySymbol = mapKeyToSymbol(keyName);

    if (isShiftActive()) {
      return new Key('⇧+' + keySymbol);
      // return '⇧+' + keySymbol;
    }

    return new Key(keySymbol);
  }
};

const mapKeyToSymbol = (keyName: string): string => {
  const mappedToSymbol = keyNameToSymbolMap[keyName] || keyName;
  return mappedToSymbol;
};

// TODO: add Windows / MacOS symbols
// TODO: handle when key is pressed with modifiers, so it displays the 2nd key character (shift + 2 = @)
const keyNameToSymbolMap: { [key: string]: string } = {
  Escape: 'Esc',
  CapsLock: '⇪',
  Space: '␣',
  Backspace: '⌫',
  Return: '⏎',
  ShiftRight: '⇧',
  ShiftLeft: '⇧',
  ControlLeft: '⌃',
  ControlRight: '⌃',
  MetaLeft: '⌘',
  MetaRight: '⌘',
  Alt: '⌥',
  AltGr: '⌥',
  Tab: '⇥',
  SemiColon: ';',
  Quote: '"',
  BackSlash: '\\',
  RightBracket: ']',
  LeftBracket: '[',
  Comma: ',',
  Dot: '.',
  Equal: '=',
  Minus: '-',
  Function: 'fn',
  BackQuote: '`',
  'Unknown(179)': 'fn', // pressing fn key
  'Unknown(10)': '§', // pressing fn plus-minus sinusoid key (left-top corner)
  'Unknown(117)': 'Del', // Del key
  'Unknown(116)': 'PgUp', // PgUp key
  'Unknown(121)': 'PgDn', // PgDn key
  // --- Letter keys
  KeyA: 'a',
  KeyB: 'b',
  KeyC: 'c',
  KeyD: 'd',
  KeyE: 'e',
  KeyF: 'f',
  KeyG: 'g',
  KeyH: 'h',
  KeyI: 'i',
  KeyJ: 'j',
  KeyK: 'k',
  KeyL: 'l',
  KeyM: 'm',
  KeyN: 'n',
  KeyO: 'o',
  KeyP: 'p',
  KeyQ: 'q',
  KeyR: 'r',
  KeyS: 's',
  KeyT: 't',
  KeyU: 'u',
  KeyV: 'v',
  KeyW: 'w',
  KeyX: 'x',
  KeyY: 'y',
  KeyZ: 'z',
  // --- Num keys
  Num1: '1',
  Num2: '2',
  Num3: '3',
  Num4: '4',
  Num5: '5',
  Num6: '6',
  Num7: '7',
  Num8: '8',
  Num9: '9',
  Num0: '0',
  // TODO: to check -> F keys
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  // --- Extras
  RightArrow: '→ ',
  LeftArrow: '←',
  UpArrow: '↑',
  DownArrow: '↓',
};

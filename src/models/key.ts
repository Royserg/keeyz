import { nanoid } from 'nanoid';

export class Key {
  id: string;
  value: string;

  constructor(value: string) {
    this.id = nanoid();
    this.value = value;
  }
}

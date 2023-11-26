import { nanoid } from 'nanoid';

export class Key {
  id: string;
  value: string;
  bumpCount: number;

  constructor(value: string) {
    this.id = nanoid();
    this.value = value;
    this.bumpCount = 0;
  }
}

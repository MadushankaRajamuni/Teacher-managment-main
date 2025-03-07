export class ActionAlert {
  display: boolean;
  message: string;
  type: 'success' | 'error' | 'info';

  constructor(
    display?: boolean,
    message?: string,
    type?: 'success' | 'error' | 'info',
  ) {
    this.display = display || false;
    this.message = message || '';
    this.type = type || 'info';
  }
}

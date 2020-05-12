export interface UserInterface {
  readonly userId: number;

  readonly username: string;

  readonly balance: number;
}

export interface UserAuthInterface {
  readonly token: string;
}

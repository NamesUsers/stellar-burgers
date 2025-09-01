import { Dispatch, SetStateAction } from 'react';

export type LoginUIProps = {
  errorText?: string;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent, from: string) => void;
};

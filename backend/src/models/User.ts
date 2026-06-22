export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface UserCreatePayload {
  username: string;
  password: string;
}

export interface UserLoginPayload {
  username: string;
  password: string;
}

export interface UserSession {
  user_id: number;
  username: string;
}

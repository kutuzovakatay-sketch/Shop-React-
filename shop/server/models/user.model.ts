export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;      
  created_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;      
}

export interface LoginDTO {
  email: string;
  password: string;
}
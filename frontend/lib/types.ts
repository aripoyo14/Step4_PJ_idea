import { User as NextAuthUser } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Form types
export interface SignInFormValues {
  email: string;
  password: string;
}

export interface IdeaFormValues {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export interface CommentFormValues {
  content: string;
}

export interface ProfileFormValues {
  name: string;
  bio: string;
  skills: string[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Filter types
export interface IdeaFilters {
  category?: string;
  status?: string;
  search?: string;
  tags?: string[];
}
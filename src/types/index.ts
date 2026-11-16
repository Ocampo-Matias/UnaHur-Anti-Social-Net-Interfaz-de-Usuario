export interface User {
  id: number;
  nickName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostImage {
  id: number;
  url: string;
  PostId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiComment {
  id: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  PostId: number;
  UserId: number;
  User?: User;
}

export interface ApiPost {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  User?: User;
  Tags?: Tag[];
}

export interface PostUI {
  id: number | string;
  user: string;
  description: string;
  fullDescription?: string;
  images: string[];
  tags: string[];
  visibleComments: number;
}


import axios from 'axios';
import type { User, Tag, PostImage, ApiComment, ApiPost } from '../types';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export const getPosts = async (userId?: number): Promise<ApiPost[]> => {
    const params = userId ? { userId } : {};
    const res = await api.get<ApiPost[]>('/posts', { params });
    return res.data;
};

export const getPostById = async (id: number | string): Promise<ApiPost> => {
    const res = await api.get<ApiPost>(`/posts/${id}`);
    return res.data;
};

export const createPost = async (data: {
    description: string;
    userId: number;
    tagIds?: number[];
}): Promise<ApiPost> => {
    const res = await api.post<ApiPost>('/posts', data);
    return res.data;
};

export const getPostImages = async (postId: number | string): Promise<PostImage[]> => {
    const res = await api.get<PostImage[]>(`/postimages/post/${postId}`);
    return res.data;
};

export const createPostImage = async (data: {
    url: string;
    postId: number;
}): Promise<PostImage> => {
    const res = await api.post<PostImage>('/postimages', data);
    return res.data;
};


export const getCommentsByPost = async (postId: number | string): Promise<ApiComment[]> => {
    const res = await api.get<ApiComment[]>(`/comments/post/${postId}`);
    return res.data;
};

export const createComment = async (data: {
    content: string;
    userId: number;
    postId: number;
}): Promise<ApiComment> => {
    const res = await api.post<ApiComment>('/comments', data);
    return res.data;
};


export const getTags = async (): Promise<Tag[]> => {
    const res = await api.get<Tag[]>('/tags');
    return res.data;
};


export const getUsers = async (): Promise<User[]> => {
    const res = await api.get<User[]>('/users');
    return res.data;
};

export const getUserById = async (id: number | string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
};

export const createUser = async (data: {
    nickName: string;
    email: string;
}): Promise<User> => {
    const res = await api.post<User>('/users', data);
    return res.data;
};

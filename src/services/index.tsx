import { request } from '@umijs/max';

// 创建 axios 实例
// const api = request.create({
//   baseURL: '/api',
//   timeout: 10000, // 10秒超时
//   headers: {
//     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//   },
// });

// 用户相关接口类型定义
export interface CreateUserDto {
  username: string;
  password: string;
  // 其他创建用户需要的字段
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  // 其他可更新的字段
}

export interface User {
  id: number;
  username: string;
  // 其他用户信息字段
}

// 用户列表分页参数
export interface UserPageParams {
  page: number;
  limit: number;
}

// 用户列表响应
export interface UserPageResponse {
  items: User[];
  total: number;
}

// API 函数
export const getUserList = async (params: UserPageParams, options?: { [key: string]: any }) => {
  return request<UserPageResponse>('/user/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const createUser = async (data: CreateUserDto, options?: { [key: string]: any }) => {
  return request<User>('/user', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const login = async (data: LoginUserDto, options?: { [key: string]: any }) => {
  return request<User>('/auth/login', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const logout = async (options?: { [key: string]: any }) => {
  return request('/auth/logout', {
    method: 'GET',
    ...(options || {}),
  });
};

export const getProfile = async (options?: { [key: string]: any }) => {
  return request<User>('/auth/profile', {
    method: 'GET',
    ...(options || {}),
  });
};

export const getAllUsers = async (options?: { [key: string]: any }) => {
  return request<User[]>('/user', {
    method: 'GET',
    ...(options || {}),
  });
};

export const getUserById = async (id: number, options?: { [key: string]: any }) => {
  return request<User>(`/user/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
};

export const updateUser = async (id: number, data: UpdateUserDto, options?: { [key: string]: any }) => {
  return request<User>(`/user/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
};

export const deleteUser = async (id: number, options?: { [key: string]: any }) => {
  return request(`/user/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
};
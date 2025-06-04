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
  account: string;
  password: string;
}

export interface LoginUserDto {
  account: string;
  password: string;
}

export interface UpdateUserDto {
  id: number;
  account?: string;
  password?: string;
}

export interface User {
  id: number;
  account: string;
  // 其他用户信息字段
}

// 用户列表分页参数
export interface UserPageParams {
  page?: number;
  limit?: number;
}

// 用户列表响应
export interface UserPageResponse {
  items: User[];
  total: number;
}

// 客户相关接口类型定义
export interface CreateCustomerDto {
  name: string;
  phone: string;
  shop?: string;
  detail?: string;
  remark?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  id: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  shop?: string;
  detail?: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

// 客户列表分页参数
export interface CustomerPageParams {
  page?: number;
  limit?: number;
}

// 客户列表响应
export interface CustomerPageResponse {
  items: Customer[];
  total: number;
}

// 跟进记录相关接口类型定义
export interface CreateFollowUpDto {
  customerId: number;
  content: string;
  type: number;
}

export interface UpdateFollowUpDto extends Partial<CreateFollowUpDto> {
  id: number;
}

export interface FollowUp {
  id: number;
  customerId: number;
  content: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}

// API 函数
// 用户相关接口
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

// 客户相关接口
export const getCustomerList = async (params: CustomerPageParams, options?: { [key: string]: any }) => {
  return request<CustomerPageResponse>('/customer/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const createCustomer = async (data: CreateCustomerDto, options?: { [key: string]: any }) => {
  return request<Customer>('/customer', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const getAllCustomers = async (options?: { [key: string]: any }) => {
  return request<Customer[]>('/customer', {
    method: 'GET',
    ...(options || {}),
  });
};

export const getCustomerById = async (id: number, options?: { [key: string]: any }) => {
  return request<Customer>(`/customer/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
};

export const getCustomerByUserId = async (userId: string, options?: { [key: string]: any }) => {
  return request<Customer>(`/customer/userid/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
};

export const updateCustomer = async (id: number, data: UpdateCustomerDto, options?: { [key: string]: any }) => {
  return request<Customer>(`/customer/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
};

export const deleteCustomer = async (id: number, options?: { [key: string]: any }) => {
  return request(`/customer/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
};

// 跟进记录相关接口
export const createFollowUp = async (data: CreateFollowUpDto, options?: { [key: string]: any }) => {
  return request<FollowUp>('/follow-up', {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const getAllFollowUps = async (options?: { [key: string]: any }) => {
  return request<FollowUp[]>('/follow-up', {
    method: 'GET',
    ...(options || {}),
  });
};

export const getFollowUpList = async (params: UserPageParams, options?: { [key: string]: any }) => {
  return request<UserPageResponse>('/follow-up/page', {
    method: 'GET',
    params,
    ...(options || {}),
  });
};

export const getFollowUpById = async (id: number, options?: { [key: string]: any }) => {
  return request<FollowUp>(`/follow-up/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
};

export const getFollowUpsByCustomerId = async (customerId: number, type?: number, options?: { [key: string]: any }) => {
  return request<FollowUp[]>(`/follow-up/customer/${customerId}`, {
    method: 'GET',
    params: { type },
    ...(options || {}),
  });
};

export const updateFollowUp = async (id: number, data: UpdateFollowUpDto, options?: { [key: string]: any }) => {
  return request<FollowUp>(`/follow-up/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
};

export const deleteFollowUp = async (id: number, options?: { [key: string]: any }) => {
  return request(`/follow-up/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
};





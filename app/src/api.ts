import axios from 'axios';
import { Room, Category, Order } from './types';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getRooms = async (): Promise<Room[]> => {
  return (await api.get('/rooms')).data;
};

export const getRoomById = async (id: number): Promise<Room | undefined> => {
  return (await api.get(`/rooms/${id}`)).data;
};

export const createRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  return (await api.post('/rooms', room)).data;
};

export const updateRoom = async (id: number, room: Partial<Room>): Promise<Room> => {
  return (await api.put(`/rooms/${id}`, room)).data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};

export const getProducts = async (): Promise<any[]> => {
  return (await api.get('/menuitems')).data;
};

export const getProductById = async (id: number): Promise<any | undefined> => {
  return (await api.get(`/menuitems/${id}`)).data;
};

export const createProduct = async (menuItem: Omit<any, 'id'>): Promise<any> => {
  return (await api.post('/menuitems', menuItem)).data;
};

export const updateProduct = async (id: number, menuItem: Partial<any>): Promise<any> => {
  return (await api.put(`/menuitems/${id}`, menuItem)).data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/menuitems/${id}`);
};

export const getCategories = async (): Promise<Category[]> => {
  return (await api.get('/categories')).data;
};

export const createCategory = async (category: Omit<Category, 'category_id'>): Promise<Category> => {
  return (await api.post('/categories', category)).data;
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  return (await api.put(`/categories/${id}`, category)).data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const getOrders = async (): Promise<Order[]> => {
  return (await api.get('/orders')).data;
};

export const getOrderById = async (id: number): Promise<Order | undefined> => {
  return (await api.get(`/orders/${id}`)).data;
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  return (await api.put(`/orders/${id}/status`, { status })).data;
};

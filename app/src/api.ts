import axios from 'axios';
import { Room, Category, Order } from './types';
export const HOST_URL = "http://localhost:8000";
const BASE_URL_API = '/api';

const api = axios.create({
  baseURL: HOST_URL + BASE_URL_API,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export const getRooms = async (): Promise<Room[]> => {
  return (await api.get('/rooms')).data;
};

export const getRoomById = async (id: number): Promise<Room | undefined> => {
  return (await api.get(`/rooms/${id}`)).data;
};

export const createRoom = async (
  room: Omit<Room, 'id'> | FormData,
  config?: { headers?: { 'Content-Type': string } }
): Promise<Room> => {
  return (await api.post('/rooms', room, config)).data;
};

export const updateRoom = async (
  id: number,
  room: Partial<Room> | FormData,
  config?: { headers?: { 'Content-Type': string } }
): Promise<Room> => {
  let data: Partial<Room> | FormData = room;

  if (room instanceof FormData || (room.preview_img instanceof File) || (Array.isArray(room.gallery) && room.gallery.some(item => item instanceof File))) {
    const formData = room instanceof FormData ? room : new FormData();
    if (!(room instanceof FormData)) {
      for (const key in room) {
        if (Object.prototype.hasOwnProperty.call(room, key)) {
          if (key === 'preview_img' && room.preview_img instanceof File) {
            formData.append('preview_img', room.preview_img);
          } else if (key === 'gallery' && Array.isArray(room.gallery)) {
            room.gallery.forEach((file, index) => {
              if (file instanceof File) {
                formData.append(`gallery[${index}]`, file);
              } else if (typeof file === 'string') {
                formData.append(`gallery_urls[]`, file); // Отправляем существующие URL
              }
            });
          } else if (key !== 'preview_img' && key !== 'gallery') {
            formData.append(key, (room as any)[key]);
          }
        }
      }
    }
    data = formData;
    if (!config) {
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    } else if (!config.headers) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
  }
  return (await api.post(`/rooms/${id}`, data, config)).data;
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
  const config: { headers?: { 'Content-Type': string } } = {};
  let data: Omit<any, 'id'> | FormData = menuItem;

  if (menuItem.image_url instanceof File) {
    const formData = new FormData();
    for (const key in menuItem) {
      if (Object.prototype.hasOwnProperty.call(menuItem, key)) {
        formData.append(key, (menuItem as any)[key]);
      }
    }
    data = formData;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  return (await api.post('/menuitems', data, config)).data;
};

export const updateProduct = async (
  id: number,
  menuItem: Partial<any>,
  config?: { headers?: { 'Content-Type': string } }
): Promise<any> => {
  let data: Partial<any> | FormData = menuItem;

  if (menuItem.image_url instanceof File) {
    const formData = new FormData();
    for (const key in menuItem) {
      if (Object.prototype.hasOwnProperty.call(menuItem, key)) {
        formData.append(key, (menuItem as any)[key]);
      }
    }
    data = formData;
    if (!config) {
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    } else if (!config.headers) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
  }
  return (await api.post(`/menuitems/${id}`, data, config)).data;
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

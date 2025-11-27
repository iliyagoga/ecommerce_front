import axios from 'axios';
import { Room, Category, Order, HallNew, HallRoomNew, CartRoom, CartProduct } from './types';
export const HOST_URL = "http://localhost:8000";
const BASE_URL_API = '/api';

const api = axios.create({
  baseURL: HOST_URL + BASE_URL_API,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
export const registerUser = async (userData: any): Promise<any> => {
  const response =await api.post('/register', userData);
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const loginUser = async (credentials: any): Promise<any> => {
  const response = await api.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
};

export const getAuthUser = async (): Promise<any> => {
  return (await api.get('/user')).data;
};

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
                formData.append(`gallery_urls[]`, file);
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

export const getProductsByCategory = async (categoryId?: string): Promise<any> => {
  const url = categoryId ? `/menuitems/category/${categoryId}` : '/menuitems';
  return (await api.get(url)).data;
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

export const getOrderById = async (id: number): Promise<Order> => {
  return (await api.get(`/orders/${id}`)).data;
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  return (await api.post(`/orders/${id}/status`, { status })).data;
};

export const createOrder = async (orderData: any) => {
  return (await api.post('/orders', orderData));
};

export const getHallsNew = async (): Promise<HallNew[]> => {
  return (await api.get('/halls_new')).data;
};

export const getHallNewById = async (id: number): Promise<HallNew | undefined> => {
  return (await api.get(`/halls_new/${id}`)).data;
};

export const createHallNew = async (hall: Omit<HallNew, 'id' | 'hall_rooms_new_count'>): Promise<HallNew> => {
  return (await api.post('/halls_new', hall)).data;
};

export const updateHallNew = async (id: number, hall: Partial<HallNew>): Promise<HallNew> => {
  return (await api.put(`/halls_new/${id}`, hall)).data;
};

export const deleteHallNew = async (id: number): Promise<void> => {
  await api.delete(`/halls_new/${id}`);
};

// API functions for Orders
// export const getOrderById = async (id: number): Promise<Order> => {
//   return (await api.get(`/orders/${id}`)).data;
// };

// API functions for HallRoomsNew
export const getHallRoomsNew = async (hallId: number): Promise<HallRoomNew[]> => {
  return (await api.get(`/halls_new/${hallId}/hall_rooms_new`)).data;
};

export const createHallRoomNew = async (hallId: number, room: Omit<HallRoomNew, 'id' | 'hall_id'>): Promise<HallRoomNew> => {
  room.metadata = JSON.stringify(room.metadata);
  console.log(room)
  return (await api.post(`/halls_new/${hallId}/hall_rooms_new`, room)).data;
};

export const updateHallRoomNew = async (hallId: number, roomId: number, room: Partial<HallRoomNew>): Promise<HallRoomNew> => {
  room.metadata = JSON.stringify(room.metadata);
  return (await api.put(`/halls_new/${hallId}/hall_rooms_new/${roomId}`, room)).data;
};

export const deleteHallRoomNew = async (hallId: number, roomId: number): Promise<void> => {
  await api.delete(`/halls_new/${hallId}/hall_rooms_new/${roomId}`);
};

export const getHallRoomsAvailability = async (hallId: number, startDate: string, endDate: string): Promise<HallRoomNew[]> => {
  return (await api.get(`/halls_new/${hallId}/hall_rooms_availability`, {
    params: { booked_time_start: startDate, booked_time_end: endDate }
  })).data;
};

// Cart API functions
export const getCart = async (): Promise<any> => {
  return (await api.get('/cart')).data;
};

export const addRoomToCart = async (roomData: Omit<CartRoom, "cart_id">): Promise<any> => {
  return (await api.post('/cart/room', roomData)).data;
};

export const addMenuItemToCart = async (roomData: Omit<CartProduct, "cart_id">): Promise<any> => {
  return (await api.post('/cart/menu-item', roomData)).data;
};

export const updateCartRoom = async (cartRoomId: number, roomData: any): Promise<any> => {
  return (await api.put(`/cart/room/${cartRoomId}`, roomData)).data;
};

export const removeCartRoom = async (cartRoomId: number): Promise<void> => {
  await api.delete(`/cart/room/${cartRoomId}`);
};

export const removeCartMenuItem = async (cartMenuItemId: number): Promise<void> => {
  await api.delete(`/cart/menu-item/${cartMenuItemId}`);
};

export const updateCartMenuItem = async (cartMenuItemId: number, quantity: number): Promise<any> => {
  return (await api.put(`/cart/menu-item/${cartMenuItemId}`, {quantity})).data;
};

export const clearUserCart = async (): Promise<void> => {
  await api.delete('/cart/clear');
};

export const checkRoomType = async (): Promise<boolean> => {
  return (await api.get('/cart/check-room-type')).data;
};

export const getOrdersByUser = async (): Promise<any> => {
  return (await api.get('/orders-user')).data;
}

export const getCurrentUser = async (): Promise<any> => {
  return (await api.get('/user')).data;
}

export const createReview = async (orderId: number, comment: string): Promise<any> => {
  await api.post('/reviews', {order_id: orderId, review: comment});
}

export const getReviews = async (): Promise<any> => {
  return (await api.get('/reviews')).data;
}

export const getReviewsByCount = async (count?: number): Promise<any> => {
  return (await api.get(`/reviews/${count ?? 10}`)).data;
};

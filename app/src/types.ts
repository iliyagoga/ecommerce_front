export interface RoomImage {
  img_id?: number;
  url: string;
}

export interface Room {
  room_id?: number;
  base_hourly_rate: number;
  initial_fee?: number;
  description?: string;
  max_people: number;
  name: string;
  preview_img?: string;
  gallery?: RoomImage[];
  type?: 'standard' | 'vip' | 'cinema'; // Добавлено для создания комнаты
  is_available?: boolean; // Добавлено для админ-панели
}

export interface Product {
  item_id?: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: number; // Для создания товара
  is_available?: boolean; // Добавлено для админ-панели
}

export interface Category {
  category_id: number;
  name: string;
  products?: Product[]; // Для получения товаров по категориям
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface OrderRoom {
  order_room_id?: number;
  order_id: number;
  room_id: number;
  booked_hours: number;
  booked_date: string;
  booked_time_start: string;
  booked_time_end: string;
  room_price_per_hour: number;
  type?: 'standard' | 'vip' | 'cinema'; // Добавлено для отображения в сайдбаре
  base_hourly_rate?: number; // Добавлено для отображения в сайдбаре
}

export interface Order {
  order_id?: number;
  user_id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'active';
  total_price: string;
  client_comment?: string;
  admin_comment?: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
  order_rooms?: OrderRoom[]; // Добавляем отношение orderRooms
  user?: User; // Добавляем отношение user
}

export interface HallNew {
  id?: number;
  name: string;
  width: number;
  height: number;
  svg_background?: string;
  hall_rooms_new_count?: number; // Added for hall list view
}

export interface HallRoomNew {
  id?: number;
  hall_id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  metadata?: any;
  room_id?: number | null; // Allow null for room_id
  is_available_for_booking?: boolean; // New field for booking availability
}

export interface CartRoom {
  id?: number;
  cart_id: number;
  room_id: number;
  booked_hours: number;
  booked_date: string;
  booked_time_start: string;
  booked_time_end: string;
  room_price_per_hour: number;
  created_at?: string;
  updated_at?: string;
  room?: Room; // Добавляем отношение room для фронтенда
}

export interface Cart {
  id?: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  cart_rooms?: CartRoom[];
  user?: User;
}

// types/loading.ts
export interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export interface SkeletonLoadingProps {
  count?: number;
  width?: string;
  height?: string;
  fullScreen?: boolean;
}

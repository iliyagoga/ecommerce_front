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
  id?: number;
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

export interface Order {
  id?: number;
  client_name: string;
  client_phone: string;
  room_id: number;
  products: { productId: number; quantity: number }[];
  comments?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  order_date: string; // Пример
  start_time: string; // Пример
  end_time: string; // Пример
}

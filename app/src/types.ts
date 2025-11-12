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
  type?: 'standard' | 'vip' | 'cinema';
  is_available?: boolean;
}

export interface Product {
  item_id?: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: number;
  is_available?: boolean;
}

export interface Category {
  category_id: number;
  name: string;
  products?: Product[];
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
  type?: 'standard' | 'vip' | 'cinema';
  base_hourly_rate?: number;
  room?: Room;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  created_at: string;
  updated_at: string;
  menu_item?: Product;
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
  order_rooms?: OrderRoom[];
  order_items?: OrderItem[];
  user?: User;
}

export interface HallNew {
  id?: number;
  name: string;
  width: number;
  height: number;
  svg_background?: string;
  hall_rooms_new_count?: number;
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
  room_id?: number | null;
  is_available_for_booking?: boolean;
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
  room?: Room;
}

export interface CartProduct {
  cart_item_id?: number;
  cart_id: number;
  item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
  updated_at?: string;
  menu_item?: Product; 
}

export interface Cart {
  id?: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  cart_rooms?: CartRoom[];
  cart_menu_items?: CartProduct[];
  user?: User;
}

import axios from 'axios';
import { Room, Product, Category, Order, RoomImage } from './types';

const BASE_URL = 'YOUR_MOCK_SERVER_URL'; // ЗАМЕНИТЬ НА РЕАЛЬНЫЙ URL МОК-СЕРВЕРА

const api = axios.create({
  baseURL: BASE_URL,
});

// --- Rooms API ---
export const getRooms = async (): Promise<Room[]> => {
  // return (await api.get('/rooms')).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          type_id: 1,
          base_hourly_rate: 150,
          initial_fee: 0,
          description: 'Уютная обычная комната с диванами, телевизором, PS5 и настольными играми.',
          max_people: 4,
          amenities: ['PS5', 'Настолки', 'Телевизор', 'Диваны'],
          name: 'Обычная 1',
          preview_img: 'https://via.placeholder.com/150',
          gallery: [
            { img_id: 1, url: 'https://via.placeholder.com/600/1' },
            { img_id: 2, url: 'https://via.placeholder.com/600/2' },
          ],
          available: true,
          type: 'обычная'
        },
        {
          type_id: 2,
          base_hourly_rate: 400,
          initial_fee: 2000,
          description: 'VIP комната для 5 человек с расширенным набором игр, VR и комфортными диванами.',
          max_people: 5,
          amenities: ['PS5 (много игр)', 'VR', 'Большой телевизор', 'Комфортные диваны с пледами'],
          name: 'VIP 1',
          preview_img: 'https://via.placeholder.com/150',
          gallery: [
            { img_id: 3, url: 'https://via.placeholder.com/600/3' },
            { img_id: 4, url: 'https://via.placeholder.com/600/4' },
          ],
          available: true,
          type: 'вип'
        },
        {
          type_id: 3,
          base_hourly_rate: 600,
          initial_fee: 4000,
          description: 'Кинотеатр с огромным экраном, всеми онлайн кинотеатрами и личным туалетом.',
          max_people: 8,
          amenities: ['Киноэкран', 'Проектор', 'Все онлайн кинотеатры', 'Личный туалет', 'Отдельный стол с PS'],
          name: 'Кинотеатр 1',
          preview_img: 'https://via.placeholder.com/150',
          gallery: [
            { img_id: 5, url: 'https://via.placeholder.com/600/5' },
            { img_id: 6, url: 'https://via.placeholder.com/600/6' },
          ],
          available: false,
          type: 'кино'
        },
      ]);
    }, 500);
  });
};

export const getRoomById = async (id: number): Promise<Room | undefined> => {
  // return (await api.get(`/rooms/${id}`)).data;
  const rooms = await getRooms(); // Имитация получения из мока
  return rooms.find(room => room.type_id === id);
};

export const createRoom = async (room: Omit<Room, 'type_id'>): Promise<Room> => {
  // return (await api.post('/rooms', room)).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRoom: Room = { ...room, type_id: Math.floor(Math.random() * 1000) + 100 };
      resolve(newRoom);
    }, 500);
  });
};

export const updateRoom = async (id: number, room: Partial<Room>): Promise<Room> => {
  // return (await api.put(`/rooms/${id}`, room)).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...room as Room, type_id: id });
    }, 500);
  });
};

export const deleteRoom = async (id: number): Promise<void> => {
  // await api.delete(`/rooms/${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Комната с ID ${id} удалена (имитация)`);
      resolve();
    }, 500);
  });
};

// --- Products API ---
export const getProducts = async (): Promise<Product[]> => {
  // return (await api.get('/products')).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Кальян Al Fakher',
          description: 'Классический кальян с табаком Al Fakher.',
          price: 800,
          image_url: 'https://via.placeholder.com/150',
          category_id: 4,
          available: true,
        },
        {
          id: 2,
          name: 'Чайник чая (черный)',
          description: 'Ароматный черный чай.',
          price: 250,
          image_url: 'https://via.placeholder.com/150',
          category_id: 1,
          available: true,
        },
        {
          id: 3,
          name: 'Чипсы Lays',
          description: 'Большая пачка чипсов Lays.',
          price: 150,
          image_url: 'https://via.placeholder.com/150',
          category_id: 2,
          available: false,
        },
      ]);
    }, 500);
  });
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  // return (await api.get(`/products/${id}`)).data;
  const products = await getProducts();
  return products.find(product => product.id === id);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  // return (await api.post('/products', product)).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = { ...product, id: Math.floor(Math.random() * 1000) + 100 };
      resolve(newProduct);
    }, 500);
  });
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  // return (await api.put(`/products/${id}`, product)).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...product as Product, id: id });
    }, 500);
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  // await api.delete(`/products/${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Товар с ID ${id} удален (имитация)`);
      resolve();
    }, 500);
  });
};

// --- Categories API ---
export const getCategories = async (): Promise<Category[]> => {
  // return (await api.get('/categories')).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Напитки', products: [] },
        { id: 2, name: 'Снеки', products: [] },
        { id: 3, name: 'Основные блюда', products: [] },
        { id: 4, name: 'Кальяны', products: [] },
      ]);
    }, 500);
  });
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  // return (await api.post('/categories', category)).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCategory: Category = { ...category, id: Math.floor(Math.random() * 1000) + 100 };
      resolve(newCategory);
    }, 500);
  });
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  // return (await api.put(`/categories/${id}`, category)).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...category as Category, id: id });
    }, 500);
  });
};

export const deleteCategory = async (id: number): Promise<void> => {
  // await api.delete(`/categories/${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Категория с ID ${id} удалена (имитация)`);
      resolve();
    }, 500);
  });
};

// --- Orders API ---
export const getOrders = async (): Promise<Order[]> => {
  // return (await api.get('/orders')).data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          client_name: 'Иван Иванов',
          client_phone: '89123456789',
          room_id: 1,
          products: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }],
          comments: 'Пожелания: побольше льда.',
          status: 'pending',
          order_date: '2025-10-21',
          start_time: '18:00',
          end_time: '20:00',
        },
        {
          id: 2,
          client_name: 'Мария Петрова',
          client_phone: '89001112233',
          room_id: 2,
          products: [{ productId: 3, quantity: 1 }],
          comments: 'Заказ на ДР, нужна свечка.',
          status: 'confirmed',
          order_date: '2025-10-22',
          start_time: '19:00',
          end_time: '22:00',
        },
      ]);
    }, 500);
  });
};

export const getOrderById = async (id: number): Promise<Order | undefined> => {
  // return (await api.get(`/orders/${id}`)).data;
  const orders = await getOrders();
  return orders.find(order => order.id === id);
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  // return (await api.put(`/orders/${id}/status`, { status })).data;
  const orders = await getOrders();
  const order = orders.find(o => o.id === id);
  if (order) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...order, status });
      }, 500);
    });
  }
  throw new Error('Order not found');
};

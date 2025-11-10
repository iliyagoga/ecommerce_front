import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
/*import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CommentIcon from '@mui/icons-material/Comment';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
*/
import {
  Order,
  Product,
  OrderRoom
} from '@/types';
import {
  getRoomById,
  getProducts,
  getOrderById
} from '@/api';

interface OrderViewSidebarProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderViewSidebar: React.FC<OrderViewSidebarProps> = ({ open, onClose, order }) => {
  const [orderRoom, setOrderRoom] = useState<OrderRoom | null>(null); // Теперь orderRoom
  const [roomName, setRoomName] = useState<string | null>(null); // Для хранения названия комнаты
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null); // Новое состояние для полных деталей заказа

  useEffect(() => {
    const fetchData = async () => {
      if (!order || !order.order_id) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedOrder = await getOrderById(order.order_id);
        setOrderDetails(fetchedOrder || null);
        console.log(fetchedOrder)
        if (fetchedOrder && fetchedOrder.order_rooms && fetchedOrder.order_rooms.length > 0) {
          const roomData = fetchedOrder.order_rooms[0]; // Получаем данные orderRoom
          console.log(roomData)
          setOrderRoom(roomData);

          // Делаем отдельный запрос для получения названия комнаты
          if (roomData.room_id) {
            const fetchedRoomDetails = await getRoomById(roomData.room_id);
            setRoomName(fetchedRoomDetails?.name || null);
          }
        } else {
          setOrderRoom(null);
          setRoomName(null);
        }

        const allProducts = await getProducts();
        const productsMap = new Map<number, Product>();
        allProducts.forEach(p => p.id && productsMap.set(p.id, p));
        setProductsMap(productsMap);
      } catch (err) {
        setError('Не удалось загрузить данные заказа.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [order]);

  if (!order) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 400,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 400,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Детали Заказа: #{order.order_id}</Typography>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          X
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#444' }} />
      <Box sx={{ p: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {!loading && !error && orderDetails && ( // Добавляем orderDetails в условие рендеринга
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Клиент: ${orderDetails.user?.name || 'N/A'}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Email: ${orderDetails.user?.email || 'N/A'}`} />
            </ListItem>
            {orderDetails.client_comment && (
              <ListItem>
                <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
                <ListItemText primary={`Комментарий клиента: ${orderDetails.client_comment}`} />
              </ListItem>
            )}

            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Общая цена: ${orderDetails.total_price}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Статус: ${orderDetails.status}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText
                primary={`Время начала: ${
                  orderDetails.start_time
                    ? new Date(orderDetails.start_time).toLocaleString('ru-RU')
                    : '-'
                }`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText
                primary={`Время окончания: ${
                  orderDetails.end_time
                    ? new Date(orderDetails.end_time).toLocaleString('ru-RU')
                    : '-'
                }`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText
                primary={`Забронировано часов: ${
                  (() => {
                    if (!orderDetails.start_time || !orderDetails.end_time) return '-';

                    const start = new Date(orderDetails.start_time);
                    const end = new Date(orderDetails.end_time);

                    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';

                    const diffMs = end.getTime() - start.getTime();
                    const diffHrs = diffMs / (1000 * 60 * 60);
                    return diffHrs > 0 ? diffHrs.toFixed(2) : '0';
                  })()
                } ч.`}
              />
            </ListItem>

            <Divider sx={{ my: 2, borderColor: '#444' }} />

            <Typography variant="subtitle1" gutterBottom>Комната:</Typography>

            {orderRoom ? (
              <ListItem>
                <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
                <ListItemText primary={`${roomName || 'N/A'}`} secondary={`Цена за час: ${orderRoom.room_price_per_hour} руб.`} />
              </ListItem>
            ) : (orderDetails && orderDetails.order_rooms && orderDetails.order_rooms.length === 0 ? (
              <ListItem>
                <ListItemText primary="Комната не найдена" />
              </ListItem>
            ) : null)}

            <Divider sx={{ my: 2, borderColor: '#444' }} />
  
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default OrderViewSidebar;

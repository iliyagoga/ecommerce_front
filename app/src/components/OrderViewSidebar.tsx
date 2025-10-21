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
  Room
} from '../types';
import {
  getRoomById,
  getProducts
} from '../api';

interface OrderViewSidebarProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderViewSidebar: React.FC<OrderViewSidebarProps> = ({ open, onClose, order }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!order) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedRoom = await getRoomById(order.room_id);
        setRoom(fetchedRoom || null);

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
        <Typography variant="h6">Детали Заказа: #{order.id}</Typography>
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
        {!loading && !error && (
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Клиент: ${order.client_name}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Телефон: ${order.client_phone}`} />
            </ListItem>
            {order.comments && (
              <ListItem>
                <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
                <ListItemText primary={`Комментарий: ${order.comments}`} />
              </ListItem>
            )}
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Статус: ${order.status}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Дата: ${order.order_date}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Время: ${order.start_time} - ${order.end_time}`} />
            </ListItem>

            <Divider sx={{ my: 2, borderColor: '#444' }} />

            <Typography variant="subtitle1" gutterBottom>Комната:</Typography>
            {room ? (
              <ListItem>
                <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
                <ListItemText primary={`${room.name} (${room.type})`} secondary={`Цена за час: ${room.base_hourly_rate} руб.`} />
              </ListItem>
            ) : (
              <ListItem>
                <ListItemText primary="Комната не найдена" />
              </ListItem>
            )}

            <Divider sx={{ my: 2, borderColor: '#444' }} />

            <Typography variant="subtitle1" gutterBottom>Заказанные товары:</Typography>
            <List disablePadding>
              {order.products.map((item, index) => {
                const productDetail = productsMap.get(item.productId);
                return (
                  <ListItem key={index} sx={{ pl: 4 }}>
                    <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
                    <ListItemText
                      primary={`${productDetail ? productDetail.name : `Товар #${item.productId}`} x ${item.quantity}`}
                      secondary={productDetail ? `Цена: ${productDetail.price * item.quantity} руб.` : ''}
                    />
                  </ListItem>
                );
              })}
            </List>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default OrderViewSidebar;

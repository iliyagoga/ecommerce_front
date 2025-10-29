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
  getProducts,
  getOrderById
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
  const [fullOrder, setFullOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!order || !order.order_id) return;
        const full = await getOrderById(order?.order_id);
        console.log(full)
      } catch (error) {
        
      }
    }
    fetchOrder()
  },[])
  useEffect(() => {
    const fetchData = async () => {
      if (!order || !order.order_id) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedRoom = await getRoomById(order.order_id);
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
        {!loading && !error && (
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Клиент: ${order.client_name}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Телефон: ${order.client_email}`} />
            </ListItem>
            {order.client_comment && (
              <ListItem>
                <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
                <ListItemText primary={`Комментарий: ${order.client_comment}`} />
              </ListItem>
            )}

            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Итоговая цена: ${order.total_price}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Статус: ${order.status}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText
                primary={`Дата начала: ${
                  order.start_time
                    ? new Date(order.start_time).toLocaleDateString('ru-RU')
                    : '-'
                }`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText
                primary={`Дата окончания: ${
                  order.end_time
                    ? new Date(order.end_time).toLocaleDateString('ru-RU')
                    : '-'
                }`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText
                primary={`Общее количество часов: ${
                  (() => {
                    if (!order.start_time || !order.end_time) return '-';
                    // Ensure both are in ISO format
                    const start = new Date(order.start_time);
                    const end = new Date(order.end_time);

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
  
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default OrderViewSidebar;

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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
  OrderRoom,
  OrderItem
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
  const [orderRoom, setOrderRoom] = useState<OrderRoom | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!order || !order.order_id) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedOrder = await getOrderById(order.order_id);
        setOrderDetails(fetchedOrder || null);
        console.log('Fetched order:', fetchedOrder);

        // Обработка комнат
        if (fetchedOrder && fetchedOrder.order_rooms && fetchedOrder.order_rooms.length > 0) {
          const roomData = fetchedOrder.order_rooms[0];
          console.log('Room data:', roomData);
          setOrderRoom(roomData);

          if (roomData.room_id) {
            const fetchedRoomDetails = await getRoomById(roomData.room_id);
            setRoomName(fetchedRoomDetails?.name || null);
          }
        } else {
          setOrderRoom(null);
          setRoomName(null);
        }

        // Обработка товаров
        if (fetchedOrder && fetchedOrder.order_items) {
          setOrderItems(fetchedOrder.order_items);
          console.log('Order items:', fetchedOrder.order_items);
        } else {
          setOrderItems([]);
        }

        const allProducts = await getProducts();
        const productsMap = new Map<number, Product>();
        allProducts.forEach(p => p.item_id && productsMap.set(p.item_id, p));
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

  const calculateItemsTotal = () => {
    return orderItems.reduce((total, item) => total + Number(item.total_price), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (!order) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 500,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 500,
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
      
      <Box sx={{ p: 2, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {!loading && !error && orderDetails && (
          <List dense>
            {/* Информация о клиенте */}
            <ListItem>
              <ListItemText 
                primary="Информация о клиенте" 
                primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary={`Имя: ${orderDetails.user?.name || 'N/A'}`}
                secondary={`Email: ${orderDetails.user?.email || 'N/A'}`}
              />
            </ListItem>

            <ListItem>
              <ListItemText 
                primary="Основная информация" 
                primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E', mt: 2 }}
              />
            </ListItem>

            <ListItem>
              <ListItemText 
                primary={`Статус:`}
                style={{width: "min-content", flex: "none", marginRight: "15px" }}
                primaryTypographyProps={{width: "max-content"}}
                
              />
                 <Chip 
                    label={orderDetails.status} 
                    color={getStatusColor(orderDetails.status) as any}
                    size="small"/>
            </ListItem>

            <ListItem>
              <ListItemText 
                primary={`Общая цена: ${parseFloat(orderDetails.total_price).toFixed(2)} руб.`}
              />
            </ListItem>

            <ListItem>
              <ListItemText 
                primary="Время бронирования" 
                primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E', mt: 2 }}
              />
            </ListItem>

            <ListItem>
              <ListItemText 
                primary={`Начало: ${new Date(orderDetails.start_time).toLocaleString('ru-RU')}`}
              />
            </ListItem>

            <ListItem>
              <ListItemText 
                primary={`Окончание: ${new Date(orderDetails.end_time).toLocaleString('ru-RU')}`}
              />
            </ListItem>

            <ListItem>
              <ListItemText 
                primary={`Продолжительность: ${(
                  (new Date(orderDetails.end_time).getTime() - new Date(orderDetails.start_time).getTime()) / 
                  (1000 * 60 * 60)
                ).toFixed(1)} часов`}
              />
            </ListItem>

            {/* Комментарии */}
            {(orderDetails.client_comment || orderDetails.admin_comment) && (
              <>
                <ListItem>
                  <ListItemText 
                    primary="Комментарии" 
                    primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E', mt: 2 }}
                  />
                </ListItem>
                
                {orderDetails.client_comment && (
                  <ListItem>
                    <ListItemText 
                      primary="Комментарий клиента:"
                      secondary={orderDetails.client_comment}
                    />
                  </ListItem>
                )}
                
                {orderDetails.admin_comment && (
                  <ListItem>
                    <ListItemText 
                      primary="Комментарий администратора:"
                      secondary={orderDetails.admin_comment}
                    />
                  </ListItem>
                )}
              </>
            )}

            <Divider sx={{ my: 2, borderColor: '#444' }} />

            {/* Информация о комнате */}
            <ListItem>
              <ListItemText 
                primary="Забронированная комната" 
                primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E' }}
              />
            </ListItem>

            {orderRoom ? (
              <>
                <ListItem>
                  <ListItemText 
                    primary={`Комната: ${roomName || 'N/A'}`}
                    secondary={`ID комнаты: ${orderRoom.room_id}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={`Дата бронирования: ${new Date(orderRoom.booked_date).toLocaleDateString('ru-RU')}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={`Время начала: ${orderRoom.booked_time_start ? new Date(orderRoom.booked_time_start).toLocaleTimeString('ru-RU') : 'N/A'}`}
                    secondary={`Время окончания: ${orderRoom.booked_time_end ? new Date(orderRoom.booked_time_end).toLocaleTimeString('ru-RU') : 'N/A'}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={`Забронировано часов: ${orderRoom.booked_hours}`}
                    secondary={`Цена за час: ${Number(orderRoom.room_price_per_hour).toFixed(2)} руб.`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={`Стоимость комнаты: ${(orderRoom.booked_hours * Number(orderRoom.room_price_per_hour)).toFixed(2)} руб.`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              </>
            ) : (
              <ListItem>
                <ListItemText primary="Комната не найдена" />
              </ListItem>
            )}

            <Divider sx={{ my: 2, borderColor: '#444' }} />

            {/* Товары в заказе */}
            <ListItem>
              <ListItemText 
                primary="Товары в заказе" 
                primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E' }}
              />
            </ListItem>

            {orderItems.length > 0 ? (
              <>
                <TableContainer component={Paper} sx={{ backgroundColor: '#2a2a2a', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Товар</TableCell>
                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Кол-во</TableCell>
                        <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Цена</TableCell>
                        <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 'bold' }}>Сумма</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item, index) => {
                        const product = productsMap.get(item.item_id);
                        return (
                          <TableRow key={item.order_item_id || index}>
                            <TableCell sx={{ color: '#ffffff' }}>
                              {product?.name || `Товар #${item.item_id}`}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff' }}>
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#ffffff' }}>
                              {Number(item.unit_price).toFixed(2)} руб.
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                              {Number(item.total_price).toFixed(2)} руб.
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <ListItem>
                  <ListItemText 
                    primary={`Общая стоимость товаров: ${calculateItemsTotal().toFixed(2)} руб.`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              </>
            ) : (
              <ListItem>
                <ListItemText primary="Товары не добавлены" />
              </ListItem>
            )}

            {/* Итоговая сводка */}
            <Divider sx={{ my: 2, borderColor: '#444' }} />
            
            <ListItem>
              <ListItemText 
                primary="Итоговая сводка" 
                primaryTypographyProps={{ fontWeight: 'bold', color: '#FCD25E' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary={`Комната: ${orderRoom ? (orderRoom.booked_hours * Number(orderRoom.room_price_per_hour)).toFixed(2) : '0.00'} руб.`}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary={`Товары: ${calculateItemsTotal().toFixed(2)} руб.`}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary={`Итого: ${Number(orderDetails.total_price).toFixed(2)} руб.`}
                primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#FCD25E' }}
              />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default OrderViewSidebar;
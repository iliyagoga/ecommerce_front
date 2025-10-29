import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Typography,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Order } from '../types';
import { getOrders, updateOrderStatus } from '../api';

interface OrdersTableProps {
  onView: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ onView }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError('Не удалось загрузить заказы.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (order: Order, newStatus: Order['status']) => {
    if (order.order_id === undefined) return;
    try {
      await updateOrderStatus(order.order_id, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(o => (o.order_id === order.order_id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError('Не удалось обновить статус заказа.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Ошибка:</Typography>
        <Typography variant="body1">{error}</Typography>
        <Button onClick={fetchOrders} variant="outlined" sx={{ mt: 2 }}>
          Повторить попытку
        </Button>
      </Box>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'grey';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Имя Клиента</TableCell>
            <TableCell align="right">Почта</TableCell>
            <TableCell align="right">Комментарий</TableCell>
            <TableCell align="right">Статус</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.order_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.client_name}
              </TableCell>
              <TableCell align="right">{order.client_email}</TableCell>
              <TableCell align="right">{order.client_comment ? order.client_comment.substring(0, 20) + '...' : ''}</TableCell>
              <TableCell align="right">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id={`status-label-${order.order_id}`}>Статус</InputLabel>
                  <Select
                    labelId={`status-label-${order.order_id}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as Order['status'])}
                    label="Статус"
                    sx={{ color: getStatusColor(order.status) }}
                  >
                    <MenuItem value="pending">В ожидании</MenuItem>
                    <MenuItem value="confirmed">Подтвержден</MenuItem>
                    <MenuItem value="cancelled">Отменен</MenuItem>
                    <MenuItem value="completed">Выполнен</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small" onClick={() => onView(order)}>
                  Просмотреть
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;

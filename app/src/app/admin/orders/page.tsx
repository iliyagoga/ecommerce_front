"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import OrdersTable from '../../../components/Order/OrdersTable';
import OrderViewSidebar from '../../../components/Order/OrderViewSidebar';
import OrderFormModal from '../../../components/Order/OrderFormModal'; // Импорт нового компонента
import { Order } from '../../../types';

const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false); // Стейт для сайдбара формы

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleCreateOrder = () => {
    setIsFormOpen(true);
  };

  const handleOrderCreated = () => {
    setIsFormOpen(false);
    // Здесь можно обновить список заказов, если необходимо
    // Например, вызвать функцию для перезагрузки данных в OrdersTable
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Заказами
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCreateOrder}>
            Создать Заказ
          </Button>
        </Box>
        <OrdersTable onView={handleViewOrder} />

        <OrderViewSidebar open={isViewOpen} onClose={() => setIsViewOpen(false)} order={selectedOrder} />
        <OrderFormModal open={isFormOpen} onClose={() => setIsFormOpen(false)} onOrderCreated={handleOrderCreated} />
      </Box>
    </Layout>
  );
};

export default OrdersPage;

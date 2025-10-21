"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box } from '@mui/material';
import OrdersTable from '../../../components/OrdersTable';
import OrderViewSidebar from '../../../components/OrderViewSidebar'; // Импорт
import { Order } from '../../../types';

const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const ordersTableRef = useRef<{ fetchOrders: () => void }>(null);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Заказами
          </Typography>
        </Box>
        <OrdersTable ref={ordersTableRef} onView={handleViewOrder} />

        <OrderViewSidebar open={isViewOpen} onClose={() => setIsViewOpen(false)} order={selectedOrder} />
      </Box>
    </Layout>
  );
};

export default OrdersPage;

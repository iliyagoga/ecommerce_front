"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import OrdersTable from '../../../components/Order/OrdersTable';
import OrderViewSidebar from '../../../components/Order/OrderViewSidebar';
import OrderFormModal from '../../../components/Order/OrderFormModal';
import { Order } from '../../../types';

const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleCreateOrder = () => {
    setIsFormOpen(true);
  };


  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Заказами
          </Typography>
        </Box>
        <OrdersTable onView={handleViewOrder} />

        <OrderViewSidebar open={isViewOpen} onClose={() => setIsViewOpen(false)} order={selectedOrder} />
      </Box>
    </Layout>
  );
};

export default OrdersPage;

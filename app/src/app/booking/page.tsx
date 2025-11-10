"use client"
import React from 'react';

import { Typography, Box } from '@mui/material';

import RoomBookingCanvas from '@/components/Halls/RoomBookingCanvas';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

const BookingPage: React.FC = () => {
  const hallIdToDisplay = 1; // Временно используем фиксированный ID зала

  return (<>
    <Header></Header>
    <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Бронь', href: '/booking' }]} />
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Бронирование Комнат
      </Typography>
      <RoomBookingCanvas hallId={hallIdToDisplay} />
    </Box>
    </>
  );
};

export default BookingPage;

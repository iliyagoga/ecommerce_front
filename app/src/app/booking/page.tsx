"use client"
import React, { useState } from 'react';

import { Typography, Box } from '@mui/material';

import RoomBookingCanvas from '@/components/Halls/RoomBookingCanvas';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { TextField } from '@mui/material'; // Импорт TextField

const BookingPage: React.FC = () => {
  const hallIdToDisplay = 1; // Временно используем фиксированный ID зала
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Сегодняшняя дата
  const [selectedStartTime, setSelectedStartTime] = useState<string>('09:00');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('18:00');

  return (<>
    <Header></Header>
    <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Бронь', href: '/booking' }]} />
    <Box sx={{ p: 3, backgroundColor: '#202020', minHeight: '100vh', color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        Бронирование Комнат
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Дата"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'white' }
          }}
          sx={{
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
              backgroundColor: '#333',
            },
          }}
        />
        <TextField
          label="Время начала"
          type="time"
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'white' }
          }}
          sx={{
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
              backgroundColor: '#333',
            },
          }}
        />
        <TextField
          label="Время окончания"
          type="time"
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'white' }
          }}
          sx={{
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
              backgroundColor: '#333',
            },
          }}
        />
      </Box>
      <RoomBookingCanvas 
        hallId={hallIdToDisplay} 
        selectedDate={selectedDate}
        selectedStartTime={selectedStartTime}
        selectedEndTime={selectedEndTime}
      />
    </Box>
    </>
  );
};

export default BookingPage;

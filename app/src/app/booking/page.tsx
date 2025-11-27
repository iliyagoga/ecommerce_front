"use client"
import React, { useEffect, useState } from 'react';

import { Typography, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import RoomBookingCanvas from '@/components/Halls/RoomBookingCanvas';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { TextField } from '@mui/material';
import { CartRoom, HallNew } from '@/types';
import { styled } from 'styled-components';
import { addRoomToCart, getHallsNew } from '@/api';
import { useRouter } from 'next/navigation';

const BookingButton = styled.button`
  background-color: #FCD25E;
  color: #202020;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FFD700; /* Darker gold on hover */
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    color: #343a40;
  }
`;

const BookingPage: React.FC = () => {
  const dateObj = new Date();
  const nowDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}T${String(dateObj.getHours()).padStart(2, '0')}:00`;
  const [halls, setHalls] = useState<HallNew[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>(nowDate);
  const [selectedEndTime, setSelectedEndTime] = useState<string>(nowDate);
  const [selectedRoom, setSelectedRoom] = useState<Omit<CartRoom, "cart_id">>();
  const [hallIdToDisplay, setHallIdToDisplay] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addToCart = async (selectedRoom: Omit<CartRoom, "cart_id"> | undefined) => {
    if (!selectedRoom) return;
    setError(null);
      try {
        const fetchCart = await addRoomToCart(selectedRoom);
        if (fetchCart) router.push("/cart")
      } catch (error) {
        setError(error.response.data.message)
      }
  }
  const handleChangeHall = (event: any) => {
    setHallIdToDisplay(event.target.value);
  };

  useEffect(() => {
    getHallsNew().then((res) => {
      setHalls(res)
    })
  },[])
  return (<>
    <Header></Header>
    <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Бронь', href: '/booking' }]} />
    <Box sx={{ p: 3, backgroundColor: '#202020', minHeight: '100vh', color: 'white' }}>
      {error && <Alert style={{margin: "16px 0"}} severity='error'>{error}</Alert>}
      <Typography variant="h4" gutterBottom>
        Бронирование Комнат
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Время начала"
          type="datetime-local"
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
          type="datetime-local"
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
      <FormControl>
        <InputLabel
          id="hall-label"
           sx={{
              color: 'white !important',
              '&.Mui-focused': {
                color: 'white !important',
              },
            }}
          >Залы</InputLabel>
        <Select
          labelId="hall-label"
          label="Залы"
          value={hallIdToDisplay}
          onChange={handleChangeHall}
          sx={{
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            backgroundColor: '#333',
          }}
        >
          {halls.map((hall) => (
            <MenuItem key={hall.id} value={hall.id}>
              {hall.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </Box>
      <RoomBookingCanvas 
        hallId={hallIdToDisplay} 
        selectedStartDate={selectedStartTime}
        selectedEndDate={selectedEndTime}
        setSelectedRoom={setSelectedRoom}
        setError={setError}
      />
      <Box sx={{display: "flex", gap: "10px", alignItems: "center", marginTop: "1rem"}}>
        <BookingButton disabled={!selectedRoom} onClick={() => addToCart(selectedRoom)}>
              Забронировать
      </BookingButton>

      <Typography variant='h5'>{selectedRoom?.room?.name ?? "Комната не выбрана"}</Typography>
      </Box>
     
    </Box>
    </>
  );
};

export default BookingPage;

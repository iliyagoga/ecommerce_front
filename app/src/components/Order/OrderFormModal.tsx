import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { createOrder, getRooms } from '@/api';
import { Room } from '@/types';

interface OrderFormModalProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

interface RoomForm {
  room_id: string;
  booked_hours: string;
  booked_date: string;
  booked_time_start: string;
  booked_time_end: string;
  base_hourly_rate: string;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ open, onClose, onOrderCreated }) => {
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [clientComment, setClientComment] = useState<string>('');
  const [adminComment, setAdminComment] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [rooms, setRooms] = useState<RoomForm[]>([
    {
      room_id: '',
      booked_hours: '',
      booked_date: '',
      booked_time_start: '',
      booked_time_end: '',
      base_hourly_rate: '',
    },
  ]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      const fetchRooms = async () => {
        try {
          setLoadingRooms(true);
          const fetchedRooms = await getRooms();
          setAvailableRooms(fetchedRooms);
        } catch (error) {
          console.error('Ошибка при загрузке комнат:', error);
        } finally {
          setLoadingRooms(false);
        }
      };
      fetchRooms();
    }
  }, [open]);

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        room_id: '',
        booked_hours: '',
        booked_date: '',
        booked_time_start: '',
        booked_time_end: '',
        base_hourly_rate: '',
      },
    ]);
  };

  const handleRemoveRoom = (index: number) => {
    const newRooms = rooms.filter((_, i) => i !== index);
    setRooms(newRooms);
  };

  const handleRoomChange = (index: number, field: keyof RoomForm, value: string) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;

    if (field === 'room_id') {
      const selectedRoom = availableRooms.find(room => room.room_id === parseInt(value));
      if (selectedRoom) {
        newRooms[index].base_hourly_rate = selectedRoom.base_hourly_rate + "";
      }
    }
    setRooms(newRooms);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const orderData = {
      status: "pending",
      total_price: parseFloat(totalPrice),
      client_comment: clientComment,
      admin_comment: adminComment,
      start_time: startTime,
      end_time: endTime,
      rooms: rooms.map((room) => ({
        room_id: parseInt(room.room_id),
        booked_hours: parseInt(room.booked_hours),
        booked_date: room.booked_date,
        booked_time_start: room.booked_time_start,
        booked_time_end: room.booked_time_end,
        room_price_per_hour: parseFloat(room.base_hourly_rate),
      })),
    };

    try {
      setError(null);
      await createOrder(orderData);
      onOrderCreated();
      router.refresh();
      onClose();
      setTotalPrice('');
      setClientComment('');
      setAdminComment('');
      setStartTime('');
      setEndTime('');
      setRooms([
        {
          room_id: '',
          booked_hours: '',
          booked_date: '',
          booked_time_start: '',
          booked_time_end: '',
          base_hourly_rate: '',
        },
      ]);
    } catch (error) {
      setError('Не удалось создать заказ. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Создать Заказ</Typography>
            <IconButton onClick={onClose}>
              -
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Общая Цена"
                  fullWidth
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  margin="normal"
                  type="number"
                  inputProps={{ step: '0.01' }}
                  required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Комментарий Клиента"
                  fullWidth
                  value={clientComment}
                  onChange={(e) => setClientComment(e.target.value)}
                  margin="normal"
                  multiline
                  rows={2} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Время начала"
                  fullWidth
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  margin="normal"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Время окончания"
                  fullWidth
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  margin="normal"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  required />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Комнаты</Typography>
                {loadingRooms ? (
                  <CircularProgress />
                ) : (
                  rooms.map((room, index) => (
                    <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: '4px' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal" required>
                            <InputLabel id={`room-select-label-${index}`}>Комната</InputLabel>
                            <Select
                              labelId={`room-select-label-${index}`}
                              id={`room-select-${index}`}
                              value={room.room_id}
                              label="Комната"
                              onChange={(e) => handleRoomChange(index, 'room_id', e.target.value as string)}
                            >
                              {availableRooms.map((r) => (
                                <MenuItem key={r.room_id} value={r.room_id}>
                                  {r.name} (ID: {r.room_id}, Price: {r.base_hourly_rate})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Забронировано Часов"
                            fullWidth
                            value={room.booked_hours}
                            onChange={(e) => handleRoomChange(index, 'booked_hours', e.target.value)}
                            margin="normal"
                            type="number"
                            required />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Дата Бронирования"
                            fullWidth
                            value={room.booked_date}
                            onChange={(e) => handleRoomChange(index, 'booked_date', e.target.value)}
                            margin="normal"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            required />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Время начала бронирования"
                            fullWidth
                            value={room.booked_time_start}
                            onChange={(e) => handleRoomChange(index, 'booked_time_start', e.target.value)}
                            margin="normal"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            required />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Время окончания бронирования"
                            fullWidth
                            value={room.booked_time_end}
                            onChange={(e) => handleRoomChange(index, 'booked_time_end', e.target.value)}
                            margin="normal"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            required />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Цена за час"
                            fullWidth
                            value={room.base_hourly_rate}
                            onChange={(e) => handleRoomChange(index, 'base_hourly_rate', e.target.value)}
                            margin="normal"
                            type="number"
                            inputProps={{ step: '0.01' }}
                            required
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton color="error" onClick={() => handleRemoveRoom(index)}>
                            -
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  )))}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Отмена
          </Button>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
            Создать Заказ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderFormModal;

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
  Switch,
} from '@mui/material';
import { Room } from '../types';
import { getRooms, updateRoom } from '../api';

interface RoomsTableProps {
  onView: (room: Room) => void;
  onEdit: (room: Room) => void;
}

const RoomsTable: React.FC<RoomsTableProps> = ({ onView, onEdit }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError('Не удалось загрузить комнаты.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAvailabilityChange = async (room: Room) => {
    if (room.type_id === undefined) return;
    try {
      const updatedRoom = { ...room, available: !room.available };
      await updateRoom(room.type_id, updatedRoom);
      setRooms(prevRooms =>
        prevRooms.map(r => (r.type_id === room.type_id ? updatedRoom : r))
      );
    } catch (err) {
      setError('Не удалось обновить доступность комнаты.');
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
        <Button onClick={fetchRooms} variant="outlined" sx={{ mt: 2 }}>
          Повторить попытку
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="right">Цена за час</TableCell>
            <TableCell align="right">Доступность</TableCell>
            <TableCell align="right">Вид комнаты</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.type_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {room.name}
              </TableCell>
              <TableCell align="right">{room.base_hourly_rate} руб/час</TableCell>
              <TableCell align="right">
                <Switch
                  checked={room.available || false}
                  onChange={() => handleAvailabilityChange(room)}
                  inputProps={{ 'aria-label': 'контроль доступности' }}
                />
              </TableCell>
              <TableCell align="right">{room.type}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small" onClick={() => onView(room)} sx={{ mr: 1 }}>
                  Просмотреть
                </Button>
                <Button variant="contained" size="small" onClick={() => onEdit(room)}>
                  Редактировать
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoomsTable;

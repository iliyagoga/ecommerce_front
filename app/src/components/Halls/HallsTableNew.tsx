import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { getHallsNew, deleteHallNew } from '@/api';
import { HallNew } from '@/types';
import { Box } from '@mui/material';

interface HallsTableNewProps {
  onEdit: (hall: HallNew) => void;
  onOpenEditor: (hallId: number) => void;
}

const HallsTableNew = forwardRef<{ fetchHalls: () => void }, HallsTableNewProps>(({ onEdit, onOpenEditor }, ref) => {
  const [halls, setHalls] = useState<HallNew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const fetchedHalls = await getHallsNew();
      setHalls(fetchedHalls);
    } catch (error) {
      console.error("Ошибка при загрузке залов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchHalls,
  }));

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот зал?')) {
      try {
        await deleteHallNew(id);
        fetchHalls();
      } catch (error) {
        console.error("Ошибка при удалении зала:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Ширина</TableCell>
            <TableCell>Высота</TableCell>
            <TableCell>Количество комнат</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {halls.map((hall) => (
            <TableRow key={hall.id}>
              <TableCell>{hall.id}</TableCell>
              <TableCell>{hall.name}</TableCell>
              <TableCell>{hall.width}</TableCell>
              <TableCell>{hall.height}</TableCell>
              <TableCell>{hall.hall_rooms_new_count}</TableCell>
              <TableCell>
                <IconButton onClick={() => onOpenEditor(hall.id as number)} color="primary">
                  +
                </IconButton>
                <IconButton onClick={() => onEdit(hall)} color="secondary">
                  ред
                </IconButton>
                <IconButton onClick={() => handleDelete(hall.id as number)} color="error">
                  -
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default HallsTableNew;

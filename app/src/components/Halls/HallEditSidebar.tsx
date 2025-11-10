import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { updateHallNew } from '@/api';
import { HallNew } from '@/types';

interface HallEditSidebarProps {
  open: boolean;
  onClose: () => void;
  hall: HallNew | null;
  onSaveSuccess: () => void;
}

const HallEditSidebar: React.FC<HallEditSidebarProps> = ({ open, onClose, hall, onSaveSuccess }) => {
  const [hallData, setHallData] = useState<HallNew | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && hall) {
      setHallData({ ...hall });
      setError(null);
    } else if (!open) {
      setHallData(null);
    }
  }, [open, hall]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHallData(prev => prev ? { ...prev, [name]: (name === 'width' || name === 'height') ? Number(value) : value } : null);
  };

  const handleSubmit = async () => {
    if (!hallData || !hallData.id) return;

    setLoading(true);
    setError(null);
    try {
      await updateHallNew(hallData.id, hallData);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении зала');
      console.error("Ошибка при обновлении зала:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h6" gutterBottom>Редактировать зал</Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {hallData && (
          <>
            <TextField
              margin="dense"
              name="name"
              label="Название зала"
              type="text"
              fullWidth
              value={hallData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="width"
              label="Ширина (px)"
              type="number"
              fullWidth
              value={hallData.width}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="height"
              label="Высота (px)"
              type="number"
              fullWidth
              value={hallData.height}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="svg_background"
              label="SVG Фон (необязательно)"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={hallData.svg_background || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>Сохранить</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default HallEditSidebar;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Typography, Box } from '@mui/material';
import { createHallNew } from '@/api';
import { HallNew } from '@/types';

interface HallAddModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const HallAddModal: React.FC<HallAddModalProps> = ({ open, onClose, onSaveSuccess }) => {
  const [hallData, setHallData] = useState<Omit<HallNew, 'id' | 'hall_rooms_new_count'>>({
    name: '',
    width: 0,
    height: 0,
    svg_background: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setHallData({
        name: '',
        width: 0,
        height: 0,
        svg_background: '',
      });
      setError(null);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHallData(prev => ({ ...prev, [name]: (name === 'width' || name === 'height') ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await createHallNew(hallData);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании зала');
      console.error("Ошибка при создании зала:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новый зал</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          autoFocus
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
          value={hallData.svg_background}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HallAddModal;

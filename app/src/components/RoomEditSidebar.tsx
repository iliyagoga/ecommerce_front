import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
  InputAdornment,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
/*import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';*/
import { Room, RoomImage } from '../types';
import { updateRoom } from '../api';

interface RoomEditSidebarProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  onSaveSuccess: () => void;
}

const RoomEditSidebar: React.FC<RoomEditSidebarProps> = ({ open, onClose, room, onSaveSuccess }) => {
  const [editedRoom, setEditedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      setEditedRoom({ ...room, amenities: room.amenities ? [...room.amenities] : [] });
    } else {
      setEditedRoom(null);
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRoom(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRoom(prev => (prev ? { ...prev, [name]: Number(value) } : null));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedRoom(prev => (prev ? { ...prev, [name]: checked } : null));
  };

  const handleAmenityAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newAmenity = e.currentTarget.value.trim();
      if (newAmenity && editedRoom && !editedRoom.amenities?.includes(newAmenity)) {
        setEditedRoom(prev => (
          prev ? { ...prev, amenities: [...(prev.amenities || []), newAmenity] } : null
        ));
        e.currentTarget.value = '';
      }
    }
  };

  const handleAmenityDelete = (amenityToDelete: string) => {
    setEditedRoom(prev => (
      prev ? { ...prev, amenities: prev.amenities?.filter(a => a !== amenityToDelete) } : null
    ));
  };

  const handleGalleryImageChange = (index: number, value: string) => {
    setEditedRoom(prev => {
      if (!prev) return null;
      const newGallery = [...(prev.gallery || [])];
      newGallery[index] = { ...newGallery[index], url: value };
      return { ...prev, gallery: newGallery };
    });
  };

  const handleAddGalleryImage = () => {
    setEditedRoom(prev => (
      prev ? { ...prev, gallery: [...(prev.gallery || []), { url: '' }] } : null
    ));
  };

  const handleDeleteGalleryImage = (index: number) => {
    setEditedRoom(prev => {
      if (!prev) return null;
      const newGallery = (prev.gallery || []).filter((_, i) => i !== index);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSave = async () => {
    if (!editedRoom || editedRoom.type_id === undefined) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateRoom(editedRoom.type_id, editedRoom);
      setSuccess('Комната успешно обновлена!');
      onSaveSuccess(); // Обновить данные в таблице
      onClose();
    } catch (err) {
      setError('Не удалось обновить комнату.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!editedRoom) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 500,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 500,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Редактирование Комнаты: {editedRoom.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          Х
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#444' }} />
      <Box sx={{ p: 2 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Название комнаты"
          name="name"
          value={editedRoom.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="room-type-label">Тип комнаты</InputLabel>
          <Select
            labelId="room-type-label"
            id="room-type-select"
            value={editedRoom.type || 'обычная'}
            label="Тип комнаты"
            onChange={(e) => setEditedRoom(prev => (prev ? { ...prev, type: e.target.value as 'обычная' | 'вип' | 'кино' } : null))}
          >
            <MenuItem value="обычная">Обычная</MenuItem>
            <MenuItem value="вип">VIP</MenuItem>
            <MenuItem value="кино">Кинотеатр</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Базовая цена за час"
          name="base_hourly_rate"
          type="number"
          value={editedRoom.base_hourly_rate}
          onChange={handleNumberChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₽</InputAdornment>,
          }}
        />
        <TextField
          label="Первоначальный взнос"
          name="initial_fee"
          type="number"
          value={editedRoom.initial_fee || 0}
          onChange={handleNumberChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₽</InputAdornment>,
          }}
        />
        <TextField
          label="Максимальное количество человек"
          name="max_people"
          type="number"
          value={editedRoom.max_people}
          onChange={handleNumberChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Описание"
          name="description"
          value={editedRoom.description || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="URL превью изображения"
          name="preview_img"
          value={editedRoom.preview_img || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Удобства:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {(editedRoom.amenities || []).map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                onDelete={() => handleAmenityDelete(amenity)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <TextField
            label="Добавить удобство"
            onKeyPress={handleAmenityAdd}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    +
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Галерея изображений:</Typography>
          {(editedRoom.gallery || []).map((img, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label={`URL изображения ${index + 1}`}
                value={img.url}
                onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
              <IconButton onClick={() => handleDeleteGalleryImage(index)} color="error">
                -
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddGalleryImage}>Добавить изображение</Button>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={editedRoom.available || false}
              onChange={handleSwitchChange}
              name="available"
              color="primary"
            />
          }
          label="Доступна"
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Отмена
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RoomEditSidebar;

import React, { useState } from 'react';
import {
  Modal,
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
/*import AddIcon from '@mui/icons-material/Add';*/
import { Room } from '../types';
import { createRoom } from '../api';

interface AddRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void; // Callback для обновления таблицы после сохранения
}

const initialNewRoomState: Omit<Room, 'type_id'> = {
  name: '',
  type: 'обычная',
  base_hourly_rate: 0,
  initial_fee: 0,
  max_people: 1,
  description: '',
  amenities: [],
  preview_img: '',
  gallery: [],
  available: true,
};

const AddRoomModal: React.FC<AddRoomModalProps> = ({ open, onClose, onSaveSuccess }) => {
  const [newRoom, setNewRoom] = useState<Omit<Room, 'type_id'> & {type?: Room['type']}>(initialNewRoomState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: checked }));
  };

  const handleAmenityAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const amenityInput = e.currentTarget;
      const newAmenity = amenityInput.value.trim();
      if (newAmenity && !newRoom.amenities?.includes(newAmenity)) {
        setNewRoom(prev => ({ ...prev, amenities: [...(prev.amenities || []), newAmenity] }));
        amenityInput.value = '';
      }
      e.preventDefault();
    }
  };

  const handleAmenityDelete = (amenityToDelete: string) => {
    setNewRoom(prev => ({ ...prev, amenities: prev.amenities?.filter(a => a !== amenityToDelete) }));
  };

  const handleGalleryImageChange = (index: number, value: string) => {
    setNewRoom(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery[index] = { ...newGallery[index], url: value };
      return { ...prev, gallery: newGallery };
    });
  };

  const handleAddGalleryImage = () => {
    setNewRoom(prev => ({ ...prev, gallery: [...(prev.gallery || []), { url: '' }] }));
  };

  const handleDeleteGalleryImage = (index: number) => {
    setNewRoom(prev => {
      const newGallery = (prev.gallery || []).filter((_, i) => i !== index);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const roomToCreate: Omit<Room, 'type_id'> = {
        ...newRoom,
        amenities: newRoom.amenities || [],
        gallery: newRoom.gallery || [],
      };
      await createRoom(roomToCreate);
      setSuccess('Комната успешно добавлена!');
      onSaveSuccess();
      onClose();
      setNewRoom(initialNewRoomState);
    } catch (err) {
      setError('Не удалось добавить комнату.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-room-modal-title"
      aria-describedby="add-room-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: '#1a1a1a',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#ffffff',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="add-room-modal-title" variant="h6" component="h2">
            Добавить новую комнату
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            Х
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#444' }} />
        <Box id="add-room-modal-description" sx={{ mt: 2 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Название комнаты"
            name="name"
            value={newRoom.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="new-room-type-label">Тип комнаты</InputLabel>
            <Select
              labelId="new-room-type-label"
              id="new-room-type-select"
              value={newRoom.type || 'обычная'}
              label="Тип комнаты"
              onChange={(e) => setNewRoom(prev => ({ ...prev, type: e.target.value as 'обычная' | 'вип' | 'кино' }))}
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
            value={newRoom.base_hourly_rate}
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
            value={newRoom.initial_fee}
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
            value={newRoom.max_people}
            onChange={handleNumberChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Описание"
            name="description"
            value={newRoom.description}
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
            value={newRoom.preview_img}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Удобства:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {(newRoom.amenities || []).map((amenity, index) => (
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
            {(newRoom.gallery || []).map((img, index) => (
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
                checked={newRoom.available || false}
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
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Добавить'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRoomModal;

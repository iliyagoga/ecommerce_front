import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  InputAdornment,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
/*import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';*/
import { Room, RoomImage } from '@/types';
import { HOST_URL, updateRoom } from '@/api';

interface RoomEditSidebarProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  onSaveSuccess: () => void;
}

const RoomEditSidebar: React.FC<RoomEditSidebarProps> = ({ open, onClose, room, onSaveSuccess }) => {
  const router = useRouter();
  const [editedRoom, setEditedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<File | null>(null);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      setEditedRoom({ ...room });
      setPreviewImageURL(`${HOST_URL}${room.preview_img}` || null);
    } else {
      setEditedRoom(null);
      setPreviewImageURL(null);
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRoom(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedPreviewImage(file);
      setPreviewImageURL(URL.createObjectURL(file));
      setEditedRoom(prev => (prev ? { ...prev, preview_img: file as any } : null));
    } else {
      setSelectedPreviewImage(null);
      setPreviewImageURL(editedRoom?.preview_img || null); // Revert to original image if no new file selected
      setEditedRoom(prev => (prev ? { ...prev, preview_img: editedRoom?.preview_img || "" } : null));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRoom(prev => (prev ? { ...prev, [name]: Number(value) } : null));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedRoom(prev => (prev ? { ...prev, [name]: checked } : null));
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
    if (!editedRoom || editedRoom.room_id === undefined) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let roomToUpdate: Partial<Room> | FormData = editedRoom;
      let config: { headers?: { 'Content-Type': string } } = {};

      if (selectedPreviewImage) {
        const formData = new FormData();
        for (const key in editedRoom) {
          if (Object.prototype.hasOwnProperty.call(editedRoom, key) && key !== 'preview_img') {
            formData.append(key, (editedRoom as any)[key]);
          }
        }
        formData.append('preview_img', selectedPreviewImage);
        roomToUpdate = formData;
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }

      await updateRoom(editedRoom.room_id, roomToUpdate, config);
      setSuccess('Комната успешно обновлена!');
      onSaveSuccess();
      router.refresh();
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
            value={editedRoom.type || 'standard'}
            label="Тип комнаты"
            onChange={(e) => setEditedRoom(prev => (prev ? { ...prev, type: e.target.value } : null))}
          >
            <MenuItem value="standard">Обычная</MenuItem>
            <MenuItem value="vip">VIP</MenuItem>
            <MenuItem value="cinema">Кинотеатр</MenuItem>
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
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            sx={{ mr: 2 }}
          >
            Загрузить превью
            <input
              type="file"
              hidden
              name="preview_img"
              onChange={handlePreviewFileChange}
              accept="image/*"
            />
          </Button>
          {previewImageURL && (
            <img
              src={previewImageURL}
              alt="Превью комнаты"
              style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
            />
          )}
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
              checked={editedRoom.is_available || false}
              onChange={handleSwitchChange}
              name="is_available"
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

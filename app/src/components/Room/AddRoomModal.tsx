import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Room } from '@/types';
import { createRoom } from '@/api';

interface AddRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const initialNewRoomState: Omit<Room, 'type_id'> = {
  name: '',
  type: 'standard',
  base_hourly_rate: 0,
  initial_fee: 0,
  max_people: 1,
  description: '',
  preview_img: "",
  gallery: [],
  is_available: true,
};

const AddRoomModal: React.FC<AddRoomModalProps> = ({ open, onClose, onSaveSuccess }) => {
  const router = useRouter();
  const [newRoom, setNewRoom] = useState<Omit<Room, 'type_id'> & {type?: Room['type']}>(initialNewRoomState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<File | null>(null);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<File[]>([]);
  const [galleryImageURLs, setGalleryImageURLs] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedPreviewImage(file);
      setPreviewImageURL(URL.createObjectURL(file));
      setNewRoom(prev => ({ ...prev, preview_img: file as any }));
    } else {
      setSelectedPreviewImage(null);
      setPreviewImageURL(null);
      setNewRoom(prev => ({ ...prev, preview_img: "" }));
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedGalleryImages(newFiles);
      const newURLs = newFiles.map(file => URL.createObjectURL(file));
      setGalleryImageURLs(newURLs);
      setNewRoom(prev => ({ ...prev, gallery: newFiles as any }));
    } else {
      setSelectedGalleryImages([]);
      setGalleryImageURLs([]);
      setNewRoom(prev => ({ ...prev, gallery: [] }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();

      for (const key in newRoom) {
        if (Object.prototype.hasOwnProperty.call(newRoom, key)) {
          if (key === 'preview_img' && selectedPreviewImage) {
            formData.append('preview_img', selectedPreviewImage);
          } else if (key === 'gallery' && selectedGalleryImages.length > 0) {
            selectedGalleryImages.forEach((file, index) => {
              formData.append(`gallery[${index}]`, file);
            });
          } else if (key !== 'gallery' && key !== 'preview_img') {
            formData.append(key, (newRoom as any)[key]);
          }
        }
      }

      await createRoom(formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Комната успешно добавлена!');
      onSaveSuccess();
      router.refresh();
      onClose();
      setNewRoom(initialNewRoomState);
      setSelectedPreviewImage(null);
      setPreviewImageURL(null);
      setSelectedGalleryImages([]);
      setGalleryImageURLs([]);
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
              value={newRoom.type || 'standard'}
              label="Тип комнаты"
              onChange={(e) => setNewRoom(prev => ({ ...prev, type: e.target.value as 'standard' | 'vip' | 'cinema' }))}
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

          {/*<Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ mr: 2 }}
            >
              Загрузить изображения галереи
              <input
                type="file"
                hidden
                multiple
                name="gallery"
                onChange={handleGalleryFileChange}
                accept="image/*"
              />
            </Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {galleryImageURLs.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Изображение галереи ${index + 1}`}
                  style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                />
              ))}
            </Box>
          </Box>*/}

          <FormControlLabel
            control={
              <Switch
                checked={newRoom.is_available || false}
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

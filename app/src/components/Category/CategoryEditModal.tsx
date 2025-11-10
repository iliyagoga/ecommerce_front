import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@mui/material';
import { Category } from '@/types';
import { updateCategory } from '@/api';

interface CategoryEditModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onSaveSuccess: () => void;
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({ open, onClose, category, onSaveSuccess }) => {
  const router = useRouter();
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setEditedCategory({ ...category });
    } else {
      setEditedCategory(null);
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCategory(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!editedCategory || editedCategory.category_id === undefined) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateCategory(editedCategory.category_id, editedCategory);
      setSuccess('Категория успешно обновлена!');
      onSaveSuccess();
      router.refresh();
      onClose();
    } catch (err) {
      setError('Не удалось обновить категорию.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!editedCategory) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-category-modal-title"
      aria-describedby="edit-category-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#1a1a1a',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        color: '#ffffff',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="edit-category-modal-title" variant="h6" component="h2">
            Редактировать категорию: {editedCategory.name}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            Х
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#444' }} />
        <Box id="edit-category-modal-description" sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Название категории"
            name="name"
            value={editedCategory.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
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
      </Box>
    </Modal>
  );
};

export default CategoryEditModal;

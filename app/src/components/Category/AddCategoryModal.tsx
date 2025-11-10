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
  Divider,
} from '@mui/material';
import { Category } from '@/types';
import { createCategory } from '@/api';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const initialNewCategoryState: Omit<Category, 'category_id'> = {
  name: '',
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose, onSaveSuccess }) => {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'category_id'> & { category_id?: number }>(initialNewCategoryState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createCategory(newCategory);
      setSuccess('Категория успешно добавлена!');
      onSaveSuccess();
      router.refresh();
      onClose();
      setNewCategory(initialNewCategoryState);
    } catch (err) {
      setError('Не удалось добавить категорию.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-category-modal-title"
      aria-describedby="add-category-modal-description"
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
          <Typography id="add-category-modal-title" variant="h6" component="h2">
            Добавить новую категорию
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            Х
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#444' }} />
        <Box id="add-category-modal-description" sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Название категории"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
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

export default AddCategoryModal;

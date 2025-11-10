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
  FormControlLabel,
  Switch,
  Divider,
  InputAdornment,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Product, Category } from '@/types';
import { createProduct, getCategories } from '@//api';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const initialNewProductState: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category_id: undefined,
  is_available: true,
};

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onSaveSuccess }) => {
  const router = useRouter();
  const [newProduct, setNewProduct] = useState<Omit<any, 'id'> & { category_id?: number }>(initialNewProductState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Не удалось загрузить категории:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files} = e.target;
    if (!files || files.length === 0) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }
    const file = files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setNewProduct(prev => ({ ...prev, [name]: file }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (e: any) => {
    setNewProduct(prev => ({ ...prev, category_id: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const productToCreate: Omit<any, 'id'> = {
        ...newProduct,
        category_id: newProduct.category_id || null,
      } as Omit<any, 'id'>;

      await createProduct(productToCreate);
      setSuccess('Товар успешно добавлен!');
      onSaveSuccess();
      router.refresh();
      onClose();
      setNewProduct(initialNewProductState);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      setError('Не удалось добавить товар.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-product-modal-title"
      aria-describedby="add-product-modal-description"
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
          <Typography id="add-product-modal-title" variant="h6" component="h2">
            Добавить новый товар
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            Х
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#444' }} />
        <Box id="add-product-modal-description" sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Название товара"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Описание"
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Цена"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleNumberChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₽</InputAdornment>,
            }}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ mr: 2 }}
            >
              Загрузить изображение
              <input
                type="file"
                hidden
                name="image_url"
                onChange={handleFile}
                accept="image/*"
              />
            </Button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Предварительный просмотр"
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
              />
            )}
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="new-product-category-label">Категория</InputLabel>
            <Select
              labelId="new-product-category-label"
              id="new-product-category-select"
              value={newProduct.category_id || ''}
              label="Категория"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={newProduct.is_available || false}
                onChange={handleSwitchChange}
                name="is_available"
                color="primary"
              />
            }
            label="Доступен"
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

export default AddProductModal;

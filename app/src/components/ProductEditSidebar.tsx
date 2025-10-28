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
  InputAdornment,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Product, Category } from '../types';
import { updateProduct, getCategories, HOST_URL } from '../api';

interface ProductEditSidebarProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveSuccess: () => void;
}

const ProductEditSidebar: React.FC<ProductEditSidebarProps> = ({ open, onClose, product, onSaveSuccess }) => {
  const [editedProduct, setEditedProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
      setImagePreview(`${HOST_URL}${product.image_url}` || null);
    } else {
      setEditedProduct(null);
      setImagePreview(null);
    }
  }, [product]);

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
    setEditedProduct(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) {
      setSelectedImage(null);
      setImagePreview(editedProduct?.image_url || null); // Revert to original image if no new file selected
      return;
    }
    const file = files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setEditedProduct(prev => (prev ? { ...prev, image_url: file as any } : null));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => (prev ? { ...prev, [name]: Number(value) } : null));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedProduct(prev => (prev ? { ...prev, [name]: checked } : null));
  };

  const handleCategoryChange = (e: any) => {
    setEditedProduct(prev => (prev ? { ...prev, category_id: e.target.value } : null));
  };

  const handleSave = async () => {
    if (!editedProduct || editedProduct.item_id === undefined) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let productToUpdate: Partial<any> | FormData = editedProduct;
      let config: { headers?: { 'Content-Type': string } } = {};

      if (selectedImage) {
        const formData = new FormData();
        for (const key in editedProduct) {
          if (Object.prototype.hasOwnProperty.call(editedProduct, key) && key !== 'image_url') {
            formData.append(key, (editedProduct as any)[key]);
          }
        }
        formData.append('image_url', selectedImage);
        productToUpdate = formData;
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      
      await updateProduct(editedProduct.item_id, productToUpdate, config);
      setSuccess('Товар успешно обновлен!');
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError('Не удалось обновить товар.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!editedProduct) return null;

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
        <Typography variant="h6">Редактирование Товара: {editedProduct.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          Х
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#444' }} />
      <Box sx={{ p: 2 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Название товара"
          name="name"
          value={editedProduct.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Описание"
          name="description"
          value={editedProduct.description || ''}
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
          value={editedProduct.price}
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
          <InputLabel id="category-select-label">Категория</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={editedProduct.category_id || ''}
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
              checked={editedProduct.is_available || false}
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
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProductEditSidebar;

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
/*import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import FastfoodIcon from '@mui/icons-material/Fastfood';*/
import { Product } from '../types';
import { HOST_URL } from '@/api';

interface ProductViewSidebarProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductViewSidebar: React.FC<ProductViewSidebarProps> = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 400,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 400,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Детали Товара: {product.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          Х
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#444' }} />
      <Box sx={{ p: 2 }}>
        {product.image_url && (
          <Box sx={{ mb: 2 }}>
            <img src={`${HOST_URL}${product.image_url}`} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        )}

        <List dense>
          <ListItem>
            <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
            <ListItemText primary={`Цена: ${product.price} руб.`} />
          </ListItem>
          {product.description && (
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Описание: ${product.description}`} />
            </ListItem>
          )}
          <ListItem>
            <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
            <ListItemText primary={`Доступен: ${product.is_available ? 'Да' : 'Нет'}`} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default ProductViewSidebar;

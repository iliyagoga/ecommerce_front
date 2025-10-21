import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Typography,
  Switch,
} from '@mui/material';
import { Product } from '../types';
import { getProducts, updateProduct } from '../api';

interface ProductsTableProps {
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ onView, onEdit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Не удалось загрузить товары.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAvailabilityChange = async (product: Product) => {
    if (product.id === undefined) return;
    try {
      const updatedProduct = { ...product, available: !product.available };
      await updateProduct(product.id, updatedProduct);
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === product.id ? updatedProduct : p))
      );
    } catch (err) {
      setError('Не удалось обновить доступность товара.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Ошибка:</Typography>
        <Typography variant="body1">{error}</Typography>
        <Button onClick={fetchProducts} variant="outlined" sx={{ mt: 2 }}>
          Повторить попытку
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="right">Цена</TableCell>
            <TableCell align="right">Доступность</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {product.name}
              </TableCell>
              <TableCell align="right">{product.price} руб.</TableCell>
              <TableCell align="right">
                <Switch
                  checked={product.available || false}
                  onChange={() => handleAvailabilityChange(product)}
                  inputProps={{ 'aria-label': 'контроль доступности' }}
                />
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small" onClick={() => onView(product)} sx={{ mr: 1 }}>
                  Просмотреть
                </Button>
                <Button variant="contained" size="small" onClick={() => onEdit(product)}>
                  Редактировать
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductsTable;

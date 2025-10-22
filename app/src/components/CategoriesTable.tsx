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
  IconButton,
} from '@mui/material';
import { Category } from '../types';
import { deleteCategory } from '../api';

interface CategoriesTableProps {
  onEdit: (category: Category) => void;
  onDeleteSuccess: () => void;
  onSuccess: () => Promise<Category[]>;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ onEdit, onDeleteSuccess, onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await onSuccess();
      setCategories(data);
    } catch (err) {
      setError('Не удалось загрузить категории.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
      setLoading(true);
      try {
        await deleteCategory(id);
        onDeleteSuccess();
      } catch (err) {
        setError('Не удалось удалить категорию.');
        console.error(err);
      } finally {
        setLoading(false);
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
        <Button onClick={fetchCategories} variant="outlined" sx={{ mt: 2 }}>
          Повторить попытку
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название Категории</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.category_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {category.name}
              </TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(category)}>
                  Ред
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(category.category_id!)} disabled={loading}>
                  -
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoriesTable;

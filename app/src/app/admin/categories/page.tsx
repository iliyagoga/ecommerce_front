"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import CategoriesTable from '../../../components/CategoriesTable';
import AddCategoryModal from '../../../components/AddCategoryModal';
import CategoryEditModal from '../../../components/CategoryEditModal'; // Будет создан далее
import { Category } from '../../../types';
import { getCategories } from '@/api';

const CategoriesPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Категориями
          </Typography>
          <Button variant="contained" onClick={handleAddCategory}>
            Добавить Категорию
          </Button>
        </Box>
        <CategoriesTable
          onEdit={handleEditCategory}
          onDeleteSuccess={() => getCategories()}
          onSuccess={() => getCategories()}
        />

        <AddCategoryModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSaveSuccess={() => getCategories()}
        />
        <CategoryEditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
          onSaveSuccess={() => getCategories()}
          />
      </Box>
    </Layout>
  );
};

export default CategoriesPage;

"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import CategoriesTable from '../../../components/CategoriesTable';
import AddCategoryModal from '../../../components/AddCategoryModal';
import CategoryEditModal from '../../../components/CategoryEditModal'; // Будет создан далее
import { Category } from '../../../types';

const CategoriesPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoriesTableRef = useRef<{ fetchCategories: () => void }>(null);

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSaveSuccess = () => {
    if (categoriesTableRef.current) {
      categoriesTableRef.current.fetchCategories();
    }
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
        <CategoriesTable ref={categoriesTableRef} onEdit={handleEditCategory} onDeleteSuccess={handleSaveSuccess} />

        <AddCategoryModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSaveSuccess={handleSaveSuccess} />
        <CategoryEditModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} category={selectedCategory} onSaveSuccess={handleSaveSuccess} />
      </Box>
    </Layout>
  );
};

export default CategoriesPage;

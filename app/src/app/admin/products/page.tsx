"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import ProductsTable from '../../../components/ProductsTable';
import ProductViewSidebar from '../../../components/ProductViewSidebar';
import ProductEditSidebar from '../../../components/ProductEditSidebar';
import AddProductModal from '../../../components/AddProductModal'; // Импорт
import { Product } from '../../../types';

const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const productsTableRef = useRef<{ fetchProducts: () => void }>(null);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleAddProduct = () => {
    setIsAddOpen(true);
  };

  const handleSaveSuccess = () => {
    if (productsTableRef.current) {
      productsTableRef.current.fetchProducts();
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Товарами
          </Typography>
          <Button variant="contained" onClick={handleAddProduct}>
            Добавить Товар
          </Button>
        </Box>
        <ProductsTable ref={productsTableRef} onView={handleViewProduct} onEdit={handleEditProduct} />

        <ProductViewSidebar open={isViewOpen} onClose={() => setIsViewOpen(false)} product={selectedProduct} />
        <ProductEditSidebar open={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSaveSuccess={handleSaveSuccess} />
        <AddProductModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onSaveSuccess={handleSaveSuccess} />

      </Box>
    </Layout>
  );
};

export default ProductsPage;

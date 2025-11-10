"use client"
import React from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box } from '@mui/material';
import HallsAdmin from '@/components/Halls/HallsAdmin';

const HallsPage: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Генератор Залов
        </Typography>
        <HallsAdmin />
      </Box>
    </Layout>
  );
};

export default HallsPage;

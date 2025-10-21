"use client"
import React from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box } from '@mui/material';
import DashboardAnalytics from '../../../components/DashboardAnalytics';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Дашборд
        </Typography>
        <DashboardAnalytics />
      </Box>
    </Layout>
  );
};

export default DashboardPage;

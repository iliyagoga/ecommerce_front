"use client"
import React, { useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box } from '@mui/material';
import ReviewsTable from '@/components/Reviews/ReviewTable';

const ReviewsPage: React.FC = () => {
  const reviewsTableRef = useRef<{ fetchReviews: () => void }>(null);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Отзывами
          </Typography>
        </Box>
        <ReviewsTable
          ref={reviewsTableRef}
        />
      </Box>
    </Layout>
  );
};

export default ReviewsPage;

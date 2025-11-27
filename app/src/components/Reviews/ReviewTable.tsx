import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Review } from '@/types';
import { deleteCategory, getReviews } from '@/api';

interface ReviewsTableProps {
}

const ReviewsTable = forwardRef<{ fetchReviews: () => void }, ReviewsTableProps>(({}, ref) => {
  const [isMore, setIsMore] = useState<number | null>(null);
  const [reviewss, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError('Не удалось загрузить отзывы.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchReviews,
  }));

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
        <Button onClick={fetchReviews} variant="outlined" sx={{ mt: 2 }}>
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
            <TableCell>Автор</TableCell>
            <TableCell>Отзыв</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviewss.map((review) => (
            <TableRow
              key={review.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {review.user.name}
              </TableCell>
              <TableCell component="th" scope="row" style={{cursor: "pointer"}} onClick={() => {
                if (!isMore) setIsMore(review.id);
                else setIsMore(null);
              }}>
                {isMore != review.id ?`${review.review.substring(0,10)}...` : review.review}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default ReviewsTable;

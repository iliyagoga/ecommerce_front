import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';

const DashboardAnalytics: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', backgroundColor: '#2e2e2e', color: '#ffffff' }}>
            <CardHeader
              title="Топ-3 самых заказываемых товара"
              titleTypographyProps={{ variant: 'h6', color: '#ffffff' }}
            />
            <CardContent>
              <Typography variant="body1">1. Кальян Al Fakher (500 заказов)</Typography>
              <Typography variant="body1">2. Чайник чая (черный) (350 заказов)</Typography>
              <Typography variant="body1">3. Чипсы Lays (200 заказов)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', backgroundColor: '#2e2e2e', color: '#ffffff' }}>
            <CardHeader
              title="Популярность комнат"
              titleTypographyProps={{ variant: 'h6', color: '#ffffff' }}
            />
            <CardContent>
              <Typography variant="body1">1. VIP комната (80% бронирований)</Typography>
              <Typography variant="body1">2. Кинотеатр (60% бронирований)</Typography>
              <Typography variant="body1">3. Обычная комната (40% бронирований)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', backgroundColor: '#2e2e2e', color: '#ffffff' }}>
            <CardHeader
              title="Часы пиковой нагрузки"
              titleTypographyProps={{ variant: 'h6', color: '#ffffff' }}
            />
            <CardContent>
              <Typography variant="body1">С 19:00 до 22:00 (особенно по выходным)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', backgroundColor: '#2e2e2e', color: '#ffffff' }}>
            <CardHeader
              title="Общая выручка за месяц"
              titleTypographyProps={{ variant: 'h6', color: '#ffffff' }}
            />
            <CardContent>
              <Typography variant="h5">1,500,000 руб.</Typography>
              <Typography variant="body2">+10% по сравнению с предыдущим месяцем</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', backgroundColor: '#2e2e2e', color: '#ffffff' }}>
            <CardHeader
              title="Средний чек заказа"
              titleTypographyProps={{ variant: 'h6', color: '#ffffff' }}
            />
            <CardContent>
              <Typography variant="h5">2,500 руб.</Typography>
              <Typography variant="body2">-5% по сравнению с предыдущим месяцем</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAnalytics;

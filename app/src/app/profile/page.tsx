"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Container
} from '@mui/material';
import { User, Order } from '@/types';
import { getOrdersByUser, getCurrentUser } from '@/api';
import Header from '@/components/Header/Header';
import Loader from '@/components/Other/Loader';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #202020;
  min-height: 100vh;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #FCD25E;
`;

const Section = styled.div`
  background-color: #2C2C2C;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #FCD25E;
  border-bottom: 2px solid #FCD25E;
  padding-bottom: 10px;
`;

const StyledTableContainer = styled(TableContainer)`
  background-color: #2C2C2C;
  border-radius: 8px;
  border: 1px solid #444;
  
  .MuiTableHead-root {
    background-color: #333;
  }
  
  .MuiTableCell-head {
    color: #FCD25E;
    font-weight: bold;
    font-size: 1rem;
    border-bottom: 2px solid #FCD25E;
  }
  
  .MuiTableCell-body {
    color: white;
    border-bottom: 1px solid #444;
  }
  
  .MuiTableRow-root:hover {
    background-color: #333;
  }
`;

const ActionButton = styled.button`
  background-color: #FCD25E;
  color: black;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E0B44B;
  }
`;

const StatCard = styled.div`
  background-color: #2C2C2C;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #444;
  text-align: center;
  flex: 1;
  min-width: 150px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #FCD25E;
  margin: 10px 0;
`;

const StatLabel = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ccc;
  font-size: 1.1rem;
`;

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);

        if (userData?.id) {
          const userOrders = await getOrdersByUser();
          setOrders(userOrders);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleOrderClick = (orderId?: number) => {
    router.push(`/order/${orderId}`);
  };

  const getStatusStyle = (status: string) => {
    const baseStyle = {
      color: 'white',
      fontWeight: 'bold',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.8rem'
    };

    switch (status.toLowerCase()) {
      case 'completed':
        return { ...baseStyle, backgroundColor: '#28a745' };
      case 'pending':
        return { ...baseStyle, backgroundColor: '#ffc107' };
      case 'cancelled':
        return { ...baseStyle, backgroundColor: '#dc3545' };
      case 'processing':
        return { ...baseStyle, backgroundColor: '#17a2b8' };
      default:
        return { ...baseStyle, backgroundColor: '#6c757d' };
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numPrice) + ' руб.';
  };

  if (loading) return <Loader/>

  return (<>
    <Header/>
    <PageContainer>
      <Container maxWidth="lg">
        <Section>
          <Title>Мой профиль</Title>
          {user && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ color: '#FCD25E', mb: 1 }}>
                {user.name}
              </Typography>
              <Typography variant="h6" sx={{ color: '#ccc' }}>
                {user.email}
              </Typography>
            </Box>
          )}
        </Section>

        <Section>
          <SectionTitle>История заказов</SectionTitle>

          {orders.length === 0 ? (
            <EmptyMessage>
              У вас пока нет заказов
            </EmptyMessage>
          ) : (
            <StyledTableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="таблица заказов">
                <TableHead>
                  <TableRow>
                    <TableCell>Номер заказа</TableCell>
                    <TableCell>Дата создания</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Итоговая цена</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.order_id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: '#333' }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography sx={{ color: '#FCD25E', fontWeight: 'bold' }}>
                          #{order.order_id}
                        </Typography>
                      </TableCell>
    
                      <TableCell>
                        <span style={getStatusStyle(order.status)}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#FCD25E', fontWeight: 'bold' }}>
                          {formatPrice(order.total_price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ActionButton onClick={() => handleOrderClick(order.order_id)}>
                          Перейти
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}
        </Section>

        {orders.length > 0 && (
          <Section>
            <SectionTitle>Статистика заказов</SectionTitle>
            <StatsContainer>
              <StatCard>
                <StatLabel>Всего заказов</StatLabel>
                <StatValue>{orders.length}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Завершенные</StatLabel>
                <StatValue>
                  {orders.filter(order => order.status.toLowerCase() === 'completed').length}
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>В обработке</StatLabel>
                <StatValue>
                  {orders.filter(order => 
                    order.status.toLowerCase() === 'pending' || 
                    order.status.toLowerCase() === 'processing'
                  ).length}
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Общая сумма</StatLabel>
                <StatValue>
                  {formatPrice(orders.reduce((total, order) => {
                    const price = typeof order.total_price === 'string' ? 
                      parseFloat(order.total_price) : order.total_price;
                    return total + price;
                  }, 0))}
                </StatValue>
              </StatCard>
            </StatsContainer>
          </Section>
        )}
      </Container>
    </PageContainer>
    </>);
};

export default ProfilePage;
"use client"
import { Order,  OrderItem } from '@/types';
import { getOrderById, HOST_URL } from '@/api';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loader from '@/components/Other/Loader';
/*import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';*/

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

const OrderItemContainer = styled.div`
  display: flex;
  background-color: #2C2C2C;
  padding: 15px;
  gap: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: flex-start;
`;

const ProductItemContainer = styled.div`
  display: flex;
  background-color: #2C2C2C;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: center;
  gap: 20px;
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const RoomName = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #FCD25E;
`;

const ProductName = styled.h3`
  font-size: 1.3rem;
  margin: 0 0 10px 0;
  color: #FCD25E;
`;

const DetailText = styled.p`
  margin: 5px 0;
  font-size: 1rem;
`;

const PriceText = styled(DetailText)`
  font-weight: bold;
  color: #FCD25E;
`;

const Section = styled.div`
  background-color: #2C2C2C;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #FCD25E;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #ccc;
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #FCD25E;
  margin: 20px 0;
  text-align: right;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.8rem;
  margin-bottom: 10px;
  
  ${props => {
    switch (props.status.toLowerCase()) {
      case 'completed':
        return 'background-color: #28a745; color: white;';
      case 'pending':
        return 'background-color: #ffc107; color: black;';
      case 'cancelled':
        return 'background-color: #dc3545; color: white;';
      case 'processing':
        return 'background-color: #17a2b8; color: white;';
      default:
        return 'background-color: #6c757d; color: white;';
    }
  }}
`;

interface OrderDetailsPageProps {
  orderId: number;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = () => {
  const orderId = window.location.pathname.split('/')[2];
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const pathname = usePathname();

  const fetchOrderData = async (orderId: string) => {
    setLoading(true)
    const data = await getOrderById(Number(orderId));
    setOrder(data);
    setLoading(false)
  };

  useEffect(() => {
    fetchOrderData(window.location.pathname.split('/')[2]);
  }, [pathname]);

  const calculateProductTotal = (product: OrderItem) => {
    return product.quantity * parseFloat(product.unit_price.toString());
  };

  const calculateTotalPrice = () => {
    if (!order) return 0;
    
    let total = 0;
    
    if (order.order_rooms) {
      order.order_rooms.forEach(room => {
        total += room.booked_hours * parseFloat(room.room_price_per_hour.toString());
      });
    }
    
    if (order.order_items) {
      order.order_items.forEach(product => {
        total += calculateProductTotal(product);
      });
    }
    
    return total;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <Loader/>;
  }

  const orderRooms = order?.order_rooms || [];
  const orderItems = order?.order_items || [];

  return (
    <PageContainer>
      <Header />
      <Breadcrumbs items={[
        { label: 'Главная', href: '/' }, 
        { label: 'Профиль', href: '/profile' },
        { label: `Заказ #${orderId}`, href: '#' }
      ]} />
      
      <Title>Детали заказа #{orderId}</Title>

      {!order ? (
        <EmptyMessage>Заказ не найден</EmptyMessage>
      ) : (
        <>
          <Section>
            <SectionTitle>Информация о заказе</SectionTitle>
            <StatusBadge status={order.status}>
              {order.status}
            </StatusBadge>
            <DetailText>Дата создания: {formatDateTime(order.created_at ?? "")}</DetailText>
            <DetailText>Общая стоимость: {parseFloat(order.total_price.toString()).toFixed(2)} руб.</DetailText>
            {order.client_comment && (
              <DetailText>Комментарий клиента: {order.client_comment}</DetailText>
            )}
            {order.admin_comment && (
              <DetailText>Комментарий администратора: {order.admin_comment}</DetailText>
            )}
          </Section>

          <Section>
            <SectionTitle>Время бронирования</SectionTitle>
            <DetailText>Начало: {formatDateTime(order.start_time)}</DetailText>
            <DetailText>Окончание: {formatDateTime(order.end_time)}</DetailText>
            <DetailText>
              Продолжительность: {(
                (new Date(order.end_time).getTime() - new Date(order.start_time).getTime()) / 
                (1000 * 60 * 60)
              ).toFixed(1)} часов
            </DetailText>
          </Section>

          {orderRooms.length > 0 && (
            <Section>
              <SectionTitle>Забронированная комната</SectionTitle>
              {orderRooms.map((orderRoom) => (
                <OrderItemContainer key={orderRoom.order_room_id}>
                  {orderRoom.room?.preview_img && (
                    <Link href={`/room/${orderRoom.room_id}`}>
                      <ItemImage 
                        src={HOST_URL + orderRoom.room.preview_img} 
                        alt={orderRoom.room.name || 'Комната'} 
                      />
                    </Link>
                  )}
                  <ItemDetails>
                    <Link href={`/room/${orderRoom.room_id}`} style={{ textDecoration: 'none' }}>
                      <RoomName>{orderRoom.room?.name || 'Комната'}</RoomName>
                    </Link>
                    <DetailText>Дата бронирования: {formatDate(orderRoom.booked_date)}</DetailText>
                    <DetailText>Время начала: {formatTime(orderRoom.booked_time_start)}</DetailText>
                    <DetailText>Время окончания: {formatTime(orderRoom.booked_time_end)}</DetailText>
                    <DetailText>Кол-во часов: {orderRoom.booked_hours}</DetailText>
                    <DetailText>Цена за час: {orderRoom.room_price_per_hour} руб.</DetailText>
                    <PriceText>
                      Стоимость комнаты: {orderRoom.booked_hours * parseFloat(orderRoom.room_price_per_hour.toString())} руб.
                    </PriceText>
                  </ItemDetails>
                </OrderItemContainer>
              ))}
            </Section>
          )}

          {orderItems.length > 0 && (
            <Section>
              <SectionTitle>Товары в заказе</SectionTitle>
              {orderItems.map((item) => (
                <ProductItemContainer key={item.order_item_id}>
                  {item.menu_item?.image_url && (
                    <ItemImage 
                      src={item.menu_item.image_url.startsWith('http') 
                        ? item.menu_item.image_url 
                        : HOST_URL + item.menu_item.image_url} 
                      alt={item.menu_item.name} 
                    />
                  )}
                  <ItemDetails>
                    <ProductName>{item.menu_item?.name || `Товар #${item.item_id}`}</ProductName>
                    <DetailText>{item.menu_item?.description || 'Описание товара'}</DetailText>
                    <DetailText>Количество: {item.quantity}</DetailText>
                    <DetailText>Цена за единицу: {item.unit_price} руб.</DetailText>
                    <PriceText>Сумма за товар: {calculateProductTotal(item)} руб.</PriceText>
                  </ItemDetails>
                </ProductItemContainer>
              ))}
            </Section>
          )}

          <Section>
            <TotalPrice>Итого: {calculateTotalPrice()} руб.</TotalPrice>
          </Section>
        </>
      )}
    </PageContainer>
  );
};

export default OrderDetailsPage;

"use client"
import { Cart, CartRoom } from '@/types';
import { getCart, removeCartRoom, clearUserCart, updateCartRoom, HOST_URL } from '@/api';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const CartItemContainer = styled.div`
  display: flex;
  background-color: #2C2C2C;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: center;
`;

const RoomImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const RoomName = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #FCD25E;
`;

const DetailText = styled.p`
  margin: 5px 0;
  font-size: 1rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: #FCD25E;
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E0B44B;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    color: #343a40;
  }
`;

const EmptyCartMessage = styled.p`
  font-size: 1.2rem;
  color: #ccc;
`;

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError('Не удалось загрузить корзину.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleRemoveRoom = async (cartRoomId: number) => {
    try {
      await removeCartRoom(cartRoomId);
      alert('Комната удалена из корзины.');
      fetchCartData(); // Обновляем корзину
    } catch (err) {
      alert('Ошибка при удалении комнаты из корзины.');
      console.error(err);
    }
  };

  const handleUpdateRoom = async (cartRoomId: number, newBookedHours: number) => {
    try {
      await updateCartRoom(cartRoomId, { booked_hours: newBookedHours });
      alert('Время бронирования обновлено.');
      fetchCartData(); // Обновляем корзину
    } catch (err) {
      alert('Ошибка при обновлении комнаты в корзине.');
      console.error(err);
    }
  };

  const handleCheckout = () => {
    router.push('/order');
  };

  /*if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;*/

  const cartRooms = cart?.cart_rooms || [];

  return (
    <PageContainer>
      <Header />
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Корзина', href: '/cart' }]} />
      <Title>Ваша корзина</Title>

      {cartRooms.length === 0 ? (
        <EmptyCartMessage>Ваша корзина пуста.</EmptyCartMessage>
      ) : (
        <>
          {cartRooms.map((cartRoom) => (
            <CartItemContainer key={cartRoom.id}>
              {cartRoom.room?.preview_img && (
                <Link href={`/room/${cartRoom.room_id}`}>
                  <RoomImage src={HOST_URL + cartRoom.room.preview_img} alt={cartRoom.room.name || 'Комната'} />
                </Link>
              )}
              <ItemDetails>
                <Link href={`/room/${cartRoom.room_id}`} style={{ textDecoration: 'none' }}>
                  <RoomName>{cartRoom.room?.name || 'Комната'}</RoomName>
                </Link>
                <DetailText>Дата: {new Date(cartRoom.booked_date).toLocaleDateString('ru-RU')}</DetailText>
                <DetailText>Время: {cartRoom.booked_time_start} - {cartRoom.booked_time_end}</DetailText>
                <DetailText>Кол-во часов: {cartRoom.booked_hours}</DetailText>
                <DetailText>Цена за час: {cartRoom.room_price_per_hour} руб.</DetailText>
              </ItemDetails>
              <ActionsContainer>
                <ActionButton onClick={() => handleRemoveRoom(cartRoom.id as number)}>Удалить</ActionButton>
                {/* Здесь можно добавить функционал изменения, например, через модальное окно */}
              </ActionsContainer>
            </CartItemContainer>
          ))}
          <ActionButton onClick={handleCheckout} style={{ marginTop: '20px' }}>К оформлению заказа</ActionButton>
        </>
      )}
    </PageContainer>
  );
};

export default CartPage;

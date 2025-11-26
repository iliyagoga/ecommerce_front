"use client"
import { Cart, CartRoom, CartProduct } from '@/types';
import { getCart, removeCartRoom, clearUserCart, updateCartRoom, HOST_URL, createOrder } from '@/api';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { extractTimeFromDateString } from '@/other';
import Loader from '@/components/Other/Loader';
import { Alert } from '@mui/material';
import { AxiosError } from 'axios';
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

const TextArea = styled.textarea`
  width: 100%;
  background-color: #3C3C3C;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #FCD25E;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Input = styled.input`
  width: 100%;
  background-color: #3C3C3C;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FCD25E;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #FCD25E;
`;

const ActionButton = styled.button`
  background-color: #FCD25E;
  color: black;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 10px;

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

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #FCD25E;
  margin: 20px 0;
  text-align: right;
`;

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clientComment, setClientComment] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cart?.cart_rooms) return;
    const room = cart.cart_rooms[0];
    
    const items = cart.cart_menu_items?.map(item => ({
      item_id: item.item_id,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price.toString()),
      total_price: parseFloat(item.total_price.toString())
    })) || [];
  
    const orderData = {
      status: "pending",
      total_price: calculateTotalPrice(),
      client_comment: clientComment,
      admin_comment: "",
      room_id: room.room_id,
      booked_hours: room.booked_hours,
      booked_time_start: room.booked_time_start.replace(/\.\d+Z$/, ''),
      booked_time_end: room.booked_time_end.replace(/\.\d+Z$/, ''),
      room_price_per_hour: room.room_price_per_hour,
      items: items
    };
  
    try {
      setError(null);
      await createOrder(orderData);
      router.push('/catalog');
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Не удалось создать заказ, попробуйте позже");
    }
  };

  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateProductTotal = (product: CartProduct) => {
    return product.quantity * parseFloat(product.unit_price.toString());
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
    if (cart?.cart_rooms) {
      cart.cart_rooms.forEach(room => {
        total += room.booked_hours * parseFloat(room.room_price_per_hour.toString());
      });
    }
    
    if (cart?.cart_menu_items) {
      cart.cart_menu_items.forEach(product => {
        total += calculateProductTotal(product);
      });
    }
    
    return total;
  };

  if (loading) {
    return <Loader/>;
  }
  const cartRooms = cart?.cart_rooms || [];
  const cartProducts = cart?.cart_menu_items || [];

  return (
    <PageContainer>
      <Header />
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Корзина', href: '/cart' }]} />
      <Title>Оформление заказа</Title>

      {cartRooms.length === 0 ? (
        <EmptyCartMessage>Вы ничего не заказали</EmptyCartMessage>
      ) : (
        <>
          <Section>
            <SectionTitle>Забронированные комнаты</SectionTitle>
            {cartRooms.map((cartRoom) => (
              <CartItemContainer key={cartRoom.id}>
                {cartRoom.room?.preview_img && (
                  <Link href={`/room/${cartRoom.room_id}`}>
                    <ItemImage src={HOST_URL + cartRoom.room.preview_img} alt={cartRoom.room.name || 'Комната'} />
                  </Link>
                )}
                <ItemDetails>
                  <Link href={`/room/${cartRoom.room_id}`} style={{ textDecoration: 'none' }}>
                    <RoomName>{cartRoom.room?.name || 'Комната'}</RoomName>
                  </Link>
                  <DetailText>Дата: {extractTimeFromDateString(cartRoom.booked_time_start).date}</DetailText>
                  <DetailText>Время: {extractTimeFromDateString(cartRoom.booked_time_start).time} - {extractTimeFromDateString(cartRoom.booked_time_end).time}</DetailText>
                  <DetailText>Кол-во часов: {cartRoom.booked_hours}</DetailText>
                  <DetailText>Цена за час: {cartRoom.room_price_per_hour} руб.</DetailText>
                  <PriceText>
                    Стоимость комнаты: {cartRoom.booked_hours * parseFloat(cartRoom.room_price_per_hour.toString())} руб.
                  </PriceText>
                </ItemDetails>
              </CartItemContainer>
            ))}
          </Section>

          {cartProducts.length > 0 && (
            <Section>
              <SectionTitle>Товары в заказе</SectionTitle>
              {cartProducts.map((product) => (
                <ProductItemContainer key={product.cart_item_id}>
                  {product.menu_item?.image_url && (
                    <ItemImage 
                      src={product.menu_item.image_url.startsWith('http') 
                        ? product.menu_item.image_url 
                        : HOST_URL + product.menu_item.image_url} 
                      alt={product.menu_item.name} 
                    />
                  )}
                  <ItemDetails>
                    <ProductName>{product.menu_item?.name || 'Товар'}</ProductName>
                    <DetailText>{product.menu_item?.description || 'Описание товара'}</DetailText>
                    <DetailText>Количество: {product.quantity}</DetailText>
                    <DetailText>Цена за единицу: {product.unit_price} руб.</DetailText>
                    <PriceText>Сумма за товар: {calculateProductTotal(product)} руб.</PriceText>
                  </ItemDetails>
                </ProductItemContainer>
              ))}
            </Section>
          )}

          <Section>
            <TotalPrice>Итого: {calculateTotalPrice()} руб.</TotalPrice>
          </Section>

          <Section>
            <SectionTitle>Комментарий к заказу</SectionTitle>
            <FormGroup>
              <Label htmlFor="clientComment">Дополнительные пожелания (необязательно)</Label>
              <TextArea
                id="clientComment"
                value={clientComment}
                onChange={(e) => setClientComment(e.target.value)}
                placeholder="Укажите дополнительные пожелания по бронированию, особые требования или вопросы..."
                maxLength={500}
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Данные для оплаты</SectionTitle>
            <FormGroup>
              <Label htmlFor="cardNumber">Номер карты</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={paymentDetails.cardNumber}
                onChange={(e) => handlePaymentDetailChange('cardNumber', e.target.value)}
                maxLength={19}
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: '15px' }}>
              <FormGroup style={{ flex: 1 }}>
                <Label htmlFor="expiryDate">Срок действия</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="ММ/ГГ"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => handlePaymentDetailChange('expiryDate', e.target.value)}
                  maxLength={5}
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="000"
                  value={paymentDetails.cvv}
                  onChange={(e) => handlePaymentDetailChange('cvv', e.target.value)}
                  maxLength={3}
                />
              </FormGroup>
            </div>
            <FormGroup>
              <Label htmlFor="cardholderName">Имя владельца карты</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="IVAN IVANOV"
                value={paymentDetails.cardholderName}
                onChange={(e) => handlePaymentDetailChange('cardholderName', e.target.value)}
              />
            </FormGroup>
          </Section>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <ActionButton onClick={handleSubmit}>
            Подтвердить заказ • {calculateTotalPrice()} руб.
          </ActionButton>
        </>
      )}
    </PageContainer>
  );
};

export default OrderPage;
"use client"
import { Cart, CartProduct } from '@/types';
import { getCart, removeCartRoom, HOST_URL, checkRoomType, removeCartMenuItem, updateCartMenuItem, } from '@/api';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LinkStyled } from '@/components/Header/Items/Item.styled';
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

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin: 40px 0 20px 0;
  color: #FCD25E;
  border-bottom: 2px solid #FCD25E;
  padding-bottom: 10px;
`;

const CartItemContainer = styled.div`
  display: flex;
  background-color: #2C2C2C;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: center;
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

const RoomName = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #FCD25E;
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
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

const ItemName = styled.h3`
  font-size: 1.5rem;
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

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const QuantityButton = styled.button`
  background-color: #FCD25E;
  color: black;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #E0B44B;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 30px;
  text-align: center;
  background-color: #3C3C3C;
  border: 1px solid #555;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FCD25E;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
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

const RemoveButton = styled(ActionButton)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

const EmptyCartMessage = styled.p`
  font-size: 1.2rem;
  color: #ccc;
`;

const TotalSection = styled.div`
  background-color: #2C2C2C;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  text-align: right;
`;

const TotalText = styled.p`
  font-size: 1.5rem;
  color: #FCD25E;
  font-weight: bold;
  margin: 0;
`;

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  const router = useRouter();

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
      
      if (data?.cart_menu_items) {
        const initialQuantities: {[key: number]: number} = {};
        data.cart_menu_items.forEach((item: CartProduct) => {
          if (item.item_id) {
            initialQuantities[item.item_id] = item.quantity;
          }
        });
        setQuantities(initialQuantities);
      }
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

  useEffect(() => {
    const canAddToCart = async () => {
      try {
        const isCan = await checkRoomType();
        setIsAddingProducts(isCan);
      } catch (error) {
        setIsAddingProducts(false);
      }
    }

    canAddToCart();
  }, []);

  const handleRemoveRoom = async (cartRoomId: number) => {
    try {
      await removeCartRoom(cartRoomId);
      fetchCartData();
    } catch (err) {
      alert('Ошибка при удалении комнаты из корзины.');
      console.error(err);
    }
  };

  const handleRemoveProduct = async (cartItemId: number) => {
   try {
      await removeCartMenuItem(cartItemId);
      fetchCartData();
    } catch (err) {
      alert('Ошибка при удалении товара из корзины.');
      console.error(err);
    }
  };

  const handleUpdateProductQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartMenuItem(cartItemId, newQuantity);
      fetchCartData();
    } catch (err) {
      alert('Ошибка при обновлении количества товара.');
      console.error(err);
    }
  };

  const handleQuantityChange = (cartItemId: number, value: number) => {
    setQuantities(prev => ({ ...prev, [cartItemId]: value }));
  };

  const handleQuantityBlur = (cartItemId: number) => {
    const currentQuantity = quantities[cartItemId];
    if (currentQuantity && currentQuantity > 0) {
      handleUpdateProductQuantity(cartItemId, currentQuantity);
    }
  };

  const handleCheckout = () => {
    router.push('/order');
  };

  const calculateProductTotal = (product: CartProduct) => {
    return product.quantity * parseFloat(product.unit_price.toString());
  };

  const calculateCartTotal = () => {
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

  const cartRooms = cart?.cart_rooms || [];
  const cartProducts = cart?.cart_menu_items || [];

  if (loading) {
    return <Loader/>;
  }
  
  return (
    <PageContainer>
      <Header />
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Корзина', href: '/cart' }]} />
      <Title>Ваша корзина</Title>

      {cartRooms.length === 0 && cartProducts.length === 0 ? (
        <EmptyCartMessage>Ваша корзина пуста.</EmptyCartMessage>
      ) : (
        <>
          {cartRooms.length > 0 && (
            <>
              <SectionTitle>Забронированные комнаты</SectionTitle>
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
                <RemoveButton onClick={() => handleRemoveRoom(cartRoom.id as number)}>Удалить</RemoveButton>
              </ActionsContainer>
            </CartItemContainer>
              ))}
            </>
          )}

          {cartProducts.length > 0 && (
            <>
              <SectionTitle>Товары в корзине</SectionTitle>

              {cartProducts.map((product) => (
                <ProductItemContainer key={product.item_id}>
                  {product.menu_item?.image_url && (
                    <ItemImage 
                      src={product.menu_item.image_url.startsWith('http') 
                        ? product.menu_item.image_url 
                        : HOST_URL + product.menu_item.image_url} 
                      alt={product.menu_item.name} 
                    />
                  )}
                  <ItemDetails>
                    <ItemName>{product.menu_item?.name || 'Товар'}</ItemName>
                    <DetailText>{product.menu_item?.description || 'Описание товара'}</DetailText>
                    <PriceText>Цена за единицу: {product.unit_price} руб.</PriceText>
                    
                    <QuantityControls>
                      <QuantityButton 
                        onClick={() => handleUpdateProductQuantity(product.cart_item_id!, quantities[product.item_id!] - 1)}
                        disabled={quantities[product.item_id!] <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityInput
                        type="number"
                        min="1"
                        value={quantities[product.item_id!] || product.quantity}
                        onChange={(e) => handleQuantityChange(product.cart_item_id!, parseInt(e.target.value) || 1)}
                        onBlur={() => handleQuantityBlur(product.item_id!)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleQuantityBlur(product.item_id!);
                          }
                        }}
                      />
                      <QuantityButton 
                        onClick={() => handleUpdateProductQuantity(product.cart_item_id!, quantities[product.item_id!] + 1)}
                      >
                        +
                      </QuantityButton>
                    </QuantityControls>
                    
                    <PriceText>Сумма: {calculateProductTotal(product)} руб.</PriceText>
                  </ItemDetails>
                  <ActionsContainer>
                    <RemoveButton onClick={() => handleRemoveProduct(product.cart_item_id!)}>
                      Удалить
                    </RemoveButton>
                  </ActionsContainer>
                </ProductItemContainer>
              ))}
            </>
          )}

          <TotalSection>
            <TotalText>Общая сумма: {calculateCartTotal()} руб.</TotalText>
          </TotalSection>

          <DetailText>
            {isAddingProducts ?
            `Вы можете добавить товары в корзину ` :
            "При выборе этой комнаты вам не доступно добавление товаров в корзину и их заказ"}
            {isAddingProducts && <LinkStyled style={{fontSize: "1rem"}} href='/catalog'>Каталог</LinkStyled>}
          </DetailText>

          <ActionButton onClick={handleCheckout} style={{ marginTop: '20px' }}>
            К оформлению заказа
          </ActionButton>
        </>
      )}
    </PageContainer>
  );
};

export default CartPage;
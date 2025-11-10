"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Room, Product } from '@/types'; // Импортируем интерфейсы Room и Product
import Image from 'next/image';
import { getRooms, getProducts, HOST_URL } from '@/api'; // Импортируем getRooms и getProducts из API
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'; // Импортируем компонент Breadcrumbs
import { useRouter } from 'next/navigation';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: #202020;
  color: white;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #FCD25E;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const RoomCardContainer = styled.div`
  background-color: #2C2C2C;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 100%;
  max-width: 350px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RoomImage = styled(Image)`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RoomInfo = styled.div`
  gap: 15px;
  display: flex;
  justify-content: center;
`;

const RoomName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const ProductCardContainer = styled(RoomCardContainer)`
  /* Можно добавить специфичные стили для карточки товара, если нужно */
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  color: #FCD25E;
  margin-top: 0.5rem;
`;

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
    const router = useRouter();
    return (
        <RoomCardContainer onClick={() => router.push(`/room/${room.room_id}`)}>
            {room.preview_img && (
                <RoomImage src={`${HOST_URL}${room.preview_img}`} alt={room.name} width={300} height={200} />
            )}
            <RoomInfo>
                <RoomName>{room.name}</RoomName>
                <RoomName>{room.type?.toUpperCase()}</RoomName>
            </RoomInfo>
        </RoomCardContainer>
    );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <ProductCardContainer>
            {product.image_url && (
                <ProductImage src={`${HOST_URL}${product.image_url}`} alt={product.name} width={300} height={200} />
            )}
            <RoomInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price} руб.</ProductPrice>
            </RoomInfo>
        </ProductCardContainer>
    );
};

const CatalogPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCatalogData = async () => {
            try {
                const [roomsData, productsData] = await Promise.all([
                    getRooms(),
                    getProducts(),
                ]);
                setRooms(roomsData);
                setProducts(productsData);
            } catch (err) {
                setError('Не удалось загрузить данные каталога.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getCatalogData();
    }, []);

    if (loading) {
        return <PageContainer><Title>Загрузка комнат...</Title></PageContainer>;
    }

    if (error) {
        return <PageContainer><Title style={{ color: '#dc3545' }}>{error}</Title></PageContainer>;
    }

    return (<>
        <Header></Header>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог', href: '/catalog' }]} />
        <PageContainer>
            <Title>Каталог комнат</Title>
            <RoomsGrid>
                {rooms.map(room => (
                    <RoomCard key={room.room_id} room={room} />
                ))}
            </RoomsGrid>
            <Title>Каталог товаров</Title>
            <RoomsGrid>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </RoomsGrid>
        </PageContainer>
    </>
    );
};

export default CatalogPage;

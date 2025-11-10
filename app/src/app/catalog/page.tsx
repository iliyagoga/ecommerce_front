"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Room, Product, Category } from '@/types'; 
import Image from 'next/image';
import { getRooms, getProductsByCategory, getCategories, HOST_URL } from '@/api';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
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

const ProductCardContainer = styled(RoomCardContainer)``;

const ProductImage = styled(Image)`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  gap: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  color: white;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  color: #FCD25E;
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const CategoryButton = styled.button<{ $isActive: boolean }>`
  background-color: ${(props) => (props.$isActive ? '#FCD25E' : '#2C2C2C')};
  color: ${(props) => (props.$isActive ? '#2C2C2C' : 'white')};
  border: 1px solid #FCD25E;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #FCD25E;
    color: #2C2C2C;
  }
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
    const router = useRouter();
    return (
        <ProductCardContainer onClick={() => router.push(`/product/${product.item_id}`)}>
            {product.image_url && (
                <ProductImage src={`${HOST_URL}${product.image_url}`} alt={product.name} width={300} height={200} />
            )}
            <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price} руб.</ProductPrice>
            </ProductInfo>
        </ProductCardContainer>
    );
};

const CatalogPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Изменяем тип на number | null
    const [loadingRooms, setLoadingRooms] = useState(true); // Отдельное состояние загрузки для комнат
    const [loadingProducts, setLoadingProducts] = useState(true); // Отдельное состояние загрузки для продуктов
    const [errorRooms, setErrorRooms] = useState<string | null>(null); // Отдельное состояние ошибки для комнат
    const [errorProducts, setErrorProducts] = useState<string | null>(null); // Отдельное состояние ошибки для продуктов

    useEffect(() => {
        const getRoomsAndCategories = async () => {
            try {
                setLoadingRooms(true);
                const [roomsData, categoriesData] = await Promise.all([
                    getRooms(),
                    getCategories(),
                ]);
                setRooms(roomsData);
                setCategories(categoriesData);

                const productsData = await getProductsByCategory(selectedCategory ? String(selectedCategory) : undefined);
                setProducts(productsData.flat());
            } catch (err) {
                setErrorRooms('Не удалось загрузить комнаты или категории.');
                console.error(err);
            } finally {
                setLoadingRooms(false);
            }
        };
        getRoomsAndCategories();
    }, []); // Загружаем комнаты и категории только при первом рендеринге

    useEffect(() => {
        const getProductsData = async () => {
            try {
                setLoadingProducts(true);
                const productsData = await getProductsByCategory(selectedCategory ? String(selectedCategory) : undefined);
                setProducts(productsData.flat());
            } catch (err) {
                setErrorProducts('Не удалось загрузить товары.');
                console.error(err);
            } finally {
                setLoadingProducts(false);
            }
        };
        getProductsData();
    }, [selectedCategory]); // Загружаем товары при изменении выбранной категории

    const overallLoading = loadingRooms || loadingProducts;
    const overallError = errorRooms || errorProducts;

    if (overallLoading) {
        return <PageContainer><Title>Загрузка каталога...</Title></PageContainer>;
    }

    if (overallError) {
        return <PageContainer><Title style={{ color: '#dc3545' }}>{overallError}</Title></PageContainer>;
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
            <CategoryFilter>
                <CategoryButton
                    $isActive={selectedCategory === null}
                    onClick={() => setSelectedCategory(null)}
                >
                    Все товары
                </CategoryButton>
                {categories.map(category => (
                    <CategoryButton
                        key={category.category_id}
                        $isActive={selectedCategory === category.category_id}
                        onClick={() => setSelectedCategory(category.category_id)}
                    >
                        {category.name}
                    </CategoryButton>
                ))}
            </CategoryFilter>
            <RoomsGrid>
                {products.map(product => (
                    <ProductCard key={product.item_id} product={product} />
                ))}
            </RoomsGrid>
        </PageContainer>
    </>
    );
};

export default CatalogPage;

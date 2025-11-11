"use client"

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Header from "@/components/Header/Header";
import styled from "styled-components";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Product, Room } from "@/types";
import { getProducts, getRooms, HOST_URL } from "@/api";
import { useEffect, useState } from "react";
import FeaturesSection from "@/components/Other/FeatureSection";
import ContactSection from "@/components/Other/ContactSection";
import Map from "@/components/Other/Map";

const PageContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 5rem;
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

const DivContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

const Home = () => {

    const [rooms, setRooms] = useState<Room[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const getRoomsAndCategories = async () => {
            const roomsData = await getRooms();
            setRooms(roomsData);
        };

        const getProductsData = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData.flat());
            } catch (err) {
            }
        };

        getRoomsAndCategories();
        getProductsData();
    }, []);

    return (<>
        <Header></Header>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }]} />
        <PageContainer>
            <DivContainer>
                <Title>Наши комнаты</Title>
                <RoomsGrid>
                    {rooms.map(room => (
                        <RoomCard key={room.room_id} room={room} />
                    ))}
                </RoomsGrid>
            </DivContainer>

            <DivContainer>
                <Title>Наши товары</Title>
                <RoomsGrid>
                    {products.map(product => (
                        <ProductCard key={product.item_id} product={product} />
                    ))}
                </RoomsGrid>
            </DivContainer>

            <DivContainer>
                <FeaturesSection/>
            </DivContainer>

            <DivContainer>
                <Map/>
            </DivContainer>
            <DivContainer>
                <ContactSection/>
            </DivContainer>

        </PageContainer>
    </>
    );
}

export default Home;
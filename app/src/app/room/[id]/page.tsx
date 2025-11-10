"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { getRoomById, HOST_URL } from '@/api';
import { Room } from '@/types';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'; // Импортируем компонент Breadcrumbs
import { usePathname } from 'next/navigation';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: #202020;
  color: white;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

const RoomTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #FCD25E;
`;

const RoomDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const ImageCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 1rem;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #FCD25E;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #2C2C2C;
  }
`;

const CarouselImage = styled(Image)`
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const InfoSection = styled.div`
  background-color: #2C2C2C;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const SectionTitle = styled.h2`
  color: #FCD25E;
  margin-bottom: 1rem;
`;

const DescriptionText = styled.p`
  line-height: 1.6;
`;

const DetailItem = styled.p`
  margin-bottom: 0.5rem;
  span {
    font-weight: bold;
    color: #FCD25E;
  }
`;

const RoomDetailPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[2]
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(Number(id));
        if (roomData) {
          setRoom(roomData);
        } else {
          setError('Комната не найдена.');
        }
      } catch (err) {
        setError('Не удалось загрузить информацию о комнате.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [pathname]);

  if (loading) {
    return (<>
      <Header />
      <PageContainer><RoomTitle>Загрузка информации о комнате...</RoomTitle></PageContainer>
    </>);
  }

  if (error) {
    return (<>
      <Header />
      <PageContainer><RoomTitle style={{ color: '#dc3545' }}>{error}</RoomTitle></PageContainer>
    </>);
  }

  if (!room) {
    return (<>
      <Header />
      <PageContainer><RoomTitle style={{ color: '#dc3545' }}>Комната не найдена.</RoomTitle></PageContainer>
    </>);
  }

  const allImages = [
    room.preview_img,
    ...(room.gallery ? room.gallery.map(img => img.url || '') : []),
  ].filter(Boolean) as string[];

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Каталог', href: '/catalog' },
          { label: room.name, href: `/room/${room.room_id}` },
        ]}
      />
      <PageContainer>
        <RoomTitle>{room.name}</RoomTitle>
        <RoomDetailsWrapper>
          {allImages.length > 0 && (
            <InfoSection>
              <SectionTitle>Галерея</SectionTitle>
              <ImageCarousel>
                {allImages.map((imgUrl, index) => (
                  <CarouselImage
                    key={index}
                    src={`${HOST_URL}${imgUrl}`}
                    alt={`${room.name} image ${index + 1}`}
                    width={300}
                    height={200}
                  />
                ))}
              </ImageCarousel>
            </InfoSection>
          )}

          {room.description && (
            <InfoSection>
              <SectionTitle>Описание</SectionTitle>
              <DescriptionText>{room.description}</DescriptionText>
            </InfoSection>
          )}

          <InfoSection>
            <SectionTitle>Подробности</SectionTitle>
            <DetailItem><span>Тип комнаты:</span> {room.type?.toUpperCase()}</DetailItem>
            <DetailItem><span>Цена за час:</span> {room.base_hourly_rate} руб.</DetailItem>
            {room.initial_fee !== undefined && <DetailItem><span>Первоначальный взнос:</span> {room.initial_fee} руб.</DetailItem>}
            <DetailItem><span>Макс. количество человек:</span> {room.max_people}</DetailItem>
            <DetailItem><span>Доступность:</span> {room.is_available ? 'Да' : 'Нет'}</DetailItem>
          </InfoSection>
        </RoomDetailsWrapper>
      </PageContainer>
    </>
  );
};

export default RoomDetailPage;

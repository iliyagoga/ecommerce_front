"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getProductById, getCategories, HOST_URL, checkRoomType, addMenuItemToCart } from '@/api';
import { Product, Category } from '@/types';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Loader from '@/components/Other/Loader';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: #202020;
  color: white;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

const ProductTitle = styled.h1`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem auto;
  width: max-content;
  color: #FCD25E;
`;

const ProductDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const ProductImageStyled = styled(Image)`
  width: 100%;
  max-height: 400px;
  object-fit: contain; /* Изменено на contain, чтобы изображение не обрезалось */
  border-radius: 8px;
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

const CategoryTag = styled.span`
  background-color: #FCD25E;
  color: #2C2C2C;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-left: 1rem;
`;

const BookingButton = styled.button`
  background-color: #FCD25E;
  color: #202020;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #FFD700; /* Darker gold on hover */
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    color: #343a40;
  }
`;


const ProductDetailPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvaliable, setisAvaliable] = useState(false);

  const router = useRouter();

  const addToCart = async () => {
    if (!product || !product.item_id) return;

    try {
      const res = await addMenuItemToCart({
        item_id: product.item_id,
        quantity: 1,
        unit_price: product.price,
        total_price: product.price
      })
      if (res) router.push("/cart");
    } catch (error) {
      
    }
  }
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const productData = await getProductById(Number(id));
        if (productData) {
          setProduct(productData);
          if (productData.category_id) {
            const categories = await getCategories();
            const foundCategory = categories.find(cat => cat.category_id === productData.category_id);
            if (foundCategory) {
              setCategoryName(foundCategory.name);
            }
          }
        } else {
          setError('Продукт не найден.');
        }
      } catch (err) {
        setError('Не удалось загрузить информацию о продукте.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, pathname]);

  useEffect(() => {
    const canAddToCart = async () => {
      try {
        const isCan = await checkRoomType();
        if (!isCan) return;

        setisAvaliable(isCan)
      } catch (error) {
        setisAvaliable(false);
      }
    }

    canAddToCart();
  }, [id, pathname])

  if (loading) {
    return <Loader/>;
  }


  if (!product) {
    return (<>
      <Header />
      <PageContainer><ProductTitle style={{ color: '#dc3545' }}>Продукт не найден.</ProductTitle></PageContainer>
    </>);
  }

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Каталог', href: '/catalog' },
          { label: product.name, href: `/product/${product.item_id}` },
        ]}
      />
      <PageContainer>
        <ProductTitle>{product.name}{categoryName && <CategoryTag>{categoryName}</CategoryTag>}</ProductTitle>
        <ProductDetailsWrapper>
          {product.image_url && (
            <InfoSection>
              <SectionTitle>Изображение</SectionTitle>
              <ProductImageStyled
                src={`${HOST_URL}${product.image_url}`}
                alt={product.name}
                width={600}
                height={400}
              />
            </InfoSection>
          )}

          {product.description && (
            <InfoSection>
              <SectionTitle>Описание</SectionTitle>
              <DescriptionText>{product.description}</DescriptionText>
            </InfoSection>
          )}

          <InfoSection>
            <SectionTitle>Подробности</SectionTitle>
            <DetailItem><span>Цена:</span> {product.price} руб.</DetailItem>
            <DetailItem><span>Доступность:</span> {product.is_available ? 'Да' : 'Нет'}</DetailItem>
          </InfoSection>
          
          <BookingButton
              disabled={!isAvaliable}
              onClick={addToCart}
            >
              Добавить в корзину
            </BookingButton>
        </ProductDetailsWrapper>
      </PageContainer>
    </>
  );
};

export default ProductDetailPage;

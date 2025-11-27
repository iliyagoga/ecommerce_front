"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { createReview } from '@/api';
import Header from '@/components/Header/Header';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { Alert } from '@mui/material';

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

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #FCD25E;
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

const TextArea = styled.textarea`
  width: 100%;
  background-color: #3C3C3C;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: #FCD25E;
  }
  
  &::placeholder {
    color: #999;
  }
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

const ErrorMessage = styled.div`
  background-color: #dc3545;
  color: white;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  background-color: #28a745;
  color: white;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const CreateReviewPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const [value, setValue] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const orderId = window.location.pathname.split("/")[2]
    setError(null);
    try {
        await createReview(parseInt(orderId), value.trim());
        router.push('/profile');
    } catch (error) {
      setError(error.response.data.message)
    }
  };

  return (
    <PageContainer>
      <Header />
      <Breadcrumbs items={[
        { label: 'Главная', href: '/' },
        { label: 'Оставить отзыв', href: '#' }
      ]} />
      
      <Title>Оставить отзыв</Title>

      {error && <Alert severity='error'>{error}</Alert>}

        <Section>
          <SectionTitle>Ваш отзыв</SectionTitle>
          <FormGroup>
            <Label htmlFor="comment">Текст отзыва</Label>
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Поделитесь вашими впечатлениями о заказе, качестве обслуживания, комнатах и т.д."
            />
          </FormGroup>
        </Section>

        <ActionButton 
          type="submit" 
          disabled={value.trim().length < 10}
          onClick={handleSubmit}
        >
          'Отправить отзыв'
        </ActionButton>
    </PageContainer>
  );
};

export default CreateReviewPage;
// components/FeaturesSection.tsx
import React from 'react';
import { DrinksIcon, GamesIcon, SnacksIcon, MusicIcon } from "../../assets/icons/Icons";
import styled from 'styled-components';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  href?: string;
  icon: React.FC<{ size?: number; color?: string }>;
}

const Section = styled.section`

`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 62px;
  color: #fcd25e;
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
  
  @media (max-width: 960px) {
    font-size: 48px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #ffffff;
  text-align: center;
  max-width: 560px;
  margin: 0 auto 105px;
  line-height: 1.6;
  
  @media (max-width: 960px) {
    margin-bottom: 45px;
    font-size: 1.1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div<{ clickable?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: transform 0.3s ease;

  &:hover {
    transform: ${props => props.clickable ? 'translateY(-5px)' : 'none'};
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3<{ clickable?: boolean }>`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 15px;
  font-weight: 600;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: #fcd25e;
    }
  }
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: #ffffff;
  line-height: 1.5;
  opacity: 0.9;
`;

const FeaturesSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      id: 1,
      title: 'Напитки',
      description: 'Приходите попробовать наш широкий выбор напитков, авторских лимонадов, коктейлей, кофе и чая',
      icon: DrinksIcon
    },
    {
      id: 2,
      title: 'Игры',
      description: 'Играйте в наш широкий выбор игр, любимых классических настольных игр или файтингов и захватывающих игр на приставках',
      icon: GamesIcon
    },
    {
      id: 3,
      title: 'Закуски',
      description: 'Попробуйте наши удивительные блюда из меню. Наша кухня открыта каждый вечер до закрытия.',
      icon: SnacksIcon
    },
    {
      id: 4,
      title: 'Музыка',
      description: 'Слушайте хиты 80-х, 90-х и 2000-х годов, играя в свою любимую игру.',
      icon: MusicIcon
    }
  ];

  const FeatureIcon: React.FC<{ icon: FeatureItem['icon'] }> = ({ icon: Icon }) => (
    <IconWrapper>
      <Icon size={80} color="#FCD25E" />
    </IconWrapper>
  );

  return (
    <Section>
      <Container>
        <SectionTitle>ЗАГЛЯНИТЕ К НАМ!</SectionTitle>
        <SectionDescription>
          Приходите к нам, чтобы отлично провести время и вновь пережить воспоминания детства в аркадном кафе Арка.
        </SectionDescription>
        
        <FeaturesGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.id}>
              <FeatureIcon icon={feature.icon} />
              <FeatureTitle clickable={!!feature.href}> {feature.title}</FeatureTitle>
              <FeatureDescription>
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Container>
    </Section>
  );
};

export default FeaturesSection;
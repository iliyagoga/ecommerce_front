// components/ContactSection.tsx
import React from 'react';
import styled from 'styled-components';
import { TelegramIcon, VkIcon, InstagramIcon } from "../../assets/icons/Icons";

const ContactsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactsContent = styled.div`
  padding: 60px 40px;
  max-width: 400px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 30px;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #ffffff;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Text = styled.p`
  font-size: 0.875rem;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.8;
  opacity: 0.9;
`;

const SocialLinks = styled.ul`
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SocialLinkItem = styled.li`
  display: inline-block;
`;

const SocialLink = styled.a`
  display: block;
  width: 30px;
  height: 30px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

interface ContactSectionProps {
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ className }) => {
  return (
    <ContactsContainer className={className}>
      <ContactsContent>
        <Title>Московская 56, Саратов, Россия</Title>
        
        <Description>
          +7 995 640 56 56<br />
          arca.saratov@gmail.com
        </Description>
        
        <Text>
          Часы работы:<br />
          Воскресенье-четверг: с 12:00 до 23:00<br />
          Пятница-суббота: с 12:00 до 02:00
        </Text>
        
        <SocialLinks aria-label="Социальные сети">
          <SocialLinkItem>
            <SocialLink 
              href="https://t.me/arca_saratov" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Telegram"
              title="Telegram"
            >
              <TelegramIcon />
            </SocialLink>
          </SocialLinkItem>
          
          <SocialLinkItem>
            <SocialLink 
              href="https://vk.com/arca_saratov" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="VK"
              title="VK"
            >
              <VkIcon />
            </SocialLink>
          </SocialLinkItem>
          
          <SocialLinkItem>
            <SocialLink 
              href="https://www.instagram.com/arca_saratov/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <InstagramIcon />
            </SocialLink>
          </SocialLinkItem>
        </SocialLinks>
      </ContactsContent>
    </ContactsContainer>
  );
};

export default ContactSection;
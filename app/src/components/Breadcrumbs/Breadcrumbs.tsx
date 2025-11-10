import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const BreadcrumbsContainer = styled.nav`
  padding: 1rem 2rem;
  background-color: #202020;
  color: white;
  font-family: Arial, sans-serif;
  border-bottom: 1px solid #333;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:not(:last-child)::after {
    content: '/';
    margin: 0 0.5rem;
    color: #FCD25E;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #FCD25E;
  }
`;

const CurrentPage = styled.span`
  color: #FCD25E;
  font-weight: bold;
`;

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <BreadcrumbsContainer>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index < items.length - 1 ? (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            ) : (
              <CurrentPage>{item.label}</CurrentPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;

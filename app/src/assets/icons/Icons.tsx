// components/Icons.tsx
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const DrinksIcon: React.FC<IconProps> = ({ size = 60, color = '#FCD25E' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <path d="M30 5V55M15 15H45M15 25H45M15 35H45M15 45H45" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="30" cy="10" r="5" fill={color}/>
  </svg>
);

export const GamesIcon: React.FC<IconProps> = ({ size = 60, color = '#FCD25E' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <rect x="10" y="10" width="40" height="40" rx="8" stroke={color} strokeWidth="3"/>
    <circle cx="25" cy="25" r="3" fill={color}/>
    <circle cx="35" cy="25" r="3" fill={color}/>
    <path d="M20 35H40" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 40L30 35" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const SnacksIcon: React.FC<IconProps> = ({ size = 60, color = '#FCD25E' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <path d="M15 20L25 15L35 20L45 15V40L35 45L25 40L15 45V20Z" stroke={color} strokeWidth="3"/>
    <path d="M25 15V40M35 15V40" stroke={color} strokeWidth="3"/>
    <path d="M15 20L45 20" stroke={color} strokeWidth="3"/>
    <path d="M15 40L45 40" stroke={color} strokeWidth="3"/>
  </svg>
);

export const MusicIcon: React.FC<IconProps> = ({ size = 60, color = '#FCD25E' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <path d="M20 40V20L40 15V35" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="20" cy="40" r="8" stroke={color} strokeWidth="3"/>
    <circle cx="40" cy="35" r="8" stroke={color} strokeWidth="3"/>
    <path d="M20 32L40 27" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const TelegramIcon = () => (
  <svg viewBox="0 0 100 100" fill="none">
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z" 
      fill="#fcd25e"
    />
  </svg>
);

export const VkIcon = () => (
  <svg viewBox="0 0 100 100" fill="none">
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50ZM25 34c.406 19.488 10.15 31.2 27.233 31.2h.968V54.05c6.278.625 11.024 5.216 12.93 11.15H75c-2.436-8.87-8.838-13.773-12.836-15.647C66.162 47.242 71.783 41.62 73.126 34h-8.058c-1.749 6.184-6.932 11.805-11.867 12.336V34h-8.057v21.611C40.147 54.362 33.838 48.304 33.556 34H25Z" 
      fill="#fcd25e"
    />
  </svg>
);

export const InstagramIcon = () => (
  <svg viewBox="0 0 100 100" fill="none">
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM25 39.3918C25 31.4558 31.4566 25 39.3918 25H60.6082C68.5442 25 75 31.4566 75 39.3918V60.8028C75 68.738 68.5442 75.1946 60.6082 75.1946H39.3918C31.4558 75.1946 25 68.738 25 60.8028V39.3918ZM36.9883 50.0054C36.9883 42.8847 42.8438 37.0922 50.0397 37.0922C57.2356 37.0922 63.0911 42.8847 63.0911 50.0054C63.0911 57.1252 57.2356 62.9177 50.0397 62.9177C42.843 62.9177 36.9883 57.1252 36.9883 50.0054ZM41.7422 50.0054C41.7422 54.5033 45.4641 58.1638 50.0397 58.1638C54.6153 58.1638 58.3372 54.5041 58.3372 50.0054C58.3372 45.5066 54.6145 41.8469 50.0397 41.8469C45.4641 41.8469 41.7422 45.5066 41.7422 50.0054ZM63.3248 39.6355C65.0208 39.6355 66.3956 38.2606 66.3956 36.5646C66.3956 34.8687 65.0208 33.4938 63.3248 33.4938C61.6288 33.4938 60.2539 34.8687 60.2539 36.5646C60.2539 38.2606 61.6288 39.6355 63.3248 39.6355Z" 
      fill="#fcd25e"
    />
  </svg>
);
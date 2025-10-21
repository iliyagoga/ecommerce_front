"use client"
import React, { ReactNode } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './Sidebar';
import { styled } from 'styled-components';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const StyledMainContent = styled(Box)`
  flex-grow: 1;
  padding: 24px;
  background-color: #121212;
  color: #ffffff;
  min-height: 100vh;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <StyledMainContent component="main">
          {children}
        </StyledMainContent>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;

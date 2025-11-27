import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
/*import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';*/
import Link from 'next/link';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const menuItems = [
    { text: 'Комнаты', path: '/admin/rooms' },
    { text: 'Товары', path: '/admin/products' },
    { text: 'Категории', path: '/admin/categories' },
    { text: 'Заказы',  path: '/admin/orders' },
    { text: 'Залы',  path: '/admin/halls-management' },
    { text: 'Отзывы',  path: '/admin/reviews' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Админ Панель
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} key={item.text} passHref>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={item.text} sx={{color: "white"}}/>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  ImageList,
  ImageListItem
} from '@mui/material';
/*import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';*/
import { Room } from '@/types';
import { HOST_URL } from '@/api';

interface RoomViewSidebarProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
}

const RoomViewSidebar: React.FC<RoomViewSidebarProps> = ({ open, onClose, room }) => {
  if (!room) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 400,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 400,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Детали Комнаты: {room.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          Х
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#444' }} />
      <Box sx={{ p: 2 }}>
        {room.preview_img && (
          <Box sx={{ mb: 2 }}>
            <img src={`${HOST_URL}${room.preview_img}`} alt={room.name} style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        )}

        <List dense>
          <ListItem>
            <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
            <ListItemText primary={`Цена за час: ${room.base_hourly_rate} руб.`} />
          </ListItem>
          {room.initial_fee !== undefined && room.initial_fee > 0 && (
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Первоначальный взнос: ${room.initial_fee} руб.`} />
            </ListItem>
          )}
          <ListItem>
            <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
            <ListItemText primary={`Макс. человек: ${room.max_people}`} />
          </ListItem>
          {room.description && (
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Описание: ${room.description}`} />
            </ListItem>
          )}
          {room.type && (
            <ListItem>
              <ListItemIcon sx={{ color: '#ffffff' }}></ListItemIcon>
              <ListItemText primary={`Тип комнаты: ${room.type}`} />
            </ListItem>
          )}
        </List>

        {room.gallery && room.gallery.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Галерея:</Typography>
            <ImageList cols={2} rowHeight={164}>
              {room.gallery.map((item) => (
                <ImageListItem key={item.img_id || item.url}>
                  <img
                    srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format 1x,
                            ${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                    alt={`Изображение ${room.name}`}
                    loading="lazy"
                    style={{ borderRadius: '4px' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default RoomViewSidebar;

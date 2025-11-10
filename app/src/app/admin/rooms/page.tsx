"use client"
import React, { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import RoomsTable from '../../../components/Room/RoomsTable';
import RoomViewSidebar from '../../../components/Room/RoomViewSidebar';
import RoomEditSidebar from '../../../components/Room/RoomEditSidebar';
import AddRoomModal from '../../../components/Room/AddRoomModal'; // Импорт
import { Room } from '../../../types';

const RoomsPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const roomsTableRef = useRef<{ fetchRooms: () => void }>(null);

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsViewOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    console.log(room)
    setSelectedRoom(room);
    setIsEditOpen(true);
  };

  const handleAddRoom = () => {
    setIsAddOpen(true);
  };

  const handleSaveSuccess = () => {
    if (roomsTableRef.current) {
      roomsTableRef.current.fetchRooms();
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Комнатами
          </Typography>
          <Button variant="contained" onClick={handleAddRoom}>
            Добавить Комнату
          </Button>
        </Box>
        <RoomsTable onView={handleViewRoom} onEdit={handleEditRoom} />

        <RoomViewSidebar open={isViewOpen} onClose={() => setIsViewOpen(false)} room={selectedRoom} />
        <RoomEditSidebar open={isEditOpen} onClose={() => setIsEditOpen(false)} room={selectedRoom} onSaveSuccess={handleSaveSuccess} />
        <AddRoomModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onSaveSuccess={handleSaveSuccess} />

      </Box>
    </Layout>
  );
};

export default RoomsPage;

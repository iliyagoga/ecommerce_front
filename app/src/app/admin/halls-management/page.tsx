"use client"
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { Typography, Box, Button } from '@mui/material';
import HallsTableNew from '@/components/Halls/HallsTableNew';
import HallAddModal from '@/components/Halls/HallAddModal';
import HallEditSidebar from '@/components/Halls/HallEditSidebar';
import HallsAdmin from '@/components/Halls/HallsAdmin';
import { HallNew } from '@/types';

const HallsManagementPage: React.FC = () => {
  const [selectedHall, setSelectedHall] = useState<HallNew | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [editingHallId, setEditingHallId] = useState<number | null>(null);
  const hallsTableRef = useRef<{ fetchHalls: () => void }>(null);

  const handleEditHall = (hall: HallNew) => {
    setSelectedHall(hall);
    setIsEditOpen(true);
  };

  const handleAddHall = () => {
    setIsAddOpen(true);
  };

  const handleOpenHallEditor = (hallId: number) => {
    setEditingHallId(hallId);
  };

  const handleCloseHallEditor = () => {
    setEditingHallId(null);
    if (hallsTableRef.current) {
      hallsTableRef.current.fetchHalls();
    }
  };

  const handleSaveSuccess = () => {
    if (hallsTableRef.current) {
      hallsTableRef.current.fetchHalls();
    }
  };

  if (editingHallId) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Button onClick={handleCloseHallEditor} variant="contained" sx={{ mb: 2 }}>
            Назад к Залам
          </Button>
          <Typography variant="h4" gutterBottom>
            Редактор Зала: {selectedHall?.name}
          </Typography>
          <HallsAdmin hallId={editingHallId} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление Залами
          </Typography>
          <Button variant="contained" onClick={handleAddHall}>
            Добавить Зал
          </Button>
        </Box>
        <HallsTableNew onEdit={handleEditHall} onOpenEditor={handleOpenHallEditor} ref={hallsTableRef} />

        <HallEditSidebar open={isEditOpen} onClose={() => setIsEditOpen(false)} hall={selectedHall} onSaveSuccess={handleSaveSuccess} />
        <HallAddModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onSaveSuccess={handleSaveSuccess} />
      </Box>
    </Layout>
  );
};

export default HallsManagementPage;

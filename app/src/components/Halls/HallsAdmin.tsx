declare module 'd3';

"use client"
import React, { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { Room, HallRoomNew } from '@/types';
import { getHallRoomsNew, createHallRoomNew, updateHallRoomNew, deleteHallRoomNew, getRooms } from '@/api';

interface HallData {
  width: number;
  height: number;
}

interface RoomData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
  type: 'vip' | 'standard' | 'cinema' | null;
  hall_room_id?: number;
  dbRoomId?: number | null;
}

interface HallsAdminProps {
  hallId: number;
}

const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  background-color: #2C2C2C;
  border-bottom: 1px solid #FCD25E;
  justify-content: center;
  align-items: center;
`;

const ToolbarButton = styled.button<{ $color?: string }>`
  background-color: ${(props) => props.$color || '#FCD25E'};
  color: ${(props) => (props.$color === '#FCD25E' ? '#2C2C2C' : 'white')};
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const JsonOutputContainer = styled.div`
  background-color: #2C2C2C;
  border: 1px solid #FCD25E;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const JsonOutputTitle = styled.h3`
  color: #FCD25E;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const JsonPre = styled.pre`
  background-color: #333;
  color: #eee;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.85rem;
`;

const HallsAdmin: React.FC<HallsAdminProps> = ({ hallId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const hall: HallData = { width: 1000, height: 600 };
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [availableDbRooms, setAvailableDbRooms] = useState<Room[]>([]);
  const [selectedAssignedDbRoomId, setSelectedAssignedDbRoomId] = useState<number | null | undefined>(null);

  const usedRoomIds = useMemo(() => {
    return rooms.filter(room => room.dbRoomId !== undefined).map(room => room.dbRoomId as number);
  }, [rooms]);


  useEffect(() => {
    const fetchHallRooms = async () => {
      try {
        const fetchedRooms = await getHallRoomsNew(hallId);
        setRooms(fetchedRooms.map(room => ({
          id: `room-${room.id}`,
          x: room.x,
          y: room.y,
          width: room.width,
          height: room.height,
          color: room.color,
          name: room.name,
          type: JSON.parse(room.metadata) !== null ? JSON.parse(room.metadata).type : null,
          hall_room_id: room.id,
          dbRoomId: room.room_id,
        })));
       
      } catch (error) {
        console.error("Ошибка при загрузке комнат зала:", error);
      }
    };
    fetchHallRooms();
  }, [hallId]);

  useEffect(() => {
    const fetchAvailableDbRooms = async () => {
      try {
        const roomsFromDb = await getRooms();
        setAvailableDbRooms(roomsFromDb);
      } catch (error) {
        console.error("Ошибка при загрузке доступных комнат:", error);
      }
    };
    fetchAvailableDbRooms();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append('rect')
      .attr('width', hall.width)
      .attr('height', hall.height)
      .attr('fill', '#333')
      .attr('stroke', '#FCD25E');

    const roomElements = svg.selectAll<SVGGElement, RoomData>('.room')
      .data(rooms, (d: RoomData) => d.id)
      .join(
        enter => enter.append('g')
          .attr('class', 'room')
          .attr('transform', (d: RoomData) => `translate(${d.x}, ${d.y})`)
          .on('click', function(event: MouseEvent, d: RoomData) {
            d3.selectAll<SVGRectElement, RoomData>('.room rect').attr('stroke', '#000').attr('stroke-width', 1);
            d3.select(this).select('rect').attr('stroke', '#FCD25E').attr('stroke-width', 3);
            setSelectedRoomId(d.id);
            setSelectedAssignedDbRoomId(d.dbRoomId);
          })
          .call(d3.drag<SVGGElement, RoomData>()
            .on('start', function(event, d) {
              d3.select(this).raise().attr("stroke", "black");
            })
            .on('drag', function(event, d) {
              d3.select(this)
                .attr('transform', `translate(${d.x = event.x}, ${d.y = event.y})`);
              setRooms(prevRooms => prevRooms.map(room => room.id === d.id ? { ...room, x: d.x, y: d.y } : room));
            })
            .on('end', async function(event, d) {
              d3.select(this).attr("stroke", null);
              if (d.hall_room_id) {
                try {
                  await updateHallRoomNew(hallId, d.hall_room_id, { x: d.x, y: d.y });
                } catch (error) {
                  console.error("Ошибка при обновлении координат комнаты зала:", error);
                }
              }
            })
          ),
        update => update.attr('transform', (d: RoomData) => `translate(${d.x}, ${d.y})`),
        exit => exit.remove()
      );

    roomElements.append('rect')
      .attr('width', (d: RoomData) => d.width)
      .attr('height', (d: RoomData) => d.height)
      .attr('fill', (d: RoomData) => d.color)
      .attr('stroke', (d: RoomData) => d.id === selectedRoomId ? '#FCD25E' : '#000')
      .attr('stroke-width', (d: RoomData) => d.id === selectedRoomId ? 3 : 1);

    roomElements.append('text')
      .text((d: RoomData) => d.name)
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', 'white')
      .style('pointer-events', 'none');

  }, [hall, rooms, selectedRoomId]);

  const addSquare = () => {
    const newRoom: RoomData = {
      id: `temp-room-${Date.now()}`,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      color: '#888',
      name: 'Новый квадрат',
      type: null,
      dbRoomId: null,
      hall_room_id: undefined,
    };
    setRooms(prevRooms => [...prevRooms, newRoom]);
  };

  const assignRoomToSelectedSquare = async (selectedRoomIdFromDb: number | null | undefined) => {
    if (!selectedRoomId || selectedRoomIdFromDb === null || selectedRoomIdFromDb === undefined) return;

    const roomToAssign = availableDbRooms.find(room => room.room_id === selectedRoomIdFromDb);
    if (!roomToAssign) return;

    const currentRoom = rooms.find(room => room.id === selectedRoomId);
    if (!currentRoom) return;

    let color = '#888';
    if (roomToAssign.type === 'vip') { color = 'orange'; }
    else if (roomToAssign.type === 'cinema') { color = 'blue'; }

    const updatedRoomData: RoomData = {
      ...currentRoom,
      name: roomToAssign.name,
      color: color,
      type: roomToAssign.type || null,
      dbRoomId: roomToAssign.room_id,
    };

    if (!currentRoom.hall_room_id) {
      const newHallRoom: Omit<HallRoomNew, 'id' | 'hall_id'> & { room_id?: number | null } = {
        name: updatedRoomData.name,
        x: updatedRoomData.x,
        y: updatedRoomData.y,
        width: updatedRoomData.width,
        height: updatedRoomData.height,
        color: updatedRoomData.color,
        metadata: { type: updatedRoomData.type },
        room_id: updatedRoomData.dbRoomId,
      };
      try {
        const createdRoom = await createHallRoomNew(hallId, newHallRoom);
        setRooms(prevRooms => prevRooms.map(room =>
          room.id === selectedRoomId
            ? {
                ...updatedRoomData,
                id: `room-${createdRoom.id}`,
                hall_room_id: createdRoom.id,
                dbRoomId: createdRoom.room_id,
              }
            : room
        ));
        setSelectedAssignedDbRoomId(createdRoom.room_id);
      } catch (error) {
        console.error("Ошибка при создании комнаты зала:", error);
      }
    } else {
      const updatedProps: Partial<HallRoomNew> = {
        name: updatedRoomData.name,
        color: updatedRoomData.color,
        metadata: { type: updatedRoomData.type },
        room_id: updatedRoomData.dbRoomId,
      };

      try {
        const updatedRoomFromDb = await updateHallRoomNew(hallId, currentRoom.hall_room_id, updatedProps);
        setRooms(prevRooms => prevRooms.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                ...updatedRoomFromDb,
                id: `room-${updatedRoomFromDb.id}`,
                type: updatedRoomFromDb.metadata?.type || null,
                hall_room_id: updatedRoomFromDb.id,
                dbRoomId: updatedRoomFromDb.room_id,
              }
            : room
        ));
        setSelectedAssignedDbRoomId(updatedRoomFromDb.room_id);
      } catch (error) {
        console.error("Ошибка при обновлении комнаты зала:", error);
      }
    }
  };

  const deleteSelected = async () => {
    if (!selectedRoomId) return;

    const roomToDelete = rooms.find(room => room.id === selectedRoomId);
    if (!roomToDelete) return;

    if (roomToDelete.hall_room_id) {
      try {
        await deleteHallRoomNew(hallId, roomToDelete.hall_room_id);
        setRooms(prevRooms => prevRooms.filter(room => room.id !== selectedRoomId));
        setSelectedRoomId(null);
        setSelectedAssignedDbRoomId(null);
      } catch (error) {
        console.error("Ошибка при удалении комнаты зала:", error);
      }
    } else {
      setRooms(prevRooms => prevRooms.filter(room => room.id !== selectedRoomId));
      setSelectedRoomId(null);
      setSelectedAssignedDbRoomId(null);
    }
  };

  return (
    <div>
      <ToolbarContainer>
        <ToolbarButton onClick={addSquare} $color="#888" disabled={rooms.length >= availableDbRooms.length}>Добавить квадрат</ToolbarButton>

        <select
          value={selectedAssignedDbRoomId || ''}
          onChange={(e) => assignRoomToSelectedSquare(Number(e.target.value))}
          disabled={!selectedRoomId}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #FCD25E', backgroundColor: '#333', color: 'white' }}
        >
          <option value="">Выбрать комнату</option>
          {availableDbRooms.map(room => (
            <option 
              key={room.room_id}
              value={room.room_id}
              disabled={usedRoomIds.includes(room.room_id as number) && room.room_id !== selectedAssignedDbRoomId}
            >
              {room.name}
            </option>
          ))}
        </select>
        
        <ToolbarButton onClick={deleteSelected} $color="#dc3545">Удалить</ToolbarButton>
      </ToolbarContainer>
      <svg ref={svgRef} width={hall.width} height={hall.height}></svg>
    </div>
  );
};

export default HallsAdmin;

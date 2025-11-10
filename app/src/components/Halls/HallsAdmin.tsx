declare module 'd3';

"use client"
import React, { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { Room, HallRoomNew } from '@/types'; // Import HallRoomNew, and Room
import { getHallRoomsNew, createHallRoomNew, updateHallRoomNew, deleteHallRoomNew, getRooms } from '@/api'; // Import new API functions and getRooms

interface HallData {
  width: number;
  height: number;
  svg_background?: string;
}

interface RoomData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
  type: 'vip' | 'standard' | 'cinema' | null; // Allow null for initially undefined type
  hall_room_id?: number; // New field to store the actual ID from the backend
  dbRoomId?: number; // Add this back to link to the original Room id
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
  const [hall, setHall] = useState<HallData>({ width: 1000, height: 600 });
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [exportedJson, setExportedJson] = useState<string | null>(null);
  const [availableDbRooms, setAvailableDbRooms] = useState<Room[]>([]); // New state for full Room objects from DB
  const [selectedAssignedDbRoomId, setSelectedAssignedDbRoomId] = useState<number | null | undefined>(null); // State for selected DB room ID to assign

  const usedRoomIds = useMemo(() => {
    return rooms.filter(room => room.dbRoomId !== undefined).map(room => room.dbRoomId as number);
  }, [rooms]);

  // Effect to fetch hall rooms (HallRoomNew) from the backend
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
          dbRoomId: room.room_id, // Map the room_id from HallRoomNew to dbRoomId
        })));
       
      } catch (error) {
        console.error("Ошибка при загрузке комнат зала:", error);
      }
    };
    fetchHallRooms();
  }, [hallId]); // Refetch when hallId changes

  // Effect to fetch all available rooms (Room) from the database
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
      .attr('fill', '#333') // Фон холста
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
            setSelectedAssignedDbRoomId(d.dbRoomId); // Set selected DB room ID when square is selected
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
      .style('pointer-events', 'none'); // Чтобы клики проходили на rect

  }, [hall, rooms, selectedRoomId]);

  const addSquare = async () => {
    if (rooms.length >= availableDbRooms.length) return; // Disable if all rooms are used

    const newHallRoom: Omit<HallRoomNew, 'id' | 'hall_id'> = {
      name: 'Квадрат',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      color: '#888',
      metadata: null,
      room_id: undefined, // Initially no room assigned
    };
    try {
      const createdRoom = await createHallRoomNew(hallId, newHallRoom);
      setRooms(prevRooms => [
        ...prevRooms,
        {
          id: `room-${createdRoom.id}`,
          x: createdRoom.x,
          y: createdRoom.y,
          width: createdRoom.width,
          height: createdRoom.height,
          color: createdRoom.color,
          name: createdRoom.name,
          type: createdRoom.metadata?.type || null,
          hall_room_id: createdRoom.id,
          dbRoomId: createdRoom.room_id, // Map the room_id from HallRoomNew to dbRoomId
        },
      ]);
    } catch (error) {
      console.error("Ошибка при создании комнаты зала:", error);
    }
  };

  const assignRoomToSelectedSquare = async (selectedRoomIdFromDb: number | null | undefined) => {
    if (!selectedRoomId || selectedRoomIdFromDb === null || selectedRoomIdFromDb === undefined) return;

    const roomToAssign = availableDbRooms.find(room => room.room_id === selectedRoomIdFromDb);
    if (!roomToAssign) return;

    const currentRoom = rooms.find(room => room.id === selectedRoomId);
    if (!currentRoom || !currentRoom.hall_room_id) return;

    let color = '#888'; // standard (серый)
    if (roomToAssign.type === 'vip') { color = 'orange'; }
    else if (roomToAssign.type === 'cinema') { color = 'blue'; }

    const updatedProps: Partial<HallRoomNew> = {
      name: roomToAssign.name,
      color: color,
      metadata: { type: roomToAssign.type || null },
      room_id: roomToAssign.room_id, // Correctly assign room_id here
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
    } catch (error) {
      console.error("Ошибка при обновлении комнаты зала:", error);
    }
  };

  const deleteSelected = async () => {
    if (!selectedRoomId) return;

    const roomToDelete = rooms.find(room => room.id === selectedRoomId);
    if (!roomToDelete || !roomToDelete.hall_room_id) return;

    try {
      await deleteHallRoomNew(hallId, roomToDelete.hall_room_id);
      setRooms(prevRooms => prevRooms.filter(room => room.id !== selectedRoomId));
      setSelectedRoomId(null);
      setSelectedAssignedDbRoomId(null); // Clear selected assigned room when square is deleted
    } catch (error) {
      console.error("Ошибка при удалении комнаты зала:", error);
    }
  };

  const exportToJson = () => {
    const dataToExport = {
      hallId: hallId,
      rooms: rooms.map(room => ({
        id: room.hall_room_id,
        name: room.name,
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
        color: room.color,
        metadata: { type: room.type },
        room_id: room.dbRoomId, // Include dbRoomId in export
      })),
    };
    setExportedJson(JSON.stringify(dataToExport, null, 2));
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
        <ToolbarButton onClick={exportToJson} $color="#FCD25E">Выгрузить JSON</ToolbarButton>
      </ToolbarContainer>
      <svg ref={svgRef} width={hall.width} height={hall.height}></svg>
      {exportedJson && (
        <JsonOutputContainer>
          <JsonOutputTitle>JSON Зала:</JsonOutputTitle>
          <JsonPre>{exportedJson}</JsonPre>
        </JsonOutputContainer>
      )}
    </div>
  );
};

export default HallsAdmin;

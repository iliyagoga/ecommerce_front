declare module 'd3';

"use client"
import React, { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { getRooms } from '@/api';
import { Room } from '@/types';

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
  type: 'vip' | 'standard' | 'cinema' | null; // Allow null for initially undefined type
  dbRoomId: number | undefined; // Changed to number | undefined
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

const ColorInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #FCD25E;
  background-color: #333;
  color: white;
`;

const NumberInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #FCD25E;
  background-color: #333;
  color: white;
  width: 80px;
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

const HallsAdmin: React.FC = () => {
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

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const roomsFromDb = await getRooms();
        setAvailableDbRooms(roomsFromDb);
      } catch (error) {
        console.error("Ошибка при загрузке комнат:", error);
      }
    };
    fetchRoomTypes();
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
            .on('end', function() {
              d3.select(this).attr("stroke", null);
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

  const addSquare = () => {
    if (rooms.length >= availableDbRooms.length) return; // Disable if all rooms are used

    const newRoom: RoomData = {
      id: `room-${Date.now()}`,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      color: '#888', // Default grey color
      name: 'Квадрат',
      type: null,
      dbRoomId: undefined,
    };
    setRooms(prevRooms => [...prevRooms, newRoom]);
  };

  const assignRoomToSelectedSquare = (selectedRoomIdFromDb: number | null | undefined) => {
    if (!selectedRoomId || selectedRoomIdFromDb === null || selectedRoomIdFromDb === undefined) return;

    const roomToAssign = availableDbRooms.find(room => room.room_id === selectedRoomIdFromDb);
    if (!roomToAssign) return;

    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id === selectedRoomId) {
        let color = '#888'; // standard (серый)
        if (roomToAssign.type === 'vip') { color = 'orange'; }
        else if (roomToAssign.type === 'cinema') { color = 'blue'; }
        
        return { 
          ...room, 
          color: color, 
          name: roomToAssign.name,
          type: roomToAssign.type || null,
          dbRoomId: roomToAssign.room_id
        };
      }
      return room;
    }));
  };

  const deleteSelected = () => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== selectedRoomId));
    setSelectedRoomId(null);
    setSelectedAssignedDbRoomId(null); // Clear selected assigned room when square is deleted
  };

  const exportToJson = () => {
    const dataToExport = {
      hall: hall,
      rooms: rooms,
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

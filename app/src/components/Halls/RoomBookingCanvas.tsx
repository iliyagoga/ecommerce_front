declare module 'd3';

"use client"
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { Room, HallRoomNew } from '@/types';
import { getHallRoomsNew, getRooms } from '@/api';

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
  type: 'vip' | 'standard' | 'cinema' | null; 
  hall_room_id?: number;
  dbRoomId?: number | null;
  isAvailable: boolean; // Ensure isAvailable is always boolean
}

interface RoomBookingCanvasProps {
  hallId: number;
}

const RoomBookingCanvas: React.FC<RoomBookingCanvasProps> = ({ hallId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hall, setHall] = useState<HallData>({ width: 1000, height: 600 });
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [allDbRooms, setAllDbRooms] = useState<Room[]>([]); // All rooms from the 'rooms' table

  // Effect to fetch hall rooms (HallRoomNew) from the backend
  useEffect(() => {
    const fetchHallAndDbRooms = async () => {
      try {
        const [fetchedHallRooms, fetchedDbRooms] = await Promise.all([
          getHallRoomsNew(hallId),
          getRooms(),
        ]);

        setAllDbRooms(fetchedDbRooms);

        setRooms(fetchedHallRooms.map(hallRoom => {
          const correspondingDbRoom = fetchedDbRooms.find(dbRoom => dbRoom.room_id === hallRoom.room_id);
          const isAvailable: boolean = correspondingDbRoom && correspondingDbRoom.is_available !== undefined ? correspondingDbRoom.is_available : false;
          let displayColor = hallRoom.color;
          if (!isAvailable) {
            displayColor = 'black'; // Unavailable rooms are black
          }

          return {
            id: `room-${hallRoom.id}`,
            x: hallRoom.x,
            y: hallRoom.y,
            width: hallRoom.width,
            height: hallRoom.height,
            color: displayColor,
            name: hallRoom.name,
            type: hallRoom.metadata?.type || null,
            hall_room_id: hallRoom.id,
            dbRoomId: hallRoom.room_id,
            isAvailable: isAvailable,
          };
        }));
      } catch (error) {
        console.error("Ошибка при загрузке комнат зала или доступных комнат:", error);
      }
    };
    fetchHallAndDbRooms();
  }, [hallId]);

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
            if (!d.isAvailable) return; // Do nothing if room is not available
            // Логика клика для бронирования или просмотра деталей комнаты
            console.log("Clicked on available room:", d.name, d.id);
          })
          .style('cursor', (d: RoomData) => d.isAvailable ? 'pointer' : 'not-allowed'),
        update => update,
        exit => exit.remove()
      );

    roomElements.attr('transform', (d: RoomData) => `translate(${d.x}, ${d.y})`);

    roomElements.append('rect')
      .attr('width', (d: RoomData) => d.width)
      .attr('height', (d: RoomData) => d.height)
      .attr('fill', (d: RoomData) => d.color)
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    roomElements.append('text')
      .text((d: RoomData) => d.name)
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', 'white')
      .style('pointer-events', 'none'); // Чтобы клики проходили на rect

  }, [hall, rooms]);

  return (
    <div>
      {/* No toolbar for booking canvas */}
      <svg ref={svgRef} width={hall.width} height={hall.height}></svg>
    </div>
  );
};

export default RoomBookingCanvas;

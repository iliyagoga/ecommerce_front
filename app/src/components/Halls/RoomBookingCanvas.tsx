declare module 'd3';

"use client"
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { Room, HallRoomNew, CartRoom } from '@/types';
import { getHallRoomsNew, getRooms, getHallRoomsAvailability, addRoomToCart } from '@/api';
import { useRouter } from 'next/navigation';
import { getTimeDifferenceInHours } from '@/other';

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
  isAvailable: boolean;
}

interface RoomBookingCanvasProps {
  hallId: number;
  selectedStartDate: string;
  selectedEndDate: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Omit<CartRoom, "cart_id"> | undefined>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const RoomBookingCanvas: React.FC<RoomBookingCanvasProps> = ({ hallId, selectedStartDate, selectedEndDate, setSelectedRoom, setError }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hall, setHall] = useState<HallData>({ width: 1000, height: 600 });
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [allDbRooms, setAllDbRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    setError(null)
    const fetchHallAndDbRooms = async () => {
      try {
        const fetchedHallRoomsWithAvailability = await getHallRoomsAvailability(hallId, selectedStartDate, selectedEndDate);
        const fetchedDbRooms = await getRooms();

        setAllDbRooms(fetchedDbRooms);

        setRooms(fetchedHallRoomsWithAvailability.map(hallRoom => {
          const isAvailable: boolean = hallRoom.is_available_for_booking ?? false;
          
          let displayColor = hallRoom.color;
          if (!isAvailable) {
            displayColor = 'red';
          }
          setError(null)
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
        setError(error.response.data.message)
      }
    };
    fetchHallAndDbRooms();
  }, [hallId, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append('rect')
      .attr('width', hall.width)
      .attr('height', hall.height)
      .attr('fill', '#333')
      .attr('stroke', '#FFFFFF');

    const roomElements = svg.selectAll<SVGGElement, RoomData>('.room')
      .data(rooms, (d: RoomData) => d.id)
      .join(
        enter => enter.append('g')
          .attr('class', 'room')
          .attr('transform', (d: RoomData) => `translate(${d.x}, ${d.y})`)
          .on('click', function(event: MouseEvent, d: RoomData) {
            if (!d.isAvailable || !d.dbRoomId || !selectedEndDate || !selectedEndDate) return; 
            const roomPricePerHour = d.dbRoomId ? allDbRooms.find(room => room.room_id === d.dbRoomId)?.base_hourly_rate : 0;

            if (!roomPricePerHour) return;

            setSelectedRoom({
              room_id: d.dbRoomId,
              booked_hours: getTimeDifferenceInHours(selectedStartDate, selectedEndDate),
              booked_time_start: selectedStartDate,
              booked_time_end: selectedEndDate,
              room_price_per_hour: roomPricePerHour,
              room: {
                name: d.name,
              },
            })
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
      .attr('stroke', (d: RoomData) => d.isAvailable ? '#000' : 'red')
      .attr('stroke-width', 1);

    roomElements.append('text')
      .text((d: RoomData) => d.name)
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', 'white')
      .style('pointer-events', 'none');

  }, [hall, rooms]);

  return (
    <div>
      <svg ref={svgRef} width={hall.width} height={hall.height}></svg>
    </div>
  );
};

export default RoomBookingCanvas;

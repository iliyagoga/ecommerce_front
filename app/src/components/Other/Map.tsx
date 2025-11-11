// components/MapSection.tsx
import React, { useRef } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #222222;
  position: relative;
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  filter: grayscale(1) invert(1) hue-rotate(180deg);
`;

interface MapSectionProps {
  className?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <MapContainer ref={mapRef} className={className}>
      <MapFrame 
        height={200}
        src={`https://yandex.ru/map-widget/v1/?ll=46.040624%2C51.532771&z=16&mode=whatshere&whatshere%5Bpoint%5D=46.040624%2C51.532771&whatshere%5Bzoom%5D=16&pt=46.040624%2C51.532771%2Cpm2grl&z=16`}
        title="Аркада кафе Арка на Московской 56, Саратов"
      />
    </MapContainer>
  );
};

export default MapSection;
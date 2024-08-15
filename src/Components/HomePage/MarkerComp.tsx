import React from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useMarkerClusterer } from "../../hooks/useMarkerClusterer";
import { MarkerButton } from "./MarkerButton";
import "../../styles/HomePage.css";
import { Point } from "../../types/markerTypes";

type Props = {
  points: Point[];
  deleteMarker: (id: string) => void;
  handleMarkerDragEnd: (e: google.maps.MapMouseEvent, point: Point) => void;
  deleteAllMarkers: () => void;
};

export const Markers = ({
  points,
  deleteMarker,
  handleMarkerDragEnd,
  deleteAllMarkers,
}: Props) => {
  const map = useMap();

  useMarkerClusterer(map, points);

  return (
    <>
      <MarkerButton
        onClick={deleteAllMarkers}
        label="Remove All Markers"
        style={{ position: "absolute", top: 50, right: 10, width: "14rem" }}
      />
      {points.map((point, index) => (
        <React.Fragment key={point.uuid}>
          <AdvancedMarker
            position={point}
            draggable={true}
            onDragEnd={(e) => handleMarkerDragEnd(e, point)}
          >
            <span className="number-in-pin">{index + 1}</span>
          </AdvancedMarker>
          <MarkerButton
            onClick={() => deleteMarker(point.uuid)}
            label={`Remove Marker ${index + 1}`}
            style={{ position: "absolute", top: 90 + 40 * index, right: 10 }}
          />
        </React.Fragment>
      ))}
    </>
  );
};

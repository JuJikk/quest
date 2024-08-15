import React, { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
} from "@vis.gl/react-google-maps";
import { INITIAL_CAMERA } from "../Constants/maps";
import { Markers } from "../Components/HomePage/Markers";
import {
  fetchMarkers,
  addMarker,
  deleteMarker,
  deleteAllMarkers,
} from "../services/markerService";
import { Point } from "../types/markerTypes";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/auth";

export default function HomePage() {
  const [markers, setMarkers] = useState<Point[]>([]);
  const questId = "a86bccda-6292-41a8-b45c-31e510db7bf3";

  useEffect(() => {
    const loadMarkers = async () => {
      const markersList = await fetchMarkers(questId);
      setMarkers(markersList);
    };

    loadMarkers();
  }, [questId]);

  const handleAddMarker = async (newMarker: google.maps.LatLngLiteral) => {
    const markerData = await addMarker(newMarker, questId, markers);
    if (markerData) {
      setMarkers((prevMarkers) => [...prevMarkers, markerData]);
    }
  };

  const handleDeleteMarker = async (id: string) => {
    await deleteMarker(id, questId);
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.uuid !== id),
    );
  };

  const handleDeleteAllMarkers = async () => {
    await deleteAllMarkers(questId);
    setMarkers([]);
  };

  const handleMarkerDragEnd = async (
      e: google.maps.MapMouseEvent,
      point: Point
  ) => {
    const updatedMarkers: Point[] = markers.map((marker) =>
        marker.uuid === point.uuid
            ? { ...marker, lat: e.latLng.lat(), lng: e.latLng.lng() }
            : marker
    );
    setMarkers(updatedMarkers);

    try {
      const markerRef = doc(db, "quests", questId, "markers", point.uuid);
      await setDoc(
          markerRef,
          {
            ...point,
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
          { merge: true }
      );
    } catch (error) {
      console.error("Error updating marker position: ", error);
    }
  };


  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);
  const handleCameraChange = (ev: MapCameraChangedEvent) =>
    setCameraProps(ev.detail);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map
          {...cameraProps}
          onCameraChanged={handleCameraChange}
          onClick={(e) => handleAddMarker(e.detail.latLng)}
          mapId={process.env.REACT_APP_MAP_ID}
        >
          <Markers
            deleteAllMarkers={handleDeleteAllMarkers}
            handleMarkerDragEnd={handleMarkerDragEnd}
            deleteMarker={handleDeleteMarker}
            points={markers}
          />
        </Map>
      </div>
    </APIProvider>
  );
}

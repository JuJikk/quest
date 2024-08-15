import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../utils/auth";
import { Point } from "../types/markerTypes";

// Fetch all markers from Firestore
export const fetchMarkers = async (questId: string): Promise<Point[]> => {
  const markersRef = collection(db, "quests", questId, "markers");

  try {
    const snapshot = await getDocs(markersRef);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      uuid: doc.id,
      key: doc.id,
    })) as Point[];
  } catch (error) {
    console.error("Error fetching markers: ", error);
    return [];
  }
};

// Add a new marker to Firestore
export const addMarker = async (
    newMarker: google.maps.LatLngLiteral,
    questId: string,
    markers: Point[]
): Promise<Point | null> => {
  const markerKey = uuidv4();
  const markerIndex = markers.length + 1;

  const markerData: Point = {
    lat: newMarker.lat,
    lng: newMarker.lng,
    timestamp: new Date().toISOString(),
    index: markerIndex,
    uuid: markerKey,
    key: markerKey,
  };

  try {
    const markerRef = doc(db, "quests", questId, "markers", markerKey);
    await setDoc(markerRef, markerData);
    return markerData;
  } catch (error) {
    console.error("Error adding marker: ", error);
    return null;
  }
};

// Delete a marker from Firestore
export const deleteMarker = async (id: string, questId: string) => {
  try {
    const markerRef = doc(db, "quests", questId, "markers", id);
    await deleteDoc(markerRef);
  } catch (error) {
    console.error("Error deleting marker: ", error);
  }
};

// Delete all markers from Firestore
export const deleteAllMarkers = async (questId: string) => {
  const markersRef = collection(db, "quests", questId, "markers");

  try {
    const snapshot = await getDocs(markersRef);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error deleting all markers: ", error);
  }
};

import { useEffect, useRef } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Point } from "../types/markerTypes";

export const useMarkerClusterer = (map: google.maps.Map | null, points: Point[]) => {
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (!map) return;

        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        } else {
            clusterer.current.clearMarkers();
            const markers = points.map(
                (point) =>
                    new google.maps.Marker({
                        position: point,
                    }),
            );
            clusterer.current.addMarkers(markers);
        }

        return () => {
            clusterer.current?.clearMarkers();
        };
    }, [map, points]);

    return clusterer.current;
};

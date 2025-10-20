
declare global {
    interface Window {
        L: any;
    }
}

// Leaflet type definitions for the methods we're using
declare namespace L {
    function map(element: HTMLElement | string, options?: any): any;
    function tileLayer(urlTemplate: string, options?: any): any;
    function marker(latlng: [number, number], options?: any): any;

    interface Map {
        setView(center: [number, number], zoom: number): Map;
        on(type: string, fn: (e: any) => void): Map;
    }

    interface Marker {
        addTo(map: Map): Marker;
        on(type: string, fn: (e: any) => void): Marker;
        setLatLng(latlng: [number, number]): Marker;
        getLatLng(): { lat: number; lng: number };
    }

    interface TileLayer {
        addTo(map: Map): TileLayer;
    }
}

export {};
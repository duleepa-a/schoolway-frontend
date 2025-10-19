'use client'
import React from 'react';
import { Session } from "next-auth";
import TopBarContent from '@/app/dashboardComponents/TopBarContent';
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getDatabase, onValue, ref, DataSnapshot } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase (client-side SDK)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



interface Props {
  serverSession: Session | null;
}


const RoutePage = ({ serverSession }: Props) => {

    const [sessions, setSessions] = useState<any[]>([]);
  const [locations, setLocations] = useState<Record<string, any>>({});
  const [center, setCenter] = useState({ lat: 6.9271, lng: 79.8612 }); // Default Colombo

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Fetch active sessions for this owner
  useEffect(() => {
    async function fetchActiveSessions() {
      const res = await fetch(`/api/vanowner/active-sessions`);
      const data = await res.json();
      setSessions(data);
    }
    fetchActiveSessions();
  }, []);

  // Listen to live Firebase updates
  useEffect(() => {
    if (!sessions.length) return;

    sessions.forEach((session) => {
      const locRef = ref(db, `active_sessions/${session.id}/currentLocation`);
      onValue(locRef, (snapshot: DataSnapshot) => {
        const loc = snapshot.val();
        if (loc) {
          setLocations((prev) => ({
            ...prev,
            [session.id]: {
              ...loc,
              vanName: session.van.makeAndModel,
              driver: `${session.driver.firstname} ${session.driver.lastname}`,
            },
          }));
        }
      });
    });
  }, [sessions]);

  if (!isLoaded) return <div>Loading map...</div>;

  
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
        <TopBarContent serverSession={serverSession} heading="Daily Routes" />
        <div className="flex gap-6 border-b border-border-bold-shade mb-4">

        <div className="h-screen w-full">
        <h1 className="text-2xl font-semibold text-center my-4">🚐 Active Van Tracking</h1>
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "90%" }}
            center={center}
            zoom={12}
        >
            {Object.keys(locations).map((sessionId) => {
            const loc = locations[sessionId];
            return (
                <Marker
                key={sessionId}
                position={{ lat: loc.latitude, lng: loc.longitude }}
                label={loc.vanName}
                title={`Driver: ${loc.driver}`}
                />
            );
            })}
        </GoogleMap>
        </div>
      
        </div>
    </section>
  );
};

export default RoutePage;

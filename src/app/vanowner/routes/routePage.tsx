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
  const [transportSessions,setTransportSessions] = useState<any[]>([]);
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

    async function fetchTransportSessions(){
        const res = await fetch('/api/vanowner/transport-sessions');
        const data = await res.json();
        setTransportSessions(data);
    }
    fetchTransportSessions();
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
        <div className=" grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl px-8 py-8 shadow-lg col-span-2">
            <h1 className="text-2xl font-semibold text-center my-4">Transport Sessions</h1>
               {transportSessions.length === 0 ? (
                    <div className="text-center text-gray-500 p-4">No active sessions found.</div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-md overflow-hidden">
                        <thead>
                        <tr style={{background: 'var(--blue-shade-light)'}} className=" text-white text-left text-sm">
                            <th className="p-3">Van</th>
                            <th className="p-3">Driver</th>
                            <th className="p-3">Session Date</th>
                            <th className="p-3">Route Type</th>
                            <th className="p-3">Status</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {transportSessions.map((session) => (
                            <tr key={session.id} className="border-b hover:bg-gray-100 transition-colors">
                            <td className="p-3" style={{color: 'black'}}>{session.van.makeAndModel}</td>
                            <td className="p-3" style={{color: 'black'}}>{`${session.driver.firstname} ${session.driver.lastname}`}</td>
                            <td className="p-3" style={{color: 'black'}}>{new Date(session.sessionDate).toLocaleDateString()}</td>
                            <td className="p-3" style={{color: 'black'}}>{session.routeType.replace('_', ' ')}</td>
                            <td className="p-3" >
                                <span
                                className={`px-5 py-1 rounded-lg cursor-pointer items-center text-white${
                                    session.status === "ACTIVE"
                                    ? " bg-[var(--blue-shade-dark)]  hover:bg-[var(--blue-shade-dark)] "
                                    : session.status === "COMPLETED"
                                    ? " bg-[var(--green-shade-dark)]  hover:bg-[var(--blue-shade-dark)]"
                                    : session.status === "CANCELLED"
                                    ? " bg-[var(--red-shade-dark)] hover:bg-red-700"
                                    : " bg-[var(--blue-shade-dark)]  hover:bg-[var(--blue-shade-dark)]"
                                }`}
                                >
                                {session.status}
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            <div className='col-span-2 space-y-2'>
                <div className="bg-white rounded-2xl px-8 py-8 shadow-lg col-span-2 h-[600px]">
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
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
        </div>
    </section>
  );
};

export default RoutePage;

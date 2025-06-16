"use client";

import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  console.log(session);
  console.log(status);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1>Welcome {session?.user?.id}</h1>
      <h1>Name : {session?.user?.fullName}</h1>
      <h1>Phone : {session?.user?.phone}</h1>
      <h1>Expires In : {new Date().toUTCString()}</h1>
      <h1>Expires In : {new Date(session!.expires).toUTCString()}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
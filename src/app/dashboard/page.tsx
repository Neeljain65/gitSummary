'use client'
import { useUser } from "@clerk/nextjs";
import React from "react";
const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.firstName}!</p>
          {/* <p>Your email: {user.email}</p> */}
        </div>
      ) : (
        <p>Please sign in to access your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;

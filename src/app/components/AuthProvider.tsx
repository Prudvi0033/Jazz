"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionData {
  user: User
  session: {
    id : string
    createdAt: Date
    updatedAt: Date
    userId: string
    expiresAt: Date
  }
}

const AuthComponent = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (sessionData.data) {
          setSession(sessionData.data);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const handleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      const sessionData = await authClient.getSession();
      if (sessionData.data) {
        setSession(sessionData.data);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {session ? (
        // User is signed in
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Welcome!</h2>

          <div className="bg-gray-100 p-4 rounded-lg text-black">
            <h3 className="font-semibold mb-2">User Info:</h3>
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>User ID:</strong> {session.user.id}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        // User is not signed in
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please sign in</h2>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;

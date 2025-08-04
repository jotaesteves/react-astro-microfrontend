import React, { useState, useEffect } from "react";
import { fetchUser } from "../../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: Date;
  isActive: boolean;
}

interface UserProfileProps {
  userId?: number;
}

export default function UserProfile({ userId = 1 }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const response = await fetchUser(userId);

        if (response.status === "success") {
          setUser(response.data);
        } else {
          setError("Failed to load user profile");
        }
      } catch (err) {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="user-profile-container bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">User Profile</h2>
      <div className="flex items-center space-x-4 mb-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Role</span>
          <p className="text-gray-900">{user.role}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Status</span>
          <p className={`${user.isActive ? "text-green-600" : "text-red-600"}`}>
            {user.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <span className="text-sm font-medium text-gray-600">Member Since</span>
        <p className="text-gray-900">{user.joinDate.toLocaleDateString()}</p>
      </div>

      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Edit Profile
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          View Activity
        </button>
      </div>
    </div>
  );
}

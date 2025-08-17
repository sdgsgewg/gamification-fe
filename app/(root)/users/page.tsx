"use client";

import { useEffect, useState } from "react";
import { User } from "@/app/interface/users/IUser";
import { getAxios } from "@/app/utils/AxiosFunction";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAxios("users/get-all-users");
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="text-black">
      <h1>Users List</h1>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

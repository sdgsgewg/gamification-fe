"use client";

import React, { useEffect } from "react";
import Loading from "@/app/components/shared/Loading";
import ErrorBox from "@/app/components/shared/ErrorBox";
import Image from "next/image";
import { IMAGES } from "@/app/constants/images";
import { useStudentLeaderboard } from "@/app/hooks/leaderboards/useStudentLeaderboard";
import { LeaderboardScopeEnum } from "@/app/enums/LeaderboardSopeEnum";
import { useState } from "react";
import { FilterStudentLeaderboardRequest } from "@/app/interface/leaderboards/requests/IFilterStudentLeaderboardRequest";
import LeaderboardFilters from "@/app/components/shared/leaderboard/LeaderboardFilters";
import { LeaderboardScope } from "@/app/types/LeaderboardScope";
import { scopeDescription } from "@/app/utils/leaderboard/scopeDescription";

const LeaderboardPage = () => {
  const [scopeFilter, setScopeFilter] = useState<LeaderboardScope>(
    LeaderboardScopeEnum.GLOBAL.toLowerCase() as LeaderboardScope
  );
  const [filters, setFilters] = useState<FilterStudentLeaderboardRequest>({
    scope: scopeFilter,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      scope: scopeFilter.toUpperCase(),
    }));
  }, [scopeFilter]);

  const {
    data: leaderboard,
    isLoading,
    isError,
  } = useStudentLeaderboard(filters);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBox message="Gagal memuat leaderboard." />;

  // pastikan data tidak kosong
  if (!leaderboard || leaderboard.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Tidak ada data leaderboard.
      </div>
    );

  // ambil 3 teratas dan sisanya
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <main className="container mx-auto flex-1 flex flex-col items-center justify-center py-12 px-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10">
          🌟 Leaderboard
        </h1>

        <LeaderboardFilters
          module="root"
          filter={scopeFilter}
          setFilter={setScopeFilter}
        />

        <p className="mt-4 mb-8 text-center text-gray-700 text-sm italic">
          {scopeDescription[scopeFilter]}
        </p>

        {/* Top 3 Section */}
        <div className="flex justify-center items-end space-x-6 mb-16">
          {topThree.map((person, index) => (
            <div
              key={person.id}
              className={`relative flex flex-col items-center transition-transform hover:scale-105 ${
                index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"
              }`}
            >
              {/* Podium */}
              <div
                className={`flex flex-col items-center justify-end rounded-2xl shadow-xl backdrop-blur-md bg-white/40 p-5 ${
                  index === 0
                    ? "h-64 w-40 border-4 border-yellow-400"
                    : index === 1
                    ? "h-56 w-36 border-4 border-gray-300"
                    : "h-52 w-32 border-4 border-amber-600"
                }`}
              >
                <span className="text-4xl mb-2">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <Image
                  src={person.image || IMAGES.DEFAULT_PROFILE}
                  alt={person.name}
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-2 object-cover"
                />
                <p className="font-bold text-center text-sm text-gray-800">
                  {person.name}
                </p>
                <span className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                  {person.point.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="w-full bg-white/70 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-3 px-4 text-left font-semibold">🏅 Rank</th>
                <th className="py-3 px-4 text-left font-semibold">👤 Nama</th>
                <th className="py-3 px-4 text-left font-semibold">🔥 Poin</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-blue-700">
                    {index + 4}
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <Image
                      src={user.image || IMAGES.DEFAULT_PROFILE}
                      alt={user.name}
                      width={100}
                      height={100}
                      className="w-8 h-8 rounded-full border-2 border-blue-300 object-cover"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-800">
                    {user.point.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;

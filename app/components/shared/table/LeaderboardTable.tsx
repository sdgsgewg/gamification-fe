"use client";

import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaderboardData } from "@/app/interface/LeaderboardData";
import { IMAGES } from "@/app/constants/images";
import Image from "next/image";

interface LeaderboardPreviewTableProps {
  data: LeaderboardData[];
}

export const LeaderboardPreviewTable = ({
  data,
}: LeaderboardPreviewTableProps) => {
  const columns: ColumnsType<LeaderboardData> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center",
      width: "15%",
      render: (text) => {
        return (
          <>
            {text > 3 ? (
              <span className="text-dark text-base font-medium">{text}</span>
            ) : (
              <div className="flex items-center justify-center">
                <Image
                  src={
                    text === 1
                      ? IMAGES.GOLD_MEDAL_CROP
                      : text === 2
                      ? IMAGES.SILVER_MEDAL_CROP
                      : IMAGES.BRONZE_MEDAL_CROP
                  }
                  alt={`Rank ${text}`}
                  width={20}
                  height={20}
                />
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "55%",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      align: "left",
      width: "30%",
      render: (text) => (
        <span className="font-medium">{text.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="overflow-hidden shadow-md">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="rank"
        bordered={false}
        className="leaderboard-table"
      />
    </div>
  );
};

// export const LeaderboardTable = () => {
//   return (
//     <table className="w-full border-collapse bg-white rounded-xl shadow">
//       <thead className="bg-indigo-600 text-white">
//         <tr>
//           <th className="px-4 py-2">Rank</th>
//           <th className="px-4 py-2">Nama</th>
//           <th className="px-4 py-2">Poin</th>
//         </tr>
//       </thead>
//       <tbody>
//         {[
//           { rank: 1, name: "Dinda P.", points: 36700 },
//           { rank: 2, name: "Arif W.", points: 34200 },
//           { rank: 3, name: "Zahra I.", points: 33150 },
//           { rank: 4, name: "Rafi A.", points: 32700 },
//           { rank: 5, name: "Chika M.", points: 31800 },
//         ].map((row) => (
//           <tr key={row.rank} className="border-t">
//             <td className="px-4 py-2">{row.rank}</td>
//             <td className="px-4 py-2">{row.name}</td>
//             <td className="px-4 py-2">{row.points}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

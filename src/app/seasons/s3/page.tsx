import React from "react";

const seasonData = {
  name: "Mùa 3",
  image: "https://images.unsplash.com/photo-1630451232172-8d2c9a4d73a7?w=800&h=400&fit=crop",
  info: "Mùa 3 là mùa đặc biệt với giải đấu toàn server.",
  start: "01/07/2025",
  end: "30/09/2025",
  events: ["Giải đấu toàn server", "Event xếp hạng", "Event quà tặng đặc biệt"],
};

export default function SeasonS3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-4xl font-bold text-center">{seasonData.name}</h1>
        <img src={seasonData.image} alt={seasonData.name} className="w-full h-64 object-cover rounded-xl border border-purple-500/20" />
        <p className="text-purple-200">{seasonData.info}</p>
        <p className="text-sm text-purple-400">Thời gian: {seasonData.start} - {seasonData.end}</p>
        <div>
          <h3 className="font-semibold text-purple-300 mb-1">Các sự kiện:</h3>
          <ul className="list-disc list-inside text-purple-200 space-y-1">
            {seasonData.events.map((event, idx) => (
              <li key={idx}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

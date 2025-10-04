import React from "react";

const seasonData = {
  name: "Mùa 2",
  image: "https://images.unsplash.com/photo-1620840141053-7b074f09d707?w=800&h=400&fit=crop",
  info: "Mùa 2 nâng cao với các tính năng mới và phần thưởng hấp dẫn.",
  start: "01/04/2025",
  end: "30/06/2025",
  events: ["Event thử thách", "Event Clan War", "Event rút thưởng"],
};

export default function SeasonS2Page() {
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

import React, { useEffect, useState } from "react";

const ActivityReport = () => {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    fetch("/api/analytics/distinct-bap-counts")
      .then(res => res.json())
      .then(data => setCounts(data));
  }, []);

  if (!counts) return <p>Loading...</p>;

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg">Last 1 Month</h2>
        <p className="text-2xl">{counts.lastMonth}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg">Last 1 Week</h2>
        <p className="text-2xl">{counts.lastWeek}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg">Last 1 Day</h2>
        <p className="text-2xl">{counts.lastDay}</p>
      </div>
    </div>
  );
};

export default ActivityReport;

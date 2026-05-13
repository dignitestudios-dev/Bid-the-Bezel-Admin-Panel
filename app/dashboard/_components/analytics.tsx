import React from "react";

const analyticsData = [
  { title: "Auction Success Rate", value: "78%" },
  { title: "Listings Conversion Rate", value: "64%" },
  { title: "High Value Auctions", value: "$1.2M+" },
];

const Analytics = () => {
  return (
    <div className="mt-6 bg-white p-5 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analyticsData.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;

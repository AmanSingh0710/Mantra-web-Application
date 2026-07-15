// components/delivery/tracking/LiveMap.jsx
"use client";

export default function LiveMap({latitude,longitude}){
  if(!latitude || !longitude){
    return (
      <div className="bg-white border rounded-xl p-10 text-center">
        Live location unavailable.
      </div>
    );
  }

  const src=`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Live Map</h2>
      </div>

      <iframe
        title="Live Map"
        src={src}
        width="100%"
        height="500"
        loading="lazy"
        className="border-0"
      />
    </div>
  );
}

"use client";

export default function StoreCard({ title, value, icon, variant = "blue", isLoading = false }) {
  const variants = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex justify-between">
        <div className="space-y-3"><div className="h-3 w-16 bg-gray-100 rounded"></div><div className="h-7 w-24 bg-gray-200 rounded"></div></div>
        <div className="w-12 h-12 bg-gray-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 flex items-center justify-between hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group cursor-default">
      <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 leading-none">
          {value}
        </h2>
      </div>

      <div className={`
        w-12 h-12 sm:w-14 sm:h-14 
        flex items-center justify-center 
        rounded-2xl text-2xl border
        transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
        ${variants[variant]}
      `}>
        {icon}
      </div>
    </div>
  );
}
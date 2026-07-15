"use client";

export default function StoreTable({ columns = [], data = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-[12px] font-black text-gray-400 uppercase tracking-widest">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                  No records found in this category
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-gray-700 font-bold">
                      {value}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
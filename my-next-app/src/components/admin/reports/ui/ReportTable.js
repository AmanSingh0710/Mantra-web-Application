"use client";

export default function ReportTable({columns, children}) {

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

            <table className="w-full text-black">
               <thead className="bg-gray-100">
                    <tr>
                       {columns.map((column) => (
                            <th key={column} className="px-5 py-4 text-left text-black">{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}
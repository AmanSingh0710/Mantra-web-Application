"use client";

import { FaDownload, FaFilePdf, FaFileExcel, FaPrint } from "react-icons/fa";

export default function ReportHeader({
    title,
    subtitle,
    onPrint,
    onExportPDF,
    onExportExcel,
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {title}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={onPrint}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-black"
                    >
                        <FaPrint />
                        Print
                    </button>

                    <button
                        onClick={onExportPDF}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white"
                    >
                        <FaFilePdf />
                        PDF
                    </button>

                    <button
                        onClick={onExportExcel}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white"
                    >
                        <FaFileExcel />
                        Excel
                    </button>

                </div>

            </div>

        </div>
    );
}
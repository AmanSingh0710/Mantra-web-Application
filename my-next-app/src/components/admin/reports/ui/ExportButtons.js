"use client";

import {
  FaFileExcel,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";

export default function ExportButtons({
  onPrint,
  onExportPDF,
  onExportExcel,
}) {
  return (
    <div className="flex flex-wrap gap-3">

      <button
        onClick={onPrint}
        className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-black"
      >
        <FaPrint />
      </button>

      <button
        onClick={onExportPDF}
        className="px-4 py-2 rounded-lg bg-red-600 text-white"
      >
        <FaFilePdf />
      </button>

      <button
        onClick={onExportExcel}
        className="px-4 py-2 rounded-lg bg-green-600 text-white"
      >
        <FaFileExcel />
      </button>

    </div>
  );
}
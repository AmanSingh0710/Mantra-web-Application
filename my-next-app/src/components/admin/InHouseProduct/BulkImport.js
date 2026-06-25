"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import { FaCloudUploadAlt, FaFileDownload, FaInfoCircle } from "react-icons/fa";

//src/components/admin/InHouseProduct/BulkImport.js
export default function BulkImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleReset = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return toast.error("Please select file");
    }

    try {

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetchFromAPI("/Adminproducts/bulk-import",
        {
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (response.success) {
        toast.success(`${response.inserted} products imported`);
        console.log(response.errors);
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error("Import failed");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 text-gray-700 pb-10">
      {/* Header */}
      <h1 className="text-xl font-bold flex items-center gap-2">
        <span className="text-2xl text-orange-500">📥</span> Bulk Import
      </h1>

      {/* 1. Instructions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          Instructions :
        </h2>
        <ul className="space-y-3 text-sm text-gray-600 list-decimal ml-5">
          <li>Download the format file and fill it with proper data.</li>
          <li>You can download the example file to understand how the data must be filled.</li>
          <li>Once you have downloaded and filled the format file, Upload it in the form below and submit.</li>
          <li>After uploading products you need to edit them and set product images and choices.</li>
          <li>You can get brand and category id from their list please input the right ids.</li>
          <li>You can upload your product images in product folder from gallery and copy image path.</li>
        </ul>
      </div>

      {/* 2. Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center">
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-gray-700">
            Do not have the template ?{" "}
            <a href="#" className="text-blue-500 hover:underline inline-flex items-center gap-1 font-bold">
              Download Here
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="relative group border-2 border-dashed border-blue-200 rounded-xl p-12 bg-blue-50/30 flex flex-col items-center justify-center transition hover:bg-blue-50 cursor-pointer">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="text-blue-500 text-center">
              <FaCloudUploadAlt className="text-5xl mb-4 mx-auto opacity-80" />
              <p className="text-sm font-semibold uppercase tracking-wider">
                {file ? file.name : "Drag & drop file or browse file"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-2 bg-gray-100 text-gray-600 rounded-md font-medium hover:bg-gray-200 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-[#0084ff] text-white rounded-md font-medium hover:bg-blue-600 shadow-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { FaDatabase } from "react-icons/fa";

export default function EmptyState({

    title = "No Data Found"

}) {

    return (

        <div className="bg-white rounded-xl shadow-sm border p-16 text-center">

            <FaDatabase className="mx-auto text-6xl text-gray-300"/>

            <h2 className="text-2xl font-bold mt-6 text-black">{title}</h2>

            <p className="text-gray-500 mt-2">There is no data available.</p>

        </div>

    );

}
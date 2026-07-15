"use client";

export default function Pagination() {

    return (

        <div className="flex justify-end mt-6 gap-2">

            <button className="border px-4 py-2 rounded">
                Previous
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                1
            </button>

            <button className="border px-4 py-2 rounded">
                2
            </button>

            <button className="border px-4 py-2 rounded">
                Next
            </button>

        </div>

    );

}
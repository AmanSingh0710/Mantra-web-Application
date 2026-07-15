"use client";

export default function FilterBar({ 
   search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    categories = [],
    statuses = [],
    showCategory = false,
    showStatus = true,
    showDate = true,
    onApply
}) {

    return (

        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 text-black"
                />

               {/* CATEGORY */}
                {showCategory && (
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* STATUS */}
                {showStatus && (
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black cursor-pointer"
                    >
                        <option value="">All Status</option>
                        {statuses.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>
                )}


                {/* START DATE */}
                {showDate && (
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black cursor-pointer"
                    />
                )}

                {/* END DATE */}
                {showDate && (
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black cursor-pointer"
                    />
                )}

                <button
                    onClick={onApply}
                    className="bg-blue-600 text-white rounded-lg"
                >
                    Apply Filter
                </button>

            </div>

        </div>

    );

}
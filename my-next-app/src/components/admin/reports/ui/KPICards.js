"use client";

export default function KPICards({ cards }) {

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="bg-white rounded-xl shadow-sm border p-5"
                >

                    <p className="text-gray-900 text-sm">
                        {card.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-gray-900">
                        {card.value}
                    </h2>

                    <p className={`mt-3 text-sm ${card.color}`}>
                        {card.change}
                    </p>

                </div>

            ))}

        </div>

    );

}
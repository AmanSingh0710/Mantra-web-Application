"use client";

export default function DeliveryCard({
  title,
  value,
  icon,
  color,
  growth,
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        p-6
        bg-white
        border
        border-gray-100
        shadow-lg
        shadow-gray-100/60
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      {/* BG EFFECT */}
      <div
        className={`
          absolute
          top-0
          right-0
          w-32
          h-32
          rounded-full
          blur-3xl
          opacity-10
          ${color}
        `}
      />

      {/* CONTENT */}
      <div className="relative z-10">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              {title}
            </p>

            <h2 className="text-4xl font-black text-gray-900 mt-4 tracking-tight">
              {value}
            </h2>

          </div>

          <div
            className={`
              w-16
              h-16
              rounded-2xl
              flex
              items-center
              justify-center
              text-white
              text-2xl
              shadow-lg
              ${color}
            `}
          >
            {icon}
          </div>

        </div>

        <div className="mt-6">

          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-black tracking-wide">
            {growth}
          </span>

        </div>

      </div>

    </div>
  );
}
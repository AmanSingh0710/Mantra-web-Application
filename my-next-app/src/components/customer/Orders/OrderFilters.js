"use client";

export default function OrderFilters({status,options,onChange}){
  return(
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {options.map(item=>(
        <button
          key={item}
          onClick={()=>onChange(item)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            status===item
              ? "bg-black text-white"
              : "border bg-white hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
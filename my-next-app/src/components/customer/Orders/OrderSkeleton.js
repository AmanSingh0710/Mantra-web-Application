"use client";
export default function OrderSkeleton({count=5}){
  return(
    <div className="space-y-5">
      {Array.from({length:count}).map((_,i)=>(
        <div
          key={i}
          className="animate-pulse rounded-xl border bg-white p-5"
        >
          <div className="flex gap-5">
            <div className="h-24 w-24 rounded-lg bg-gray-200"/>
            <div className="flex-1 space-y-3">
              <div className="h-5 w-60 rounded bg-gray-200"/>
              <div className="h-4 w-40 rounded bg-gray-200"/>
              <div className="h-4 w-52 rounded bg-gray-200"/>
              <div className="h-10 w-36 rounded bg-gray-200"/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
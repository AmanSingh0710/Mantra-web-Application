"use client";

export default function LoadingSkeleton() {
    return (
        <div className="space-y-5">
           {[1,2,3,4].map((item)=>(
                <div key={item} className="h-20 rounded-xl bg-gray-200 animate-pulse"/>
            ))}
        </div>
    );
}
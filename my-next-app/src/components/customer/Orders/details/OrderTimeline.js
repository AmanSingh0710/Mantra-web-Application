"use client";
import { CheckCircle, Clock } from "lucide-react";
const STEPS = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Out For Delivery", "Delivered"];


export default function OrderTimeline({ order }) {

  const history = order.statusHistory || [];
  const getHistory = status => history.find(item => item.status === status);
  const currentIndex = STEPS.indexOf(order.status);
  
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Order Timeline</h2>
      <div className="space-y-5">
        {STEPS.map((step, index) => {
          const completed = index <= currentIndex;
          const item = getHistory(step);
          return (
            <div key={step} className="relative flex gap-4">
              {index !== STEPS.length - 1 && (
                <div className={`absolute left-[14px] top-8 h-full w-0.5 ${completed ? "bg-green-500" : "bg-gray-300"}`} />
              )}
              <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                {completed ? <CheckCircle size={18} /> : <Clock size={16} />}
              </div>
              <div className="pb-6">
                <h3 className={`font-semibold ${completed ? "text-black" : "text-gray-500"}`}>{step}</h3>
                {item?.updatedAt && (
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(item.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
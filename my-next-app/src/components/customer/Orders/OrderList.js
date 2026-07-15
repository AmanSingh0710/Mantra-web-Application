"use client";
import OrderCard from "./OrderCard";

export default function OrderList({orders=[]}){
  return(
    <div className="mt-6 space-y-5">
      {orders.map(order=>(
        <OrderCard key={order._id} order={order}/>
      ))}
    </div>
  );
}
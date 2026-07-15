"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import OrderList from "@/components/customer/Orders/OrderList";
import OrderSearch from "@/components/customer/Orders/OrderSearch";
import OrderFilters from "@/components/customer/Orders/OrderFilters";
import OrderSkeleton from "@/components/customer/Orders/OrderSkeleton";
import EmptyOrders from "@/components/customer/Orders/EmptyOrders";
import toast from "react-hot-toast";

const STATUS_OPTIONS=[
  "ALL",
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
  "Return Requested",
  "Returned",
  "Refunded"
];

export default function MyOrdersPage(){
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("ALL");
  const [page,setPage]=useState(1);
  const [pages,setPages]=useState(1);
  const [total,setTotal]=useState(0);

  const limit=10;

  const fetchOrders=async(currentPage=1,currentStatus=status)=>{
    try{
      setLoading(true);

      let url=`/order/my-orders?page=${currentPage}&limit=${limit}`;

      if(currentStatus!=="ALL"){
        url+=`&status=${encodeURIComponent(currentStatus)}`;
      }

      const res=await fetchFromAPI(url);

      setOrders(res.orders||[]);
      setPages(res.pages||1);
      setTotal(res.total||0);
      setPage(res.page||1);

    }catch(err){
      console.error(err);
      toast.error(err.message||"Failed to load orders");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchOrders(1,status);
  },[status]);

  const filteredOrders=useMemo(()=>{
    if(!search.trim()) return orders;

    const keyword=search.toLowerCase();

    return orders.filter(order=>
      order.orderNumber?.toLowerCase().includes(keyword)
    );
  },[orders,search]);

  const handleSearch=e=>{
    setSearch(e.target.value);
  };

  const handleStatusChange=value=>{
    setStatus(value);
    setPage(1);
  };

  const handlePageChange=newPage=>{
    if(newPage<1||newPage>pages) return;
    fetchOrders(newPage,status);
  };

    return(
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              {total} {total===1?"Order":"Orders"} Found
            </p>
          </div>

          <OrderSearch
            value={search}
            onChange={handleSearch}
          />
        </div>

        <OrderFilters
          status={status}
          options={STATUS_OPTIONS}
          onChange={handleStatusChange}
        />

        {loading ? (
          <OrderSkeleton count={6}/>
        ) : filteredOrders.length===0 ? (
          <EmptyOrders/>
        ) : (
          <>
            <OrderList orders={filteredOrders}/>

            {pages>1&&(
              <div className="mt-8 flex items-center justify-center gap-2">

                <button
                  onClick={()=>handlePageChange(page-1)}
                  disabled={page===1}
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({length:pages},(_,i)=>i+1).map(item=>(
                  <button
                    key={item}
                    onClick={()=>handlePageChange(item)}
                    className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                      page===item
                        ? "border-black bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}

                <button
                  onClick={()=>handlePageChange(page+1)}
                  disabled={page===pages}
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
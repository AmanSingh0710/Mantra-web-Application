"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

import RefundStats from "./RefundStats";
import RefundFilters from "./RefundFilters";
import RefundTable from "./RefundTable";
import RefundDetailsModal from "./RefundDetailsModal";

export default function RefundPage({title,status,}) {
  const [refunds, setRefunds] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedRefund, setSelectedRefund] =
    useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRefunds();
    loadSummary();
  }, [status]);

  const loadRefunds = async () => {
    try {
      setLoading(true);

      const res = await fetchFromAPI(`/refund/all?status=${status}`);

      if (res.success) {
        setRefunds(res.refunds || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await fetchFromAPI("/refund/summary");

      if (res.success) {
        setSummary(res.summary);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredRefunds = refunds.filter(
    (item) =>
      item.refundNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        <p className="text-gray-500">
          Manage refund requests
        </p>
      </div>

      <RefundStats stats={summary} />

      <RefundFilters
        search={search}
        setSearch={setSearch}
      />

      <RefundTable
        refunds={filteredRefunds}
        loading={loading}
        onView={setSelectedRefund}
        status={status}
      />

      <RefundDetailsModal
        refund={selectedRefund}
        onClose={() =>
          setSelectedRefund(null)
        }
      />

    </div>
  );
}
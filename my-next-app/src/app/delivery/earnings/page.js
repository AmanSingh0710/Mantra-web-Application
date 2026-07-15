import DeliveryEarnings from "@/components/delivery/earnings/DeliveryEarnings";
import EarningsChart from "@/components/delivery/earnings/EarningsChart";

export default function earningPage() {
  return (
    <div className="space-y-6">
      <DeliveryEarnings />
      <EarningsChart />
    </div>
  );
}
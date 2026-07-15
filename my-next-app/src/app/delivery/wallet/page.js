import DeliveryWallet from "@/components/delivery/wallet/DeliveryWallet";
import WalletHistory from "@/components/delivery/wallet/WalletHistory";

export const metadata = {
  title: "Delivery Wallet",
};

export default function DeliveryWalletPage() {
  return (
    <div className="space-y-6">
      <DeliveryWallet />
      <WalletHistory />
    </div>
  );
}
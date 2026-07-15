import DeliveryTracking from "@/components/delivery/tracking/DeliveryTracking";
import LiveMap from "@/components/delivery/tracking/LiveMap";

export const metadata = {
  title: "Delivery Tracking",
};


export default function trackingPage(){
  return(
    <div className=" space-y-6">
      <DeliveryTracking/>
      <LiveMap/>
    </div>
  );
}
import DeliverySettings from "@/components/delivery/settings/DeliverySettings";
import ChangePassword from "@/components/delivery/settings/ChangePassword";

export const metadata = {
    title: "Delivery Settings",
};

export default function DeliverySettingsPage() {
    return (
        <div className="space-y-6">
            <DeliverySettings />;
            <ChangePassword />
        </div>
    );
}
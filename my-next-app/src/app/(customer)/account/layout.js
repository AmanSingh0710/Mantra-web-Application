import AccountSidebar from "@/components/customer/account/AccountSidebar";

export default function AccountLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-xl shadow border p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
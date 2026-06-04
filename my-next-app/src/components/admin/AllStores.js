"use client";


import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Download, Plus, Trash2, X, User, Lock, Store, ChevronDown, Eye, EyeOff, Info, Upload } from "lucide-react";

export default function StorePage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    shopAddress: "",
    vendorImage: null,
    shopLogo: null,
    shopBanner: null,
  });

  const [previews, setPreviews] = useState({
    vendorImage: null,
    shopLogo: null,
    shopBanner: null,
  });

  // ================= FETCH STORES =================
  const fetchStores = async () => {
    try {
      const data = await fetchFromAPI("/stores");

      setStores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, [type]: file });
      setPreviews({ ...previews, [type]: URL.createObjectURL(file) });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    try {

      const data = await fetchFromAPI("/stores/add", {
        method: "POST",
        body: formData,
      });

      toast.success(data.message || "Vendor added successfully");

      setShowModal(false);

      fetchStores();

    } catch (error) {

      toast.error(error.message || "Submission failed");
    }
  };

  const handleDelete = async (id) => {
    try {

      const data = await fetchFromAPI(`/stores/delete/${id}`, {
        method: "DELETE",
      });

      toast.success(data.message || "Vendor deleted");

      fetchStores();

    } catch (error) {

      toast.error(error.message || "Delete failed");
    }
  };

  const handleUpdate = async (id) => {

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    try {

      const data = await fetchFromAPI(`/stores/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success(data.message || "Vendor updated");

      fetchStores();

    } catch (error) {

      toast.error(error.message || "Update failed");
    }
  };

  const exportToExcel = async (data) => {
    const XLSX = await import("xlsx");
    const { saveAs } = await import("file-saver");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stores");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "stores.xlsx");
  };

  const exportToPDF = async (data) => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map(obj => Object.values(obj));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("stores.pdf");
  };

  const exportToWord = async (data) => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell } = await import("docx");
    const { saveAs } = await import("file-saver");

    const tableRows = data.map(item =>
      new TableRow({
        children: Object.values(item).map(value =>
          new TableCell({
            children: [new Paragraph(String(value))],
          })
        ),
      })
    );

    const doc = new Document({
      sections: [
        {
          children: [
            new Table({
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "stores.docx");
  };


  return (
    <div className="p-4 md:p-6 bg-[#f7f8fa] min-h-screen font-sans text-[#334257]">

      {/* 1. Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <User size={20} className="text-[#334257]" />
        <h1 className="text-lg font-bold text-[#334257]">Vendor List</h1>
        <span className="bg-[#e9ecef] text-[#495057] text-[12px] px-2 py-0.5 rounded-full font-bold">
          {stores.length}
        </span>
      </div>

      {/* 2. Main Search and Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-[#eff2f7] mb-6">
        <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Search Bar Group */}
          <div className="flex w-full max-w-lg border border-[#ced4da] rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#007bff]">
            <div className="pl-3 flex items-center bg-white text-[#adb5bd]">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by shop name or vendor name or phone or email"
              className="w-full px-3 py-2.5 outline-none text-sm placeholder:text-[#adb5bd]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-[#007bff] text-white px-6 py-2 text-sm font-medium hover:bg-[#0069d9] transition-colors">
              Search
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full lg:w-auto relative">

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#007bff] text-[#007bff] rounded-md text-sm font-medium hover:bg-blue-50 transition-colors w-full lg:w-auto"
              >
                Export
              </button>

              {/* Dropdown Options */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
                  <button
                    onClick={() => {
                      exportToExcel(stores);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Excel
                  </button>

                  <button
                    onClick={() => {
                      exportToPDF(stores);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    PDF
                  </button>

                  <button
                    onClick={() => {
                      exportToWord(stores);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Word
                  </button>
                </div>
              )}
            </div>

            {/* Add Vendor Button (unchanged) */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#007bff] text-white rounded-md text-sm font-medium hover:bg-[#0069d9] transition-colors w-full lg:w-auto whitespace-nowrap"
            >
              <Plus size={16} /> Add New Vendor
            </button>

          </div>


        </div>

        {/* 3. The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb] border-y border-[#eff2f7] text-[13px] font-bold text-[#334257]">
                <th className="px-6 py-4">SL</th>
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Total Products</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4 text-center">Action</th>
                <th className="px-6 py-4 text-center">Image</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff2f7]">
              {stores.length > 0 ? (
                stores.map((store, index) => (
                  <tr key={store._id} className="hover:bg-gray-50 text-sm transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-[#007bff]">{store.shopName}</td>
                    <td className="px-6 py-4 font-medium">{store.firstName} {store.lastName}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <p className="font-semibold text-[#334257]">{store.mobile}</p>
                        <p className="text-gray-400">{store.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {store.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium">{store.totalProducts || 0}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium">{store.totalOrders || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3 text-gray-400">
                        {/* EDIT BUTTON */}
                        <Eye
                          size={18}
                          onClick={() => {
                            setForm({
                              firstName: store.firstName || "",
                              lastName: store.lastName || "",
                              mobile: store.mobile || "",
                              email: store.email || "",
                              password: "",
                              confirmPassword: "",
                              shopName: store.shopName || "",
                              shopAddress: store.shopAddress || "",
                              vendorImage: null,
                              shopLogo: null,
                              shopBanner: null,
                            });

                            setShowModal(true);
                          }}
                          className="cursor-pointer hover:text-blue-500 transition-colors"
                        />

                        {/* DELETE BUTTON */}
                        <Trash2
                          size={18}
                          onClick={() => handleDelete(store._id)}
                          className="cursor-pointer hover:text-red-500 transition-colors"
                        />

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative mb-4">
                        <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <div className="w-12 h-8 bg-white rounded shadow-sm"></div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-4 border-white shadow-sm">
                          <Info size={16} className="text-gray-400 fill-gray-100" />
                        </div>
                      </div>
                      <p className="text-[#8a99af] text-sm font-medium">No vendor found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ADD VENDOR MODAL ================= */}
      {showModal && (
        <div className=" flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 overflow-y-auto">
          <div className="bg-[#f7f8fa] w-full max-w-6xl rounded-lg shadow-xl my-8">
            <div className="p-4 border-b bg-white rounded-t-lg flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2">
                <User size={18} /> Add New Vendor
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* CARD 1: VENDOR INFORMATION */}
              <div className="bg-white p-6 rounded-lg border border-[#eff2f7] shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-[#f1f3f5] pb-3">
                  <User size={16} />
                  <h3 className="text-sm font-bold">Vendor Information</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[13px] block mb-1.5">First Name</label>
                      <input name="firstName" onChange={handleChange} className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff]" placeholder="Ex: Jhone" />
                    </div>
                    <div>
                      <label className="text-[13px] block mb-1.5">Last Name</label>
                      <input name="lastName" onChange={handleChange} className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff]" placeholder="Ex: Doe" />
                    </div>
                    <div>
                      <label className="text-[13px] block mb-1.5">Phone</label>
                      <div className="flex border border-[#ced4da] rounded overflow-hidden">
                        <div className="bg-[#f8f9fb] px-3 py-2 border-r flex items-center gap-1 text-xs">🇮🇳 +91 <ChevronDown size={12} /></div>
                        <input name="mobile" onChange={handleChange} className="w-full p-2 text-sm outline-none" placeholder="Enter phone number" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-40 h-40 border-2 border-dashed border-[#dee2e6] rounded-lg mb-4 flex items-center justify-center bg-[#f8f9fb] overflow-hidden">
                      {previews.vendor ? <img src={previews.vendorImage} className="w-full h-full object-cover" /> : <Upload className="text-slate-300" size={40} />}
                    </div>
                    <div className="w-full max-w-xs">
                      <label className="text-[12px] block mb-1">Vendor Image <span className="text-cyan-500">(Ratio 1:1)</span></label>
                      <div className="flex border rounded overflow-hidden text-sm">
                        <div className="flex-grow px-3 py-2 text-slate-400 truncate bg-white">{form.vendorImage?.name || "Upload Image"}</div>
                        <label className="bg-[#f8f9fb] px-4 py-2 border-l cursor-pointer hover:bg-slate-100">Browse
                          <input type="file" hidden onChange={(e) => handleFileChange(e, "vendorImage")} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* CARD 2: ACCOUNT INFORMATION */}
              <div className="bg-white p-6 rounded-lg border border-[#eff2f7] shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-[#f1f3f5] pb-3">
                  <User size={16} />
                  <h3 className="text-sm font-bold">Account Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Email */}
                  <div>
                    <label className="text-[13px] block mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff]"
                      placeholder="admin@admin.com"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="text-[13px] flex items-center gap-1 mb-1.5">
                      Password <Info size={14} className="text-slate-400" />
                    </label>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff]"
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <p className="text-[11px] text-gray-500 mt-1">
                      At least one uppercase letter (A-Z), one lowercase, one number
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label className="text-[13px] block mb-1.5">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}   // ✅ bind value properly
                      onChange={handleChange}
                      className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff]"
                      placeholder="Confirm password"
                      required
                    />
                    <p className="text-[11px] text-red-400 mt-1">
                      {form.confirmPassword && form.password !== form.confirmPassword ? "Passwords do not match!" : ""}
                    </p>
                  </div>
                </div>
              </div>


              {/* CARD 3: SHOP INFORMATION */}
              <div className="bg-white p-6 rounded-lg border border-[#eff2f7] shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-[#f1f3f5] pb-3">
                  <User size={16} />
                  <h3 className="text-sm font-bold">Shop Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[13px] block mb-1.5">Shop Name</label>
                      <input name="shopName" onChange={handleChange} className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff]" placeholder="Ex: Jhone" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-48 h-48 border-2 border-dashed border-[#dee2e6] rounded-lg mb-4 flex items-center justify-center bg-[#f8f9fb]">
                        {previews.shopLogo ? <img src={previews.shopLogo} className="w-full h-full object-contain" /> : <Upload className="text-slate-300" size={32} />}
                      </div>
                      <div className="w-full">
                        <label className="text-[12px] block mb-1">Shop logo <span className="text-cyan-500">(Ratio 1:1)</span></label>
                        <div className="flex border rounded overflow-hidden text-sm">
                          <div className="flex-grow px-3 py-2 text-slate-400 truncate bg-white">Upload Logo</div>
                          <label className="bg-[#f8f9fb] px-4 py-2 border-l cursor-pointer">Browse
                            <input type="file" hidden onChange={(e) => handleFileChange(e, "shopLogo")} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[13px] block mb-1.5">Shop Address</label>
                      <textarea name="shopAddress" onChange={handleChange} className="w-full border border-[#ced4da] rounded p-2 text-sm outline-none focus:border-[#007bff] h-[38px] resize-none" placeholder="Ex: Doe"></textarea>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full h-48 border-2 border-dashed border-[#dee2e6] rounded-lg mb-4 flex items-center justify-center bg-[#f8f9fb]">
                        {previews.shopBanner ? <img src={previews.shopBanner} className="w-full h-full object-cover" /> : <Upload className="text-slate-300" size={32} />}
                      </div>
                      <div className="w-full">
                        <label className="text-[12px] block mb-1">Shop banner <span className="text-cyan-500">(Ratio 4:1 (2000 x 500 px))</span></label>
                        <div className="flex border rounded overflow-hidden text-sm">
                          <div className="flex-grow px-3 py-2 text-slate-400 truncate bg-white">Upload Banner</div>
                          <label className="bg-[#f8f9fb] px-4 py-2 border-l cursor-pointer">Browse
                            <input type="file" hidden onChange={(e) => handleFileChange(e, "shopBanner")} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="reset" className="px-6 py-2 bg-[#f1f3f5] text-[#495057] rounded text-sm font-medium hover:bg-[#e9ecef]">Reset</button>
                  <button type="submit" className="px-6 py-2 bg-[#007bff] text-white rounded text-sm font-medium hover:bg-[#0069d9]">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
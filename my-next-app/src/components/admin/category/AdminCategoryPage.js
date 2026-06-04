import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UploadCloud, Info, Download, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fetchFromAPI } from '@/utils/api'; // ✅ IMPORT

const CategorySetup = () => {
    const [setupType, setSetupType] = useState('category');
    const [allCategories, setAllCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        priority: '',
        parent: '',
        image: '',
    });

    // ✅ 1. FETCH DATA
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchFromAPI('/category');
            setAllCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ 2. IMAGE
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    // ✅ 3. CREATE / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        const level =
            setupType === 'category' ? 1 :
                setupType === 'sub-category' ? 2 : 3;

        try {
            if (editId) {
                await fetchFromAPI(`/category/${editId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        ...formData,
                        level,
                        parent: formData.parent || null
                    })
                });
            } else {
                await fetchFromAPI(`/category`, {
                    method: 'POST',
                    body: JSON.stringify({
                        ...formData,
                        level,
                        parent: formData.parent || null
                    })
                });
            }

            alert(editId ? "Updated!" : "Submitted!");
            resetForm();
            fetchData();

        } catch (err) {
            alert("Action failed");
        }
    };

    // ✅ 4. DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await fetchFromAPI(`/category/${id}`, {
                method: 'DELETE'
            });
            fetchData();
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({ name: '', priority: '', parent: '', image: '' });
    };

    // FILTER
    const filteredList = allCategories.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const targetLevel =
            setupType === 'category' ? 1 :
                setupType === 'sub-category' ? 2 : 3;

        return matchesSearch && c.level === targetLevel;
    });

    // EXPORT EXCEL
    const exportToExcel = () => {
        const dataToExport = filteredList.map((item, index) => ({
            ID: index + 1,
            Name: item.name,
            Priority: item.priority || 0,
            Level: item.level === 1 ? 'Main' : item.level === 2 ? 'Sub' : 'Sub-Sub'
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Categories");
        XLSX.writeFile(wb, `${setupType}_list.xlsx`);
    };

    // EXPORT PDF
    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`${setupType.toUpperCase()} LIST`, 14, 15);

        const rows = filteredList.map((item, index) => [
            index + 1,
            item.name,
            item.priority || 0
        ]);

        autoTable(doc, {
            head: [["ID", "Category Name", "Priority"]],
            body: rows,
            startY: 25,
        });

        doc.save(`${setupType}_list.pdf`);
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen font-sans text-[#334155]">

            {/* Main Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                {/* Navigation Tabs (Image Style) */}
                <div className="flex flex-wrap gap-3 mb-8 border-b pb-4">
                    {['category', 'sub-category', 'sub-sub-category'].map((tab) => (
                        <button
                            key={tab}
                            type="button" // Type button zaroori hai taaki form submit na ho jaye
                            onClick={() => setSetupType(tab)}
                            className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${setupType === tab
                                ? 'bg-[#007bff] text-white shadow-md'
                                : 'bg-[#f1f5f9] text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* English(EN) Tab Indicator */}
                <div className="inline-block border-b-2 border-blue-500 pb-1 mb-8">
                    <span className="text-blue-600 font-bold text-sm px-2">English(EN)</span>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Left Side: Inputs */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Category Name* (EN)</label>
                                <input
                                    type="text" placeholder="New Category" required
                                    className="w-full border border-gray-200 rounded-lg p-3 bg-[#fcfcfc] outline-none focus:border-blue-400"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-1 text-sm font-bold mb-2">
                                    Priority <Info size={14} className="text-gray-400" />
                                </label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-3 bg-[#fcfcfc] outline-none appearance-none"
                                    value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="">Set Priority</option>
                                    {[...Array(10)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                </select>
                            </div>

                            {/* Conditional Parent Selection */}
                            {setupType !== 'category' && (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Select Parent*</label>
                                    <select
                                        required className="w-full border border-gray-200 rounded-lg p-3 bg-[#fcfcfc]"
                                        value={formData.parent} onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                    >
                                        <option value="">Choose Parent</option>
                                        {allCategories.filter(c => setupType === 'sub-category' ? c.level === 1 : c.level === 2)
                                            .map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold mb-2">
                                    Category Logo* <span className="text-cyan-500 font-normal">Ratio 1:1 (500 x 500 px)</span>
                                </label>
                                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                    <input
                                        type="text" placeholder="Choose File" readOnly
                                        className="flex-1 p-3 bg-white text-gray-400 text-sm"
                                        value={formData.image ? "Image Selected" : ""}
                                    />
                                    <label className="bg-white px-6 py-3 border-l border-gray-200 cursor-pointer font-medium hover:bg-gray-50">
                                        Browse
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Preview */}
                        <div className="flex flex-col items-center justify-start">
                            <div className="w-full max-w-[280px] aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-[#f8fafc] overflow-hidden">
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-contain" alt="preview" />
                                ) : (
                                    <UploadCloud size={80} strokeWidth={1} className="text-gray-300" />
                                )}
                            </div>
                            <p className="mt-4 text-xs text-cyan-600">Devel: Ratio 1:1 (500 x 500 px)</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-12">
                        <button type="button" onClick={resetForm} className="px-8 py-2 bg-[#f1f5f9] rounded-md font-bold text-gray-600 hover:bg-gray-200">Reset</button>
                        <button type="submit" className="px-8 py-2 bg-[#007bff] text-white rounded-md font-bold shadow-lg shadow-blue-200 hover:bg-blue-700">
                            {editId ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table List Section */}
            <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex flex-col lg:flex-row justify-between items-center bg-gray-50/50 gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg text-[#1e293b] capitalize">{setupType} List</h2>
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-100">
                            {filteredList.length}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 lg:w-64">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Export Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-[#007bff] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md">
                                <Download size={16} />
                                Export
                                <ChevronDown size={14} />
                            </button>

                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                <button onClick={exportToExcel} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors border-b">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Excel (.xlsx)
                                </button>
                                <button onClick={exportToPDF} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    PDF (.pdf)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f8fafc] text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-center">ID</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.map((item, index) => (
                                <tr key={item._id} className="hover:bg-blue-50/30 transition">
                                    <td className="px-6 py-4 text-center text-gray-400">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <img src={item.image || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-md border" alt="" />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#475569]">{item.name}</td>
                                    <td className="px-6 py-4">{item.priority}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => { setEditId(item._id); setFormData(item); window.scrollTo(0, 0); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-md"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategorySetup;
"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//src/components/admin/Employees/EmployeeList.js
export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const data = await fetchFromAPI("/employees");
      setEmployees(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch employees ❌");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete Employee
  const deleteEmployee = async (emp) => {
    try {

      const url = emp.type === "DELIVERY_BOY" ? `/deliveryman/delete/${emp._id}` : `/employees/${emp._id}`;

      await fetchFromAPI(url, {
        method: "DELETE",
      });

      toast.success("Deleted Successfully");
      fetchEmployees();

    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Toggle status
  const toggleStatus = async (emp) => {

    if (emp.type === "DELIVERY_BOY") {

      await fetchFromAPI(`/deliveryman/block/${emp._id}`, {
        method: "PUT",
      });

    } else {

      const newStatus = emp.status === "active" ? "inactive" : "active";

      await fetchFromAPI(`/employees/status/${emp._id}`, {

        method: "PATCH",
        body: JSON.stringify({ status: newStatus, }),
      });
    }
    fetchEmployees();
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4 text-black">Employee List</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-gray-900">
            <th>No</th>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp._id} className="text-center border text-gray-900">
              <td>{index + 1}</td>
              <td>{emp._id}</td>
              <td>
                <img src={emp.image?.url || "/default-user.png"}
                  alt={emp.name}
                  className="w-10 h-10 rounded-full object-cover mx-auto"
                />
              </td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              {/* ✅ ACTION */}
              <td>
                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleStatus(emp)}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${emp.status === "active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                >
                  {emp.status === "active" ? "Active" : "Inactive"}
                </button>

                <button
                  onClick={() => deleteEmployee(emp)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
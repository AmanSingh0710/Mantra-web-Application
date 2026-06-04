"use client";

import { fetchFromAPI, BASE_URL } from "@/utils/api";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const data = await fetchFromAPI("/employees");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch employees ❌");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete Employee
  const deleteEmployee = async (id) => {
    try {
      await fetchFromAPI(`/employees/${id}`, {
        method: "DELETE",
      });

      toast.success("Employee deleted ✅");
      fetchEmployees();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await fetchFromAPI(`/employees/status/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(`Employee marked as ${newStatus}`);

      // Update UI instantly
      setEmployees(prev =>
        prev.map(emp =>
          emp._id === id ? { ...emp, status: newStatus } : emp
        )
      );
    } catch (err) {
      toast.error("Status update failed ❌");
    }
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

              {/* ✅ ID */}
              <td>{emp._id}</td>

              {/* ✅ IMAGE */}
              <td>
                <img
                  src={
                    emp.employeeImage
                      ? `${BASE_URL}/uploads/${emp.employeeImage}`
                      : "/default-user.png"
                  }
                  width={40}
                  height={40}
                  className="rounded-full mx-auto"
                />
              </td>

              {/* ✅ NAME */}
              <td>{emp.firstName} {emp.lastName}</td>

              {/* ✅ EMAIL */}
              <td>{emp.email}</td>

              {/* ✅ ROLE */}
              <td>{emp.role}</td>

              {/* ✅ ACTION */}
              <td>

                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleStatus(emp._id, emp.status)}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${emp.status === "active"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                >
                  {emp.status === "active" ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => deleteEmployee(emp._id)}
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
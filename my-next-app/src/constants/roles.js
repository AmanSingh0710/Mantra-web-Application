import { FaUserShield, FaUserEdit, FaUserTie, FaHeadset, FaTruck } from "react-icons/fa";

export const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    desc: "Full system access, manage security settings, and financial reports.",
    icon: <FaUserShield className="text-blue-600" />,
    color: "bg-blue-50",
    accent: "group-hover:bg-blue-500"
  },
  MANAGER: {
    label: "Manager",
    desc: "Oversee team operations, approve requests, and view analytics.",
    icon: <FaUserTie className="text-purple-600" />,
    color: "bg-purple-50",
    accent: "group-hover:bg-purple-500"
  },
  EDITOR: {
    label: "Editor",
    desc: "Modify content, update product listings, and manage posts.",
    icon: <FaUserEdit className="text-emerald-600" />,
    color: "bg-emerald-50",
    accent: "group-hover:bg-emerald-500"
  },
  SUPPORT: {
    label: "Support",
    desc: "Access customer tickets, order history, and handle live chats.",
    icon: <FaHeadset className="text-orange-600" />,
    color: "bg-orange-50",
    accent: "group-hover:bg-orange-500"
  },
  DELIVERY: {
    label: "Delivery Partner",
    desc: "Responsible for order fulfillment and logistics.",
    icon: <FaTruck className="text-red-600" />,
    color: "bg-red-50",
    accent: "group-hover:bg-red-500"
  },
  // Fallback for when role is missing
  UNKNOWN: {
    label: "Staff Member",
    desc: "Organizational staff with general access.",
    icon: <FaUserTie className="text-gray-600" />,
    color: "bg-gray-50",
    accent: "group-hover:bg-gray-400"
  }
};
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import HradminNavbar from "../../components/HradminNavbar";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import withAuth from "@/components/withAuth";

const Overview = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState({});
  const [balanceError, setBalanceError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { leaveHistory } = useSelector((state) => state.leaveReducer);

  const fetchLeaveBalance = async () => {
    setIsLoadingBalance(true);
    setBalanceError(null);
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leave-balance/current/EMP001`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setLeaveBalance(response.data);
      }
    } catch (error) {
      setBalanceError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch leave balance"
      );
      toast.error("Failed to fetch leave balance");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view dashboard");
      window.location.href = "/login";
      return;
    }
    fetchLeaveBalance();
  }, [token]);

  // Refetch balance when leave history changes
  useEffect(() => {
    if (token) {
      fetchLeaveBalance();
    }
  }, [leaveHistory, token]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddLeadClick = () => {
    setShowAddLeadForm(true);
  };

  const handleFormChange = (e) => {
    setLeadFormData({ ...leadFormData, [e.target.name]: e.target.value });
  };
  const handleFormClose = () => {
    setShowAddLeadForm(false);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        currentRole={"employee"}
      />

      {/* Main Content */}
      <div
        className={`flex-1 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <HradminNavbar />

        {/* Main Content Area */}
        <div className="p-5 bg-gray-100 h-full">
          {/* Page Heading */}
          <div className="mb-10 pt-16">
            <h1 className="text-2xl font-bold text-gray-800 text-left">
              Employee Dashboard
            </h1>
          </div>

          {/* Cards Container */} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Balance Card */}
            <Link href="/employee/leaves">
              <div
                className="p-8 bg-white shadow-lg rounded-xl flex flex-col justify-between items-start hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer border border-gray-100"
                style={{ height: "250px", width: "350px" }}
              >
                <div className="flex justify-between items-center w-full mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Leave Balance
                  </h2>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full">
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                  </div>
                </div>
                {isLoadingBalance ? (
                  <div className="text-gray-500">Loading leave balance...</div>
                ) : balanceError ? (
                  <div className="text-red-500">{balanceError}</div>
                ) : leaveBalance ? (
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-gray-900">
                      {leaveBalance.newLeaveBalance}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <p className="text-sm">Days remaining</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    No leave balance data available
                  </div>
                )}
              </div>
            </Link>
            {/* Add Lead Card */}
            <div
              onClick={handleAddLeadClick}
              className="p-8 bg-white shadow-lg rounded-xl flex flex-col justify-between items-start hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer border border-gray-100"
              style={{ height: "250px", width: "350px" }}
            >
              <div className="flex justify-between items-center w-full mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add a Lead
                </h2>
                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-full">
                  <FaPlus className="text-green-600 text-2xl" />
                </div>
              </div>
              <p className="text-gray-600">Click here to add a new lead.</p>
            </div>
            {/* Add Lead Form (Modal) */}
            {showAddLeadForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
                <div className="bg-white p-8 rounded-lg max-w-screen-md w-full mx-4 relative max-h-[90vh] overflow-y-auto">
                  <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-3xl" onClick={handleFormClose}>×</button>
                  <h2 className="text-2xl font-bold mb-6 text-center">Add New Lead</h2>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name
                      </label>
                       <input
                        type="text"
                        name="name"
                        onChange={handleFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        onChange={handleFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                      <input
                        type="email"
                        name="email"
                        onChange={handleFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Project Type
                      </label>
                      <Select name="projectType" onValueChange={(value) => handleFormChange({ target: { name: 'projectType', value } })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2BHK Flat">2BHK Flat</SelectItem>
                          <SelectItem value="3BHK Flat">3BHK Flat</SelectItem>
                          <SelectItem value="4BHK Flat">4BHK Flat</SelectItem>
                          <SelectItem value="2BHK Villa">2BHK Villa</SelectItem>
                          <SelectItem value="3BHK Villa">3BHK Villa</SelectItem>
                          <SelectItem value="4BHK Villa">4BHK Villa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Project Address</label>
                      <input type="text" name="projectAddress" onChange={handleFormChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Expected Amount
                      </label>
                      <input
                        type="number" name="expectedAmount" onChange={handleFormChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Overview);

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Search, UserPlus } from "lucide-react";
import { TableRow, TableHead, TableCell } from "@/components/ui/table";
import cn from "classnames";

const Attendance = () => {
  const [activePage, setActivePage] = useState("attendance");
  const [activeTab, setActiveTab] = useState("Attendance Tracker");
  const [employees, setEmployees] = useState([]);
  const [dates, setDates] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    const generateDates = () => {
      return Array.from({ length: 31 }, (_, i) => {
        const date = new Date(2023, 0, i + 1); // January 2023
        return {
          month: date.toLocaleString("default", { month: "short" }),
          day: String(date.getDate()).padStart(2, "0"),
          weekday: date.toLocaleString("default", { weekday: "short" }),
        };
      });
    };

    setDates(generateDates());
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/attendance")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) =>
        console.error("Error fetching attendance data:", error)
      );
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  console.log(filteredEmployees);
  

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <header className="fixed top-0 left-0 right-0 w-full bg-gray-100 shadow-md px-10 py-4 flex justify-between items-start z-50">
        <h1 className="text-2xl font-bold text-black">MEDHIR</h1>
        <nav className="flex flex-grow justify-center space-x-24 text-xl font-medium">
          <button
            onClick={() => router.push("/hradmin/employees")}
            className={`hover:text-blue-600 ${
              router.pathname === "/hradmin/employees"
                ? "text-blue-600 font-bold"
                : "text-black"
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => router.push("/hradmin/attendance")}
            className={`hover:text-blue-600 ${
              router.pathname === "/hradmin/attendance"
                ? "text-blue-600 font-bold"
                : "text-black"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => router.push("/hradmin/payroll")}
            className={`hover:text-blue-600 ${
              router.pathname === "/hradmin/payroll"
                ? "text-blue-600 font-bold"
                : "text-black"
            }`}
          >
            Payroll
          </button>
          <button
            onClick={() => router.push("/hradmin/settings")}
            className={`hover:text-blue-600 ${
              router.pathname === "/hradmin/settings"
                ? "text-blue-600 font-bold"
                : "text-black"
            }`}
          >
            Settings
          </button>
        </nav>
      </header>

      {/* Search Box */}
      <div className="h-5" />
      <div className="p-10">
        <div className="mt-2 p-4 rounded-lg bg-gray-200 flex justify-between items-center">
        <button
            onClick={() => router.push("/hradmin/edit")}
            className="flex items-center hover:text-blue-600 text-black"
          >
            <Edit className="mr-2" size={20} />
            Edit
          </button>
          <div className="flex w-screen justify-center">
            <div className="relative w-[60%]">
              <Input
                placeholder="Search"
                className="w-full bg-gray-100 text-black border border-gray-300 pr-10 text-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={24}
              />
            </div>
          </div>
        </div>

        {/* Sub Navbar */}
        <div className="bg-gray-300 p-3 rounded-md mt-4 flex justify-between text-lg shadow-md mx-auto ">
          {["Attendance Tracker", "Leave Tracker", "Basic", "ID Proofs"].map(
            (tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`ml-10 mr-10 hover:text-blue-600 ${
                  activeTab === tab ? "text-blue-600 font-bold" : "text-black"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>
      {activeTab === "Attendance Tracker" && (
        <div className="overflow-container mt-[-2] max-h-[calc(100vh-300px)]">
          <div className="overflow-container max-h-[calc(100vh-300px)]">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="border-r border-gray-300 table-head-start text-xs">
                    Employee ID
                  </TableHead>
                  <TableHead className="border-r border-gray-300 table-head-start text-xs">
                    Name
                  </TableHead>
                  <TableHead className="border-r border-gray-300 table-head-start text-xs">
                    Department
                  </TableHead>
                  <TableHead className="border-r border-gray-300 table-head-start text-xs">
                    P / T.W.D.
                  </TableHead>
                  {dates.map((date, index) => (
                    <TableHead
                      key={index}
                      className={cn(
                        "text-center border-r border-gray-300 text-xs table-head-center",
                        date.day === "18" &&
                          date.month === "Jan" &&
                          "current-day-column"
                      )}
                    >
                      <div className="date-column">
                        <span>{date.month}</span>
                        <span>{date.day}</span>
                        <span>{date.weekday}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                  >
                    <TableCell className="border-r border-gray-300 table-cell-center text-xs">
                      {employee.id}
                    </TableCell>
                    <TableCell className="border-r border-gray-300 text-xs">
                      {employee.name}
                    </TableCell>
                    <TableCell className="border-r border-gray-300 text-xs">
                      {employee.department}
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-300">
                      {employee.p_twd}
                    </TableCell>
                    {employee.attendance.map((status, index) => (
                      <TableCell
                        key={index}
                        className="text-center border-r border-gray-300 p-0 pl-1 justify-center items-center"
                      >
                        <span
                          className={cn(
                            "w-8 h-7 rounded text-sm",
                            status === "P" && "present-status",
                            status === "A" && "absent-status",
                            status === "WK" && "weekoff-status",
                            status === "CL" && "casual-leave-status",
                            status !== "" && "glassmorphism", // Apply glassmorphism only if status is not empty
                            status === " " && "border border-gray-300"
                          )}
                        >
                          {status}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "Leave Tracker" && (
        <div className="overflow-auto max-h-[calc(100vh-300px)]">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="sticky top-0 bg-white z-10">
              <TableRow>
                {[
                  "Employee ID",
                  "Name",
                  "Department",
                  "No. of Payable Days",
                  "Leaves Taken",
                  "Leaves Earned",
                  "Carried Forward Leaves",
                  "Net Leaves",
                ].map((heading, index) => (
                  <TableHead
                    key={index}
                    className="border-r border-gray-300 text-xs"
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="border-r border-gray-300 text-xs">
                    {employee.id}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    {employee.name}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    {employee.department}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    25
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    2
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    1
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    3
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-xs">
                    4
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Attendance;

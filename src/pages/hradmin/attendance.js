import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import cn from "classnames";

const dates = [
  { month: "Jan", day: "02", weekday: "Sun" },
  { month: "Jan", day: "03", weekday: "Mon" },
  { month: "Jan", day: "04", weekday: "Tue" },
  { month: "Jan", day: "05", weekday: "Wed" },
  { month: "Jan", day: "06", weekday: "Thu" },
  { month: "Jan", day: "07", weekday: "Fri" },
  { month: "Jan", day: "08", weekday: "Sat" },
  { month: "Jan", day: "09", weekday: "Sun" },
  { month: "Jan", day: "10", weekday: "Mon" },
  { month: "Jan", day: "11", weekday: "Tue" },
  { month: "Jan", day: "12", weekday: "Wed" },
  { month: "Jan", day: "13", weekday: "Thu" },
  { month: "Jan", day: "14", weekday: "Fri" },
  { month: "Jan", day: "15", weekday: "Sat" },
  { month: "Jan", day: "16", weekday: "Sun" },
  { month: "Jan", day: "17", weekday: "Mon" },
  { month: "Jan", day: "18", weekday: "Tue" },
  { month: "Jan", day: "19", weekday: "Wed" },
];

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [activePage, setActivePage] = useState("attendance");
  const [employees, setEmployees] = useState([]);
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short" };
    const month = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    return { month, day, weekday };
  };

  const handleRowClick = (attendance) => {
    router.push({
      pathname: "/hradmin/addNewEmployee",
      query: { attendance: JSON.stringify(attendance) },
    });
  };

  useEffect(() => {
    fetch("http://localhost:5000/attendance")
      .then((response) => response.json())
      .then((data) => setAttendanceData(data))
      .catch((error) =>
        console.error("Error fetching attendance data:", error)
      );
  }, []);

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  const mainTabs = [];

  const handleTabClick = (tab) => {
    setActiveTab(tab.value);
  };

  const navigateToEmployees = () => {
    router.push("/hradmin/employees");
  };

  return (
    <div className="bg-white text-black min-h-screen p-6">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 w-full bg-gray-100 shadow-md px-10 py-4 flex justify-between items-start z-50">
        <h1 className="text-2xl font-bold text-black">MEDHIR</h1>
        <nav className="flex flex-grow justify-center space-x-24 text-xl font-medium">
          <button
            onClick={navigateToEmployees}
            className="hover:text-blue-600 text-black"
          >
            Employees
          </button>
          <button
            onClick={() => router.push("/hradmin/attendance")}
            className="hover:text-blue-600 text-black"
          >
            Attendance
          </button>
          <button className="hover:text-blue-600 text-black">Payroll</button>
          <button className="hover:text-blue-600 text-black">Settings</button>
        </nav>
        <Button className="bg-green-600 hover:bg-green-500 text-white">
          Logout
        </Button>
      </header>

      {/* Search Box */}
      <div className="h-5" />
      <div className="p-10">
        <div className="mt-2 p-4 rounded-lg bg-gray-200 flex justify-between items-center">
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white flex items-center"
            onClick={() => router.push("/hradmin/addNewEmployee")}
          >
            <UserPlus className="mr-2" size={20} /> Add New Employee
          </Button>
          <div className="flex w-screen justify-center">
            <div className="relative w-[60%]">
              <Input
                placeholder="Search"
                className="w-full bg-gray-100 text-black border border-gray-300 pr-10 text-lg"
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
          {mainTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab)}
              className={`ml-10 mr-10 hover:text-blue-600 ${
                activeTab === tab.value
                  ? "text-blue-600 font-bold"
                  : "text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <Card className="overflow-auto">
            <CardContent>
              <Table className="border border-gray-300">
                <TableHeader>
                  <TableRow className="border-b border-gray-300">
                    <TableHead className="border-r border-gray-300 h-12 text-center px-4">
                      ID
                    </TableHead>
                    <TableHead className="border-r border-gray-300 h-12 px-4 text-left">
                      Name
                    </TableHead>
                    <TableHead className="border-r border-gray-300 h-12 px-4 text-left">
                      Department
                    </TableHead>
                    <TableHead className="border-r border-gray-300 h-12 px-4 text-center">
                      P / T.W.D.
                    </TableHead>

                    {dates.map((date, index) => (
                      <TableHead
                        key={index}
                        className="text-center border-r border-gray-300 text-sm px-2"
                      >
                        <div className="date-column flex flex-col">
                          <span className="text-gray-500 text-xs">
                            {date.month}
                          </span>
                          <span className="font-semibold">{date.day}</span>
                          <span className="text-gray-500 text-xs">
                            {date.weekday}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {attendanceData.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="border-b border-gray-300"
                    >
                      <TableCell className="border-r border-gray-300">
                        {employee.id}
                      </TableCell>
                      <TableCell className="border-r border-gray-300">
                        {employee.name}
                      </TableCell>
                      <TableCell className="border-r border-gray-300">
                        {employee.department}
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-300">
                        {employee.p_twd}
                      </TableCell>
                      {employee.attendance.map((status, index) => (
                        <TableCell
                          key={index}
                          className="text-center border-r border-gray-300 p-1"
                        >
                          <span
                            className={cn(
                              "w-12 h-11 rounded text-sm flex items-center justify-center glassmorphism",
                              status === "P" && "present-status",
                              status === "A" && "absent-status",
                              status === "WK" && "weekoff-status",
                              !status && "border border-gray-300"
                            )}
                          >
                            {status}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

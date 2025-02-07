import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { fetchEmployees } from "@/utils/api";

export default function HradminCompanies() {
    const [activeTab, setActiveTab] = useState("Employee");
    const [employees, setEmployees] = useState([]);
    const router = useRouter();

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/hradmin/employees'); // Adjust the API endpoint as needed
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="bg-white text-black min-h-screen p-6">
            {/* Top Navbar */}
            <header className="fixed top-0 left-0 right-0 w-full bg-gray-100 shadow-md px-10 py-4 flex justify-between items-start z-50">
                <h1 className="text-2xl font-bold text-black">MEDHIR</h1>
                <nav className="flex flex-grow justify-center space-x-24 text-xl font-medium">
                    {["Employees", "Attendance", "Payroll", "Settings"].map((item, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveTab(item)} 
                            className={`hover:text-blue-600 ${activeTab === item ? "text-blue-600 font-bold" : "text-black"}`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
                <Button className="bg-green-600 hover:bg-green-500 text-white">Logout</Button>
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
                            <Input placeholder="Search" className="w-full bg-gray-100 text-black border border-gray-300 pr-10 text-lg" />
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Sub Navbar */}
                <div className="bg-gray-300 p-3 rounded-md mt-4 flex justify-between text-lg shadow-md mx-auto ">
                    {["Basic", "ID Proofs", "Salary", "Bank Details", "Leaves Policy"].map((tab, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveTab(tab)} 
                            className={`ml-10 mr-10 hover:text-blue-600 ${activeTab === tab ? "text-blue-600 font-bold" : "text-black"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table Section */}
                <div className="mt-6 bg-gradient-to-b from-gray-200 to-gray-300 p-4 shadow-md rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {["Name", "Email", "Phone no.", "Department", "Gender", "Title", "Reporting Manager"].map((heading, index) => (
                                    <TableHead key={index} className="text-left">{heading}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employees, index) => (
                                <TableRow key={index}>
                                <TableCell>{employees.name}</TableCell>
                                <TableCell>{employees.email}</TableCell>
                                <TableCell>{employees.phone}</TableCell>
                                <TableCell>{employees.department}</TableCell>
                                <TableCell>{employees.gender}</TableCell>
                                <TableCell>{employees.title}</TableCell>
                                <TableCell>{employees.reportingManager}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

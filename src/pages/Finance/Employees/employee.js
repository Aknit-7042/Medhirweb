// Employee page implementation based on PRD
import { useState } from 'react';
import { FaReceipt, FaPlus, FaSearch, FaFileInvoice } from 'react-icons/fa';
import Modal from '../../../components/Modal';
import { AddExpenseForm } from '../../../components/Forms';

const Employee = () => {
  const [activeTab, setActiveTab] = useState('expenses'); // Default to expenses tab
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '22-06-25',
      expenseType: 'Travel',
      amount: 2500,
      paidBy: 'Employee',
      vendor: 'Uber India',
      projectJob: 'Project A',
      description: 'Airport taxi from airport to office',
      status: 'Approved',
      receipt: 'Yes'
    },
    {
      id: 2,
      date: '21-06-25',
      expenseType: 'Meals',
      amount: 1200,
      paidBy: 'Company',
      vendor: 'Café Coffee Day',
      projectJob: 'Project B',
      description: 'Client lunch meeting',
      status: 'Pending',
      receipt: 'No'
    },
    {
      id: 3,
      date: '20-06-25',
      expenseType: 'Office Supplies',
      amount: 850,
      paidBy: 'Employee',
      vendor: 'Amazon India',
      projectJob: 'Internal Development',
      description: 'Printer cartridges and paper',
      status: 'Submitted',
      receipt: 'Yes'
    },
    {
      id: 4,
      date: '19-06-25',
      expenseType: 'Software',
      amount: 5000,
      paidBy: 'Company',
      vendor: 'Adobe Systems',
      projectJob: 'Marketing Campaign',
      description: 'Adobe Creative Suite license',
      status: 'Approved',
      receipt: 'Yes'
    }
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddExpense = () => {
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
  };

  const handleExpenseSubmit = (expenseData) => {
    // Add the new expense to the expenses array
    setExpenses(prev => [...prev, {
      id: prev.length + 1,
      date: expenseData.date,
      expenseType: expenseData.expenseType,
      amount: expenseData.amount,
      paidBy: expenseData.paidBy,
      vendor: expenseData.vendor || '-',
      projectJob: expenseData.projectJob || '-',
      description: expenseData.description,
      status: expenseData.status || 'Draft',
      receipt: expenseData.receipt ? 'Yes' : 'No'
    }]);
    
    // Close the modal
    setIsExpenseModalOpen(false);
    
    // You could also show a success message here
    console.log('Expense added successfully:', expenseData);
  };

  const tabs = [
    { id: 'expenses', label: 'Expenses', icon: FaReceipt },
    { id: 'reimbursement', label: 'Reimbursement', icon: FaFileInvoice },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'expenses':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
              </div>
              <button 
                onClick={handleAddExpense}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Expense Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Paid By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project/Job</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{expense.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{expense.expenseType}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          expense.paidBy === 'Employee' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {expense.paidBy}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm ${expense.vendor !== '-' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                          {expense.vendor}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm ${expense.projectJob !== '-' ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                          {expense.projectJob}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={expense.description}>
                        {expense.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          expense.receipt === 'Yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {expense.receipt === 'Yes' ? '📎' : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'reimbursement':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reimbursements..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Add Reimbursement</span>
              </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Request #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">REIMB-001</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">2024-07-29</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(125.50)}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">Travel</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">REIMB-002</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">2024-07-28</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(89.75)}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">Meals</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">REIMB-003</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Mike Johnson</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">2024-07-27</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(250.00)}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">Office Supplies</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Rejected
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees</h1>
        <p className="text-gray-600">Manage employee expenses and reimbursements</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderContent()}
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        title="Add New Expense"
        size="full"
      >
        <AddExpenseForm
          onSubmit={handleExpenseSubmit}
          onCancel={handleCloseExpenseModal}
        />
      </Modal>
    </div>
  );
};

export default Employee;

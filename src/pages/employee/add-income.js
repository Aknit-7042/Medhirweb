import React, { useState, useEffect, forwardRef } from "react";
import HradminNavbar from "../../components/HradminNavbar";
import Sidebar from "../../components/Sidebar";
import withAuth from "@/components/withAuth";
import { useRouter } from "next/router";
import {
  fetchIncomeByEmployeeId,
  createIncome,
  updateIncome,
} from "@/redux/slices/incomesSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMoneyBillWave, FaCreditCard, FaUniversity, FaMobileAlt, FaFileInvoiceDollar, FaCalendarAlt } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";

const paymentMethods = [
  { value: "bank_transfer", label: "Bank Transfer/NEFT/RTGS", icon: FaUniversity },
  { value: "upi", label: "UPI (GPay, PhonePe, Paytm)", icon: FaMobileAlt },
  { value: "cash", label: "Cash", icon: BsCashCoin },
  { value: "cheque", label: "Cheque", icon: FaFileInvoiceDollar },
  { value: "credit_card", label: "Credit Card", icon: FaCreditCard },
  { value: "online", label: "Online Payment Gateway", icon: FaMoneyBillWave },
  { value: "other", label: "Other", icon: FaMoneyBillWave },
];

const paymentTypes = [
  { value: '', label: 'Select payment type' },
  { value: 'advance', label: 'Advance Payment' },
  { value: 'half', label: '50% Completion' },
  { value: 'final', label: 'Final Payment' },
];

// Custom input for DatePicker
const CalendarInput = forwardRef(({ value, onClick, placeholder, error }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      background: "#f3f4f6",
      border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
      borderRadius: 6,
      height: 44,
      padding: "0 14px",
      cursor: "pointer",
      marginTop: 6,
    }}
  >
    <FaCalendarAlt style={{ color: "#6b7280", fontSize: 18, marginRight: 10 }} />
    <span style={{ color: value ? "#1f2937" : "#6b7280", fontSize: 16 }}>
      {value || placeholder}
    </span>
  </div>
));

const AddIncome = () => {
  const employee = sessionStorage.getItem("employeeId");
  const { incomes, loading, error } = useSelector((state) => state.incomes);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const isEdit = Boolean(id);
  const editIncome = incomes.find((i) => i.incomeId === id);

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [otherPaymentMethod, setOtherPaymentMethod] = useState("");
  const [filePreview, setFilePreview] = useState(null);

  const [form, setForm] = useState({
    submittedBy: employee,
    projectId: "",
    clientName: "",
    amount: "",
    paymentType: "",
    paymentMethod: "",
    paymentDate: new Date(),
    invoiceReference: "",
    initiated: "",
    file: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "amount") {
      // Format amount with thousand separators
      const numericValue = value.replace(/[^0-9.]/g, "");
      if (numericValue === "" || /^\d*\.?\d{0,2}$/.test(numericValue)) {
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setForm(prev => ({ ...prev, [name]: formattedValue }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, paymentDate: date }));
    if (formErrors.paymentDate) {
      setFormErrors(prev => ({ ...prev, paymentDate: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, file: file.name }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
    
    if (formErrors.file) {
      setFormErrors(prev => ({ ...prev, file: "" }));
    }
  };

  useEffect(() => {
    dispatch(fetchIncomeByEmployeeId());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && editIncome) {
      setForm({
        submittedBy: employee,
        projectId: editIncome.projectId || "",
        clientName: editIncome.clientName || "",
        amount: editIncome.amount ? editIncome.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
        paymentType: editIncome.paymentType || "",
        paymentMethod: editIncome.paymentMethod || "",
        paymentDate: editIncome.paymentDate ? new Date(editIncome.paymentDate) : new Date(),
        invoiceReference: editIncome.invoiceReference || "",
        initiated: editIncome.initiated || "",
        file: editIncome.file || "",
        comments: editIncome.comments || "",
      });
    }
  }, [isEdit, editIncome]);

  const validateForm = () => {
    const errors = {};
    if (!form.projectId) errors.projectId = "Project ID is required";
    if (!form.clientName) errors.clientName = "Client Name is required";
    if (!form.amount) errors.amount = "Amount is required";
    if (!form.paymentType) errors.paymentType = "Payment type is required";
    if (!form.paymentMethod) errors.paymentMethod = "Payment method is required";
    if (form.paymentMethod === "other" && !otherPaymentMethod) {
      errors.otherPaymentMethod = "Please specify payment method";
    }
    if (!form.paymentDate) errors.paymentDate = "Payment date is required";
    if (!form.file) errors.file = "Payment proof is required";
    
    const numericAmount = parseFloat(form.amount.replace(/,/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      errors.amount = "Amount must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const incomeData = {
        submittedBy: employee,
        companyId: sessionStorage.getItem("employeeCompanyId"),
        projectId: form.projectId,
        clientName: form.clientName,
        amount: parseFloat(form.amount.replace(/,/g, "")),
        paymentType: form.paymentType,
        paymentMethod: form.paymentMethod === "other" ? otherPaymentMethod : form.paymentMethod,
        paymentDate: form.paymentDate.toISOString(),
        invoiceReference: form.invoiceReference,
        initiated: isEdit ? editIncome?.initiated : formattedDate,
        file: form.file,
        comments: form.comments,
        status: isEdit ? editIncome?.status : "Pending",
      };

      if (isEdit) {
        await dispatch(updateIncome({ ...incomeData, id })).unwrap();
      } else {
        await dispatch(createIncome(incomeData)).unwrap();
      }

      router.push("/employee/income");
    } catch (error) {
      toast.error(error || "Failed to save payment. Please try again.");
    }
  };

  return (
    <>
      <HradminNavbar />
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div
        style={{
          maxWidth: 800,
          margin: isSidebarCollapsed ? "80px 0 0 120px" : "80px 0 0 290px",
          background: "#f8fafc",
          borderRadius: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: 36,
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 28 }}>
          {isEdit ? "Edit Payment Record" : "Record Payment"}
        </h2>
        
        <div style={{ color: "#ef4444", fontSize: 14, marginBottom: 24 }}>
          Required fields are marked with *
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Project & Client Information */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>
              Project & Client Information
            </h3>
            <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500 }}>Project ID *</label>
                <input
                  type="text"
                  name="projectId"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: formErrors.projectId ? "1px solid #ef4444" : "1px solid #e5e7eb",
                    background: "#f8fafc",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
                    fontSize: 16,
                  }}
                  value={form.projectId}
                  onChange={handleChange}
                  placeholder="e.g., PROJ-001"
                />
                {formErrors.projectId && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.projectId}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500 }}>Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: formErrors.clientName ? "1px solid #ef4444" : "1px solid #e5e7eb",
                    background: "#f8fafc",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
                    fontSize: 16,
                  }}
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corporation"
                />
                {formErrors.clientName && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.clientName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Payment Details */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>
              Payment Details
            </h3>
            <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500 }}>Amount Received *</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6b7280",
                      pointerEvents: "none",
                    }}
                  >
                    ₹
                  </span>
                  <input
                    type="text"
                    name="amount"
                    style={{
                      width: "100%",
                      marginTop: 6,
                      padding: "10px 10px 10px 30px",
                      borderRadius: 6,
                      border: formErrors.amount
                        ? "1px solid #ef4444"
                        : "1px solid #e5e7eb",
                      background: "#f3f4f6",
                      color: form.amount ? "#1f2937" : "#6b7280",
                    }}
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>
                {formErrors.amount && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.amount}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500 }}>Payment Method *</label>
                <select
                  name="paymentMethod"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: formErrors.paymentMethod
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    background: "#f8fafc",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
                    cursor: "pointer",
                    fontSize: 16,
                    appearance: "none",
                    color: form.paymentMethod ? "#1f2937" : "#6b7280",
                  }}
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Choose payment method</option>
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    );
                  })}
                </select>
                {formErrors.paymentMethod && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.paymentMethod}
                  </div>
                )}
              </div>
            </div>

            {form.paymentMethod === "other" && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 500 }}>Specify Payment Method *</label>
                <input
                  type="text"
                  name="otherPaymentMethod"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: 10,
                    borderRadius: 6,
                    border: formErrors.otherPaymentMethod
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    background: "#f3f4f6",
                  }}
                  value={otherPaymentMethod}
                  onChange={(e) => setOtherPaymentMethod(e.target.value)}
                  placeholder="Enter payment method"
                />
                {formErrors.otherPaymentMethod && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.otherPaymentMethod}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500 }}>Payment Date *</label>
                <DatePicker
                  selected={form.paymentDate}
                  onChange={handleDateChange}
                  dateFormat="dd MMM yyyy"
                  showPopperArrow={false}
                  calendarClassName="custom-calendar"
                  popperClassName="custom-popper"
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: "offset",
                      options: {
                        offset: [0, 8],
                      },
                    },
                  ]}
                  customInput={
                    <CalendarInput
                      error={!!formErrors.paymentDate}
                      placeholder="Select payment date"
                    />
                  }
                />
                {formErrors.paymentDate && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.paymentDate}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500 }}>Payment Type *</label>
                <select
                  name="paymentType"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: formErrors.paymentType ? "1px solid #ef4444" : "1px solid #e5e7eb",
                    background: "#f8fafc",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
                    cursor: "pointer",
                    fontSize: 16,
                    appearance: "none",
                    color: form.paymentType ? "#1f2937" : "#6b7280",
                  }}
                  value={form.paymentType}
                  onChange={handleChange}
                >
                  {paymentTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {formErrors.paymentType && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                    {formErrors.paymentType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Documentation */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>
              Documentation
            </h3>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Invoice Reference</label>
              <input
                type="text"
                name="invoiceReference"
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: 10,
                  borderRadius: 6,
                  border: formErrors.invoiceReference
                    ? "1px solid #ef4444"
                    : "1px solid #e5e7eb",
                  background: "#f3f4f6",
                }}
                value={form.invoiceReference}
                onChange={handleChange}
                placeholder="Enter invoice number (e.g., INV-2024-001)"
              />
              <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
                Format: INV-YYYY-XXX (Optional)
              </div>
              {formErrors.invoiceReference && (
                <div style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}>
                  {formErrors.invoiceReference}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Proof of Payment *</label>
              <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 20px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    marginRight: 16,
                    boxShadow: "0 1px 4px rgba(37,99,235,0.07)",
                  }}
                >
                  {form.file ? "Change File" : "Choose File"}
                </label>
                <span style={{ color: "#374151", fontSize: 15, fontWeight: 400 }}>
                  {form.file ? form.file : "No file chosen"}
                </span>
                {formErrors.file && (
                  <div style={{ color: "#ef4444", fontSize: 14, marginLeft: 8 }}>
                    {formErrors.file}
                  </div>
                )}
              </div>
              {filePreview && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={filePreview}
                    alt="File preview"
                    style={{
                      maxWidth: 200,
                      maxHeight: 200,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </div>
              )}
              <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
                Accepted formats: PDF, JPG, PNG
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 500 }}>Notes / Description</label>
              <textarea
                name="comments"
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#f3f4f6",
                }}
                rows={3}
                value={form.comments}
                onChange={handleChange}
                placeholder="Add payment details (e.g., 'Final payment for Project X' or '50% advance for Client Y')"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 24,
            }}
          >
            <button
              type="button"
              style={{
                background: "#fff",
                color: "#222",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "10px 24px",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {isEdit ? "Update Payment" : "Record Payment"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .custom-calendar {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .custom-calendar .react-datepicker__header {
          background-color: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .custom-calendar .react-datepicker__day {
          border-radius: 4px;
          margin: 0.2rem;
        }
        
        .custom-calendar .react-datepicker__day--selected {
          background-color: #2563eb;
          color: white;
        }
        
        .custom-calendar .react-datepicker__day:hover {
          background-color: #dbeafe;
        }
        
        .custom-popper {
          z-index: 1000;
        }

        .react-datepicker-wrapper {
          width: 100%;
        }

        .date-picker-no-bg {
          background: transparent !important;
        }
      `}</style>
    </>
  );
};

export default withAuth(AddIncome);

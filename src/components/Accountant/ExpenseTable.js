import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiFileText } from 'react-icons/fi';
import Tooltip from './Tooltip';

const statusColors = {
  Paid: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
  Pending: { background: '#fefce8', color: '#a16207', border: '1px solid #fef08a' },
  Rejected: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' },
};

const styles = {
  tableContainer: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowX: 'auto',
    padding: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'Inter', sans-serif",
  },
  th: {
    padding: '16px 24px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#4b5563',
    borderBottom: '2px solid #e5e7eb',
    background: '#f9fafb',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '14px 24px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
    fontSize: '0.875rem',
    transition: 'background 0.2s',
    lineHeight: '1.5',
  },
  statusBadge: (status) => ({
    ...statusColors[status],
    borderRadius: '9999px',
    padding: '6px 14px',
    fontWeight: 500,
    fontSize: '0.8rem',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  }),
  proofLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  groupRow: {
    cursor: 'pointer',
    background: '#f8fafc',
    fontWeight: 600,
  },
  childRow: {
      background: '#fff'
  },
  subTableContainer: {
    padding: '16px 24px',
    background: '#fff',
  }
};

const getExpenseId = (id) => `EXP-${id.slice(-4)}`;

const formatCurrency = (amount) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;

const groupExpenses = (expenses) => {
  const groups = {};
  expenses.forEach((exp) => {
    const groupKey = `${exp.projectId}__${exp.clientName}`;
    if (!groups[groupKey]) {
        groups[groupKey] = {
            projectId: exp.projectId,
            projectManager: exp.projectManager,
            clientName: exp.clientName,
            budget: exp.budget,
            totalExpense: 0,
            payments: [],
        };
    }
    groups[groupKey].totalExpense += parseFloat(exp.amount);
    groups[groupKey].payments.push(exp);
  });
  Object.values(groups).forEach((group) => group.payments.sort((a, b) => new Date(b.date) - new Date(a.date)));
  return groups;
};

const AccountantExpenseTable = ({ expenses, onEdit }) => {
  const [openGroups, setOpenGroups] = useState({});
  const [hoverRow, setHoverRow] = useState(null);

  const processedExpenses = expenses.map(e => ({
    ...e,
    status: e.status === 'Yet to be Paid' ? 'Pending' : e.status,
    displayId: getExpenseId(e.id),
  }));

  const groups = groupExpenses(processedExpenses);

  const summaryColumns = [
    { key: 'projectId', label: 'Project ID' },
    { key: 'projectManager', label: 'Project Manager' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'totalExpense', label: 'Total Expense', align: 'right' },
    { key: 'budget', label: 'Budget', align: 'right' },
    { key: 'paymentCount', label: 'No. of Payments', align: 'center' },
  ];

  const detailColumns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'vendorName', label: 'Vendor Name' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status' },
    { key: 'paymentProof', label: 'Payment Proof' },
  ];

  const renderSummaryCell = (group, colKey) => {
    switch(colKey) {
        case 'totalExpense':
        case 'budget':
            return formatCurrency(group[colKey]);
        case 'paymentCount':
            return group.payments.length;
        default:
            return group[colKey];
    }
  }

  const renderDetailCell = (exp, colKey) => {
    const value = exp[colKey];
    switch (colKey) {
        case 'amount': 
            return formatCurrency(value);
        case 'status': 
            return (
                <Tooltip text={exp.status === 'Rejected' ? exp.rejectionComment : ''}>
                    <span style={styles.statusBadge(value)}>{value}</span>
                </Tooltip>
            );
        case 'paymentProof': 
            return value ? (
                <a href={value} target="_blank" rel="noopener noreferrer" style={styles.proofLink} onClick={e => e.stopPropagation()}>
                    <FiFileText /> View Proof
                </a>
            ) : 'N/A';
        default: 
            return value;
    }
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: '40px' }}></th>
            {summaryColumns.map(col => 
              <th key={col.key} style={{ ...styles.th, textAlign: col.align || 'left' }}>
                {col.label}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([groupKey, group]) => {
            const isExpanded = openGroups[groupKey];

            return (
              <React.Fragment key={groupKey}>
                <tr
                  style={{ ...styles.groupRow, ...(hoverRow === groupKey && { background: '#eef2ff' }) }}
                  onMouseEnter={() => setHoverRow(groupKey)}
                  onMouseLeave={() => setHoverRow(null)}
                  onClick={() => setOpenGroups(p => ({ ...p, [groupKey]: !isExpanded }))}
                >
                  <td style={styles.td}>
                    <FiChevronDown style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </td>
                  {summaryColumns.map(col => <td key={col.key} style={{...styles.td, textAlign: col.align || 'left'}}>{renderSummaryCell(group, col.key)}</td>)}
                </tr>
                {isExpanded && (
                    <tr>
                        <td colSpan={summaryColumns.length + 1} style={{ padding: 0 }}>
                            <div style={styles.subTableContainer}>
                                <table style={{ ...styles.table, border: 'none' }}>
                                    <thead>
                                        <tr>
                                            {detailColumns.map(col => (
                                                <th key={col.key} style={{ ...styles.th, background: '#eef2ff', borderBottom: '1px solid #c7d2fe' }}>{col.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.payments.map(exp => (
                                            <tr key={exp.id} style={styles.childRow} onClick={() => onEdit(exp)}>
                                                {detailColumns.map(col => (
                                                    <td key={col.key} style={{...styles.td, textAlign: col.align || 'left'}}>{renderDetailCell(exp, col.key)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                )}
              </React.Fragment>
            );
          })}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={summaryColumns.length + 1} style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountantExpenseTable; 
import React from 'react';

const sampleOrders = [
    {
      id: 'ORD001',
      customer: 'Yash Naik',
      status: 'Pending',
      date: '2025-03-01',
      total: '250.00',
    },
    {
      id: 'ORD002',
      customer: 'Ananya Sharma',
      status: 'Completed',
      date: '2024-06-02',
      total: '440.50',
    },
    {
      id: 'ORD003',
      customer: 'Rohan Mehra',
      status: 'In Progress',
      date: '2024-06-03',
      total: '115.75',
    },
    {
      id: 'ORD004',
      customer: 'Priya Verma',
      status: 'Cancelled',
      date: '2025-01-15',
      total: '320.00',
    },
    {
      id: 'ORD005',
      customer: 'Aditya Joshi',
      status: 'Pending',
      date: '2025-04-20',
      total: '589.99',
    },
    {
      id: 'ORD006',
      customer: 'Sneha Iyer',
      status: 'Completed',
      date: '2025-02-28',
      total: '78.50',
    },
    {
      id: 'ORD007',
      customer: 'Aryan Kapoor',
      status: 'In Progress',
      date: '2024-12-12',
      total: '450.00',
    },
    {
      id: 'ORD008',
      customer: 'Kavya Nair',
      status: 'Completed',
      date: '2025-03-05',
      total: '99.99',
    },
    {
      id: 'ORD009',
      customer: 'Devansh Patel',
      status: 'Pending',
      date: '2025-03-10',
      total: '120.00',
    },
    {
      id: 'ORD010',
      customer: 'Ishita Reddy',
      status: 'Cancelled',
      date: '2024-11-23',
      total: '199.95',
    },
  ];
  
const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
};

const OrderManagement = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Order Management</h1>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody>
          {sampleOrders.map((order, idx) => (
            <tr key={order.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
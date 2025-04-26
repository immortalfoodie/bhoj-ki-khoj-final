import React, { useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Rahul Sharma',
      address: 'Flat 12B, Green Valley Apartments, Andheri West, Mumbai',
      time: '11:30 AM',
      status: 'Pending',
    },
    {
      id: 'ORD002',
      customerName: 'Priya Mehta',
      address: 'B/202, Sunshine Tower, Bandra East, Mumbai',
      time: '12:15 PM',
      status: 'Picked Up',
    },
    {
      id: 'ORD003',
      customerName: 'Amit Verma',
      address: 'C-404, Lake View Residency, Powai, Mumbai',
      time: '1:00 PM',
      status: 'Pending',
    },
  ]);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 border rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center bg-white"
          >
            <div>
              <h2 className="text-lg font-semibold">{order.customerName}</h2>
              <p className="text-gray-600">{order.address}</p>
              <p className="text-gray-500 text-sm">Delivery Time: {order.time}</p>
            </div>
            <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'Picked Up'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {order.status}
              </span>
              {order.status === 'Pending' && (
                <button
                  onClick={() => updateStatus(order.id, 'Picked Up')}
                  className="mt-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Mark as Picked Up
                </button>
              )}
              {order.status === 'Picked Up' && (
                <button
                  onClick={() => updateStatus(order.id, 'Delivered')}
                  className="mt-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

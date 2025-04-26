import React from 'react';

const deliveries = [
  { id: 1, customerName: 'Vishal Gowda Sharma', address: 'Goregoan East, Mumbai', status: 'Delivered' },
  { id: 2, customerName: 'Priya Mehta', address: 'Bandra East, Mumbai', status: 'In Transit' },
  { id: 3, customerName: 'Amit Verma', address: 'Powai, Mumbai', status: 'Pending' },
];

const DeliveryHistory = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery History</h1>
      <p className="mb-4">This is the Delivery History page for the Dabbawala dashboard.</p>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
        <ul className="space-y-3">
          {deliveries.map((delivery) => (
            <li key={delivery.id} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{delivery.customerName}</span>
                <span className="text-sm text-gray-600"> - {delivery.address}</span>
              </div>
              <span
                className={`text-sm ${
                  delivery.status === 'Delivered'
                    ? 'text-green-500'
                    : delivery.status === 'In Transit'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                {delivery.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DeliveryHistory;

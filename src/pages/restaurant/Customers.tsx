import React from 'react';

const customers = [
  { id: 1, name: 'Vishal Gowda', address: 'Goregoan East, Mumbai', phone: '9004433916' },
  { id: 2, name: 'Priya Mehta', address: 'Bandra East, Mumbai', phone: '9123456780' },
  { id: 3, name: 'Amit Verma', address: 'Powai, Mumbai', phone: '9988776655' },
];

const Customers = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <p className="mb-4">This is the Customers page for the Restaurant dashboard.</p>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Registered Customers</h2>
        <ul className="space-y-3">
          {customers.map((customer) => (
            <li key={customer.id} className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.address}</div>
              </div>
              <div className="text-sm text-blue-500 mt-2 md:mt-0">{customer.phone}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Customers;

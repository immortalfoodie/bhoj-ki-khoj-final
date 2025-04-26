import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import classNames from 'classnames'; // install if needed: npm install classnames

const UsersPage = () => {
  // Mock extended user data
  const users = [
    { id: 'U001', name: 'Vishal Gowda', email: 'gowddavishal05@gmail.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
    { id: 'U002', name: 'Yash Naik', email: 'yashnaik@gmail.com', role: 'User', status: 'Pending', joinDate: '2024-03-22' },
    { id: 'U003', name: 'Gideon Mire', email: 'gideonmire@gmail.com', role: 'User', status: 'Active', joinDate: '2024-05-05' },
    { id: 'U004', name: 'Deepu Kumar', email: 'deepukumar@gmail.com', role: 'Restaurant', status: 'Inactive', joinDate: '2024-02-10' },
    { id: 'U005', name: 'Rohan Deshmukh', email: 'rohan.deshmukh@example.in', role: 'Dabbawala', status: 'Active', joinDate: '2023-12-01' },
    { id: 'U006', name: 'Kavya Nair', email: 'kavya.nair@example.in', role: 'User', status: 'Pending', joinDate: '2024-04-12' },
    { id: 'U007', name: 'Arjun Iyer', email: 'arjun.iyer@example.in', role: 'Admin', status: 'Active', joinDate: '2024-01-05' },
    { id: 'U008', name: 'Pooja Reddy', email: 'pooja.reddy@example.in', role: 'Restaurant', status: 'Inactive', joinDate: '2024-03-30' },
    { id: 'U009', name: 'Siddharth Rao', email: 'siddharth.rao@example.in', role: 'Dabbawala', status: 'Active', joinDate: '2023-11-18' },
    { id: 'U010', name: 'Ananya Gupta', email: 'ananya.gupta@example.in', role: 'User', status: 'Active', joinDate: '2024-02-25' },
  ];
  

  // Badge color classes
  const roleBadgeColor = {
    Admin: 'bg-blue-100 text-blue-700',
    User: 'bg-green-100 text-green-700',
    Restaurant: 'bg-yellow-100 text-yellow-700',
    Dabbawala: 'bg-purple-100 text-purple-700',
  };

  const statusBadgeColor = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-gray-200 text-gray-700',
    Pending: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8" />
          User Management
        </h1>
        <Button className="bg-bhoj-primary hover:bg-bhoj-dark text-white">
          Add New User
        </Button>
      </div>

      <Card className="shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl font-semibold">User List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Join Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">{user.id}</td>
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={classNames(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      roleBadgeColor[user.role as keyof typeof roleBadgeColor]
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={classNames(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      statusBadgeColor[user.status as keyof typeof statusBadgeColor]
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">{user.joinDate}</td>
                  <td className="py-4 px-6 text-center">
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;

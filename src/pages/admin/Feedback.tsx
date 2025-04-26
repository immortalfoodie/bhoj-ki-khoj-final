
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Check, 
  AlertCircle, 
  Search, 
  RefreshCcw,
  Star,
  ChevronDown
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock feedback data
const mockFeedback = [
  {
    id: 1,
    user: {
      name: 'Rahul Sharma',
      avatar: null,
    },
    type: 'complaint',
    title: 'Late delivery from Maa ki Rasoi',
    message: 'My order was delivered 45 minutes late and the food was cold. This is the second time this has happened with this restaurant.',
    restaurant: 'Maa ki Rasoi',
    status: 'open',
    date: '2023-05-12',
    rating: 2
  },
  {
    id: 2,
    user: {
      name: 'Priya Patel',
      avatar: null,
    },
    type: 'suggestion',
    title: 'Add more vegetarian options',
    message: 'I would like to see more vegetarian options from restaurants. Perhaps you could add a filter for pure vegetarian restaurants.',
    restaurant: null,
    status: 'resolved',
    date: '2023-05-10',
    rating: 4
  },
  {
    id: 3,
    user: {
      name: 'Arjun Kumar',
      avatar: null,
    },
    type: 'complaint',
    title: 'Wrong items delivered',
    message: 'I ordered Paneer Butter Masala but received Palak Paneer instead. The restaurant did not provide any compensation.',
    restaurant: 'Desi Dhaba',
    status: 'in-progress',
    date: '2023-05-11',
    rating: 1
  },
  {
    id: 4,
    user: {
      name: 'Meera Joshi',
      avatar: null,
    },
    type: 'appreciation',
    title: 'Excellent service by dabbawala',
    message: 'The dabbawala who delivered my food was very polite and professional. Food was delivered on time and hot.',
    restaurant: 'South Express',
    status: 'resolved',
    date: '2023-05-09',
    rating: 5
  },
  {
    id: 5,
    user: {
      name: 'Vikram Singh',
      avatar: null,
    },
    type: 'complaint',
    title: 'App crashes during checkout',
    message: 'The app keeps crashing when I try to complete payment during checkout. I have tried reinstalling but the issue persists.',
    restaurant: null,
    status: 'open',
    date: '2023-05-12',
    rating: 3
  }
];

// Mock reports data
const mockReports = [
  {
    id: 1,
    reportType: 'Monthly Activity',
    description: 'Summary of all user activity',
    lastGenerated: '2023-05-01',
    format: 'PDF'
  },
  {
    id: 2,
    reportType: 'Restaurant Performance',
    description: 'Rankings and metrics for all restaurants',
    lastGenerated: '2023-05-01',
    format: 'Excel'
  },
  {
    id: 3,
    reportType: 'Dabbawala Efficiency',
    description: 'Delivery times and ratings',
    lastGenerated: '2023-05-01',
    format: 'PDF'
  },
  {
    id: 4,
    reportType: 'Financial Summary',
    description: 'Revenue and commission breakdowns',
    lastGenerated: '2023-05-01',
    format: 'Excel'
  },
  {
    id: 5,
    reportType: 'Customer Satisfaction',
    description: 'Survey results and feedback analysis',
    lastGenerated: '2023-05-01',
    format: 'PDF'
  }
];

const Feedback = () => {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (id: number, newStatus: 'open' | 'in-progress' | 'resolved') => {
    setFeedback(prevFeedback => 
      prevFeedback.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    
    toast({
      title: `Feedback status updated`,
      description: `Feedback #${id} has been marked as ${newStatus}`,
    });
  };

  const handleGenerateReport = (reportName: string) => {
    toast({
      title: `Generating report`,
      description: `${reportName} is being generated and will be available for download shortly`,
    });
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.restaurant && item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()));
                         
    const matchesFilter = filterStatus === null || item.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-800">Feedback & Reports</h1>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Customer Feedback</CardTitle>
                  <CardDescription>View and respond to user feedback</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    className="px-3 py-1.5 border rounded-md text-sm"
                    value={filterStatus || ''}
                    onChange={(e) => setFilterStatus(e.target.value || null)}
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search feedback..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-48 sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFeedback.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No feedback found matching your criteria
                  </div>
                ) : (
                  filteredFeedback.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className={`
                        h-2 w-full
                        ${item.type === 'complaint' ? 'bg-red-500' : ''}
                        ${item.type === 'suggestion' ? 'bg-blue-500' : ''}
                        ${item.type === 'appreciation' ? 'bg-green-500' : ''}
                      `}></div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={item.user.avatar || undefined} />
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {item.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{item.user.name}</div>
                              <div className="text-xs text-gray-500">{item.date}</div>
                            </div>
                          </div>
                          <Badge className={`
                            ${item.status === 'open' ? 'bg-amber-100 text-amber-800' : ''}
                            ${item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                            ${item.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-3">
                          <h3 className="text-base font-medium">{item.title}</h3>
                          {item.restaurant && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Restaurant: {item.restaurant}
                            </div>
                          )}
                          
                          <div className="flex items-center mt-1">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-sm mt-3 text-gray-700">
                            {item.message}
                          </p>
                          
                          <div className="flex space-x-2 mt-4 justify-end">
                            {item.status !== 'resolved' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                                onClick={() => handleStatusChange(item.id, 'resolved')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            )}
                            
                            {item.status === 'open' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(item.id, 'in-progress')}
                              >
                                Process
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Respond
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Generate and download system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div 
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{report.reportType}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last generated: {report.lastGenerated} ({report.format})
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                      >
                        Download
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleGenerateReport(report.reportType)}
                      >
                        <RefreshCcw className="h-4 w-4 mr-1" />
                        Generate New
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 border-t pt-4">
                  <h3 className="font-semibold mb-2">Custom Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Report Type</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>Sales Report</option>
                        <option>User Activity</option>
                        <option>Restaurant Performance</option>
                        <option>Delivery Analytics</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Date Range</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input type="date" />
                        <span>to</span>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Format</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md">
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Generate Custom Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feedback;

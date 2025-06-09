import { type NextPage } from "next";
import { format } from "date-fns";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Users, DollarSign, Eye, Link, Mail, Phone, Check, X, ExternalLink, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

export const WorkshopLogsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);

  const { data: workshops, isLoading, error } = api.admin.getWorkshopLogs.useQuery();

   const exportEnrollmentsCSV = () => {
    if (!workshops || workshops.length === 0) {
      alert('No data to export');
      return;
    }

    // Define CSV headers for enrollments
    const headers = [
      'Workshop Name',
      'Student Name',
      'Student Role',
      'Student Email',
      'Phone Number',
      'Institution/Company',
      'Payment Status',
      'Enrollment Date',
      'Workshop Price (₹)',
      'Mentor Name'
    ];

    // Flatten all enrollments from all workshops
    const enrollmentData : any[] = [];
    workshops.forEach(workshop => {
      workshop.enrollments.forEach(enrollment => {
        enrollmentData.push([
          `"${workshop.name}"`,
          `"${enrollment.student.studentName || 'N/A'}"`,
          `"${enrollment.student.studentRole || 'N/A'}"`,
          `"${enrollment.studentGmailId || 'N/A'}"`,
          `"${enrollment.student.phoneNumber !== 'XXXXXXXXXX' ? enrollment.student.phoneNumber : 'Not provided'}"`,
          `"${enrollment.student.institutionName || enrollment.student.companyName || 'N/A'}"`,
          enrollment.paymentStatus ? 'Paid' : 'Unpaid',
          format(new Date(enrollment.createdAt), 'yyyy-MM-dd HH:mm:ss'),
          workshop.price / 100,
          `"${workshop.mentor.mentorName || 'N/A'}"`
        ]);
      });
    });

    if (enrollmentData.length === 0) {
      alert('No enrollment data to export');
      return;
    }

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...enrollmentData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `workshop_enrollments_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  // Filter workshops based on search term
  const filteredWorkshops = workshops?.filter((workshop :  any) =>
    workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.mentor.mentorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (priceInPaise: number) => {
    return `₹${(priceInPaise / 100).toLocaleString('en-IN')}`;
  };

  const getScheduleTypeDisplay = (scheduleType: string) => {
    return scheduleType === 'recurring' ? 'Recurring' : 'Custom';
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading workshop logs: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workshop Logs</h1>
          <p className="text-muted-foreground">
            Manage and monitor all workshops in the system
          </p>
          <Button 
            variant="outline"
            className="mt-2"
            onClick={exportEnrollmentsCSV}
            disabled={isLoading || !workshops || workshops.length === 0}
            >
            <Download className="mr-2 h-4 w-4" />
            Export Enrollments to CSV
            </Button>

        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : workshops?.length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workshops</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                workshops?.filter(w => w.startDate && new Date(w.startDate) >= new Date()).length || 0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                workshops?.reduce((acc, workshop) => acc + workshop.enrollments.length, 0) || 0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                formatPrice(
                  workshops?.reduce((acc, workshop) => 
                    acc + (workshop.price * workshop.enrollments.filter(e => e.paymentStatus).length), 0
                  ) || 0
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workshop Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Workshops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workshop Name</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Schedule Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredWorkshops && filteredWorkshops.length > 0 ? (
                  filteredWorkshops.map((workshop) => {
                    const isActive = workshop.startDate ? new Date(workshop.startDate) >= new Date() : false;
                    const paidEnrollments = workshop.enrollments.filter(e => e.paymentStatus).length;
                    
                    return (
                      <TableRow key={workshop.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{workshop.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {workshop.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {workshop.mentor.mentorName || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {workshop.numberOfDays} day{workshop.numberOfDays > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                          className="hover:text-white"
                           variant={workshop.scheduleType === 'recurring' ? 'default' : 'secondary'}>
                            {getScheduleTypeDisplay(workshop.scheduleType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(workshop.price)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{workshop.enrollments.length}</span>
                            <span className="text-sm text-muted-foreground">
                              {paidEnrollments} paid
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {workshop.startDate ? (
                            <div className="text-sm">
                              {format(new Date(workshop.startDate), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                          className="hover:text-white"
                           variant={isActive ? 'default' : 'secondary'}>
                            {isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(workshop.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWorkshop(
                              selectedWorkshop === workshop.id ? null : workshop.id
                            )}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? 'No workshops found matching your search.' : 'No workshops found.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Workshop Details Modal/Expandable Section */}
      {selectedWorkshop && filteredWorkshops && (
        <Card>
          <CardHeader>
            <CardTitle>Workshop Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const workshop = filteredWorkshops.find(w => w.id === selectedWorkshop);
              if (!workshop) return null;
              
              const paidEnrollments = workshop.enrollments.filter(e => e.paymentStatus);
              const unpaidEnrollments = workshop.enrollments.filter(e => !e.paymentStatus);
              
              return (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="enrollments">Enrollments ({workshop.enrollments.length})</TabsTrigger>
                    <TabsTrigger value="meet-links">Meet Links</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Name:</strong> {workshop.name}</div>
                          <div><strong>Description:</strong> {workshop.description}</div>
                          <div><strong>Duration:</strong> {workshop.numberOfDays} days</div>
                          <div><strong>Price:</strong> {formatPrice(workshop.price)}</div>
                          <div><strong>Mentor Gmail:</strong> {workshop.mentorGmailId}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Schedule & Enrollment</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Type:</strong> {getScheduleTypeDisplay(workshop.scheduleType)}</div>
                          <div><strong>Start Date:</strong> {
                            workshop.startDate 
                              ? format(new Date(workshop.startDate), 'PPP')
                              : 'Not set'
                          }</div>
                          <div><strong>Total Enrollments:</strong> {workshop.enrollments.length}</div>
                          <div><strong>Paid Enrollments:</strong> {paidEnrollments.length}</div>
                          <div><strong>Unpaid Enrollments:</strong> {unpaidEnrollments.length}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Learning Outcomes</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {workshop.learningOutcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {workshop.otherDetails && (
                      <div>
                        <h4 className="font-semibold mb-2">Other Details</h4>
                        <p className="text-sm">{workshop.otherDetails}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="enrollments" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">All Enrollments</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="w-3 h-3 mr-1" />
                            {paidEnrollments.length} Paid
                          </Badge>
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            <X className="w-3 h-3 mr-1" />
                            {unpaidEnrollments.length} Unpaid
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Institution/Company</TableHead>
                              <TableHead>Payment Status</TableHead>
                              <TableHead>Enrolled Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workshop.enrollments.length > 0 ? (
                              workshop.enrollments.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                  <TableCell>
                                    <div className="font-medium">
                                      {enrollment.student.studentName || 'N/A'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {enrollment.student.studentRole || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">
                                        {enrollment.studentGmailId || 'N/A'}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">
                                        {enrollment.student.phoneNumber !== 'XXXXXXXXXX' 
                                          ? enrollment.student.phoneNumber 
                                          : 'Not provided'}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      {enrollment.student.institutionName || 
                                       enrollment.student.companyName || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={enrollment.paymentStatus ? "default" : "destructive"}
                                      className={enrollment.paymentStatus 
                                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                        : "bg-red-100 text-red-800 hover:bg-red-200"}
                                    >
                                      {enrollment.paymentStatus ? (
                                        <>
                                          <Check className="w-3 h-3 mr-1" />
                                          Paid
                                        </>
                                      ) : (
                                        <>
                                          <X className="w-3 h-3 mr-1" />
                                          Unpaid
                                        </>
                                      )}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      {format(new Date(enrollment.createdAt), 'MMM dd, yyyy')}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {format(new Date(enrollment.createdAt), 'HH:mm')}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                  <div className="flex flex-col items-center justify-center space-y-2">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-muted-foreground">No enrollments found</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="meet-links" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Meeting Links & Schedule</h4>
                      
                      {workshop.meetLinks && typeof workshop.meetLinks === 'object' ? (
                        <div className="space-y-3">
                          {Object.entries(workshop.meetLinks as Record<string, any>).map(([dayIndex, meetData]) => (
                            <Card key={dayIndex} className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium">Day {parseInt(dayIndex) + 1}</h5>
                                  <div className="text-sm text-muted-foreground">
                                    {meetData.scheduledDate && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(meetData.scheduledDate), 'PPP p')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {meetData.meetLink && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a 
                                        href={meetData.meetLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                      >
                                        <Link className="w-4 h-4" />
                                        Join Meeting
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {meetData.meetLink && (
                                <div className="mt-3 p-2 bg-muted rounded text-sm font-mono break-all">
                                  {meetData.meetLink}
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card className="p-8 text-center">
                          <Link className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No meeting links configured</p>
                        </Card>
                      )}
                      
                      <Separator />
                      
                      <div>
                        <h5 className="font-medium mb-2">Schedule Information</h5>
                        <div className="text-sm space-y-1">
                          <div><strong>Schedule Type:</strong> {getScheduleTypeDisplay(workshop.scheduleType)}</div>
                          {workshop.schedule && Array.isArray(workshop.schedule) && (
                            <div>
                              <strong>Schedule Details:</strong>
                              <div className="mt-2 space-y-1">
                                {workshop.schedule.map((scheduleItem: any, index: number) => (
                                  <div key={index} className="pl-4 text-sm">
                                    {scheduleItem.day && scheduleItem.time ? (
                                      `${scheduleItem.day}: ${scheduleItem.time}`
                                    ) : scheduleItem.date ? (
                                      format(new Date(scheduleItem.date), 'PPP p')
                                    ) : (
                                      `Schedule ${index + 1}: ${JSON.stringify(scheduleItem)}`
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payments" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Total Revenue</div>
                              <div className="text-xl font-bold text-green-600">
                                {formatPrice(workshop.price * paidEnrollments.length)}
                              </div>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Paid Students</div>
                              <div className="text-xl font-bold text-blue-600">
                                {paidEnrollments.length}
                              </div>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center gap-2">
                            <X className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="text-sm text-muted-foreground">Pending Payments</div>
                              <div className="text-xl font-bold text-red-600">
                                {unpaidEnrollments.length}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Paid Students */}
                        <div>
                          <h5 className="font-medium mb-3 text-green-600 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Paid Students ({paidEnrollments.length})
                          </h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {paidEnrollments.length > 0 ? (
                              paidEnrollments.map((enrollment) => (
                                <Card key={enrollment.id} className="p-3 border-green-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium text-sm">
                                        {enrollment.student.studentName || 'N/A'}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {enrollment.studentGmailId}
                                      </div>
                                      <div className="text-xs text-green-600 mt-1">
                                        Paid on {format(new Date(enrollment.updatedAt), 'MMM dd, yyyy')}
                                      </div>
                                    </div>
                                    <Badge className="bg-green-100  text-green-800 text-xs">
                                      {formatPrice(workshop.price)}
                                    </Badge>
                                  </div>
                                </Card>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No paid enrollments yet</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Unpaid Students */}
                        <div>
                          <h5 className="font-medium mb-3 text-red-600 flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Pending Payments ({unpaidEnrollments.length})
                          </h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {unpaidEnrollments.length > 0 ? (
                              unpaidEnrollments.map((enrollment) => (
                                <Card key={enrollment.id} className="p-3 border-red-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium text-sm">
                                        {enrollment.student.studentName || 'N/A'}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {enrollment.studentGmailId}
                                      </div>
                                      <div className="text-xs text-red-600 mt-1">
                                        Enrolled on {format(new Date(enrollment.createdAt), 'MMM dd, yyyy')}
                                      </div>
                                    </div>
                                    <Badge variant="destructive" className="text-xs">
                                      {formatPrice(workshop.price)}
                                    </Badge>
                                  </div>
                                </Card>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">All payments completed!</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};


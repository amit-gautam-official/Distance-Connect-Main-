"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";
import {
  HistoryIcon,
  InfoIcon,
  ArrowUpDownIcon,
  SearchIcon,
  ClockIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface PaymentHistoryProps {
  paymentHistory: any[];
}

export function PaymentHistory({ paymentHistory }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "date",
    direction: "desc",
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100);
  };

  const getStatusBadge = (status: OrderStatus, receivedPayment: boolean) => {
    if (status === "completed" && !receivedPayment) {
      return (
        <Badge className="bg-yellow-500/80 text-white hover:bg-yellow-500">
          Pending Admin Payment
        </Badge>
      );
    }

    if (status === "completed" && receivedPayment) {
      return (
        <Badge className="bg-green-500/80 text-white hover:bg-green-500">
          Payment Received
        </Badge>
      );
    }

    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/80 text-white hover:bg-green-500">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/80 text-white hover:bg-yellow-500">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/80 text-white hover:bg-red-500">
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-500/80 text-white hover:bg-blue-500">
            Refunded
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Apply filters and sorting
  const filteredPayments = useMemo(() => {
    return paymentHistory
      .filter((payment) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          payment.title?.toLowerCase().includes(searchLower) ||
          payment.studentName?.toLowerCase().includes(searchLower) ||
          payment.studentEmail?.toLowerCase().includes(searchLower) ||
          payment.type?.toLowerCase().includes(searchLower) ||
          payment.status?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const direction = sortBy.direction === "asc" ? 1 : -1;

        switch (sortBy.field) {
          case "date":
            return (
              direction *
              (new Date(a.date).getTime() - new Date(b.date).getTime())
            );
          case "amount":
            return direction * (a.amount - b.amount);
          case "title":
            return direction * a.title.localeCompare(b.title);
          case "status":
            return direction * a.status.localeCompare(b.status);
          case "type":
            return direction * a.type.localeCompare(b.type);
          default:
            return 0;
        }
      });
  }, [paymentHistory, searchTerm, sortBy]);

  // Calculate summary statistics
  const totalEarnings = paymentHistory
    .filter(
      (payment) =>
        payment.status === "completed" && payment.receivedPaymentFromAdmin,
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingEarnings = paymentHistory
    .filter(
      (payment) =>
        payment.status === "completed" && !payment.receivedPaymentFromAdmin,
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  const sessionsCount = paymentHistory.filter(
    (payment) => payment.type === "session" && payment.completed === true,
  ).length;

  const workshopsCount = paymentHistory.filter(
    (payment) => payment.type === "workshop" && payment.status === "completed",
  ).length;

  // Function to handle sort changes
  const handleSort = (field: string) => {
    setSortBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

//   console.log("Filtered Payments:", filteredPayments);

  return (
    <div >
      <div className="mb-4 flex items-center gap-2">
        <HistoryIcon className="h-5 w-5 text-[#3D568F]" />
        <h2 className="text-xl font-semibold text-[#3D568F]">
          Payment History
        </h2>
      </div>

      {/* Payment summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        <Card className="border-[#5580D6]/20 bg-[#5580D6]/5">
          <CardContent className="p-4">
            <CardDescription className="text-sm font-medium text-[#5580D6]/70">
              Total Earnings
            </CardDescription>
            <CardTitle className="mt-1 text-2xl font-bold text-[#5580D6]">
              {formatAmount(totalEarnings)}
            </CardTitle>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <CardDescription className="text-sm font-medium text-yellow-600/70">
              <div className="flex items-center">
                <ClockIcon className="mr-1 h-3 w-3" /> Pending Admin Payment
              </div>
            </CardDescription>
            <CardTitle className="mt-1 text-2xl font-bold text-yellow-600">
              {formatAmount(pendingEarnings)}
            </CardTitle>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <CardDescription className="text-sm font-medium text-blue-600/70">
              Sessions Completed
            </CardDescription>
            <CardTitle className="mt-1 text-2xl font-bold text-blue-600">
              {sessionsCount}
            </CardTitle>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <CardDescription className="text-sm font-medium text-green-600/70">
              Workshops Completed
            </CardDescription>
            <CardTitle className="mt-1 text-2xl font-bold text-green-600">
              {workshopsCount}
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/10 py-16 text-center">
          <HistoryIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground/60" />
          <h3 className="mb-2 md:text-lg text-xs font-medium text-muted-foreground">
            No payment history found
          </h3>
          <p className="mx-auto max-w-md text-sm text-muted-foreground/70">
            {searchTerm
              ? "No payments match your search criteria. Try a different search term."
              : "Your payments will appear here once you receive them from mentoring sessions and workshops."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableCaption>A list of your recent payments</TableCaption>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    className="h-8 md:text-lg text-xs p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-8 md:text-lg text-xs p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("type")}
                  >
                    Type
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-8 md:text-lg text-xs p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("title")}
                  >
                    Title
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-8 md:text-lg text-xs p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-8 md:text-lg text-xs p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium md:text-lg text-xs">
                    {format(new Date(payment.date), "PPP")}
                  </TableCell>
                  <TableCell className="capitalize">
                    <Badge variant="outline" className="capitalize md:text-lg text-xs">
                      {payment.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="md:text-lg text-xs">{payment.title}</TableCell>
                  <TableCell>
                    <div className="font-medium md:text-lg text-xs">{payment.studentName}</div>
                    <div className=" text-muted-foreground md:text-lg text-xs">
                      {payment.studentEmail}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium md:text-lg text-xs">
                    {formatAmount(payment?.amount)}
                  </TableCell>
                  <TableCell className="font-medium md:text-lg text-xs">
                    {getStatusBadge(
                      payment.status,
                      payment.receivedPaymentFromAdmin,
                    )}
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

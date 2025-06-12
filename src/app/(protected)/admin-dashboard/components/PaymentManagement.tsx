"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { BanknoteIcon, CheckCircle, Loader2, SearchIcon } from "lucide-react";

export default function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending payments
  const { data: pendingPayments, refetch: refetchPendingPayments } =
    api.admin.getPendingMentorPayments.useQuery();
  const { data: completedPayments, refetch: refetchCompletedPayments } =
    api.admin.getCompletedMentorPayments.useQuery();

  const markAsPaidMutation = api.admin.markMentorPaymentAsPaid.useMutation({
    onSuccess: () => {
      toast.success("Payment marked as paid successfully");
      setIsDialogOpen(false);
      refetchPendingPayments();
      refetchCompletedPayments();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark payment as paid");
    },
  });

  const handleMarkAsPaid = (payment: any) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const confirmMarkAsPaid = async () => {
    if (!selectedPayment) return;

    setIsLoading(true);
    try {
      await markAsPaidMutation.mutateAsync({
        type: selectedPayment.type,
        id: selectedPayment.id,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPendingPayments =
    pendingPayments?.filter((payment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment?.mentorName?.toLowerCase().includes(searchLower) ||
        payment?.mentorEmail?.toLowerCase().includes(searchLower) ||
        payment?.title?.toLowerCase().includes(searchLower)
      );
    }) || [];

  const filteredCompletedPayments =
    completedPayments?.filter((payment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment?.mentorName?.toLowerCase().includes(searchLower) ||
        payment?.mentorEmail?.toLowerCase().includes(searchLower) ||
        payment?.title?.toLowerCase().includes(searchLower)
      );
    }) || [];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100);
  };

  // Calculate summary statistics
  const totalPendingAmount = (pendingPayments || []).reduce(
    (sum, payment) => sum + (payment?.amount || 0),
    0,
  );
  const totalPaidAmount = (completedPayments || []).reduce(
    (sum, payment) => sum + (payment?.amount || 0),
    0,
  );
  const totalMentorsWithPendingPayments = [
    ...new Set((pendingPayments || []).map((p) => p?.mentorId)),
  ].length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-[#3D568F]">
            Mentor Payment Management
          </h2>
          <p className="text-muted-foreground">
            Review and process payments for mentors
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by mentor name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-blue-400/20 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-blue-700">
              Pending Payments
            </CardTitle>
            <CardDescription>
              Total amount to be paid to mentors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {formatAmount(totalPendingAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-400/20 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-green-700">
              Paid Payments
            </CardTitle>
            <CardDescription>Total amount paid to mentors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {formatAmount(totalPaidAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-400/20 bg-purple-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-purple-700">
              Pending Mentors
            </CardTitle>
            <CardDescription>
              Number of mentors awaiting payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {totalMentorsWithPendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="completed">Completed Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredPendingPayments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <BanknoteIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
              <h3 className="mb-2 text-lg font-medium">
                No pending payments found
              </h3>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                {searchTerm
                  ? "No payments match your search criteria."
                  : "All mentor payments have been processed."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  A list of pending payments for mentors
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingPayments.map((payment) => (
                    <TableRow key={`${payment?.type}-${payment?.id}`}>
                      <TableCell className="font-medium">
                        {payment?.date ? format(new Date(payment.date), "PPP") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment?.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment?.title}</TableCell>
                      <TableCell>
                        <div className="font-medium">{payment?.mentorName}</div>
                        <div className="text-xs text-muted-foreground">
                          {payment?.mentorEmail}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {payment?.bankDetails ? (
                            <>
                              <div>
                                <span className="font-semibold">Account:</span>{" "}
                                {payment?.bankDetails.accountHolderName}
                              </div>
                              <div>
                                <span className="font-semibold">Bank:</span>{" "}
                                {payment?.bankDetails.bankName}
                              </div>
                              <div>
                                <span className="font-semibold">IFSC:</span>{" "}
                                {payment?.bankDetails.ifscCode}
                              </div>
                            </>
                          ) : (
                            <span className="text-red-500">
                              Bank details not provided
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment?.amount ? formatAmount(payment?.amount) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleMarkAsPaid(payment)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={!payment?.bankDetails}
                        >
                          Mark as Paid
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredCompletedPayments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <BanknoteIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
              <h3 className="mb-2 text-lg font-medium">
                No completed payments found
              </h3>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                {searchTerm
                  ? "No payments match your search criteria."
                  : "No mentor payments have been completed yet."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  A list of completed payments for mentors
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompletedPayments.map((payment) => (
                    <TableRow key={`${payment?.type}-${payment?.id}`}>
                      <TableCell className="font-medium">
                        {payment?.date ? format(new Date(payment?.date), "PPP"): "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment?.date? format(new Date(payment?.paymentDate), "PPP") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment?.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment?.title}</TableCell>
                      <TableCell>
                        <div className="font-medium">{payment?.mentorName}</div>
                        <div className="text-xs text-muted-foreground">
                          {payment?.mentorEmail}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment?.amount? formatAmount(payment?.amount): "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CheckCircle className="mr-1.5 h-4 w-4 text-green-600" />
                          <span className="text-green-600">Paid</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this payment as paid? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <div className="font-medium capitalize">
                    {selectedPayment.type}
                  </div>
                </div>
                <div>
                  <Label>Amount</Label>
                  <div className="font-medium">
                    {formatAmount(selectedPayment.amount)}
                  </div>
                </div>
              </div>

              <div>
                <Label>Mentor</Label>
                <div className="font-medium">{selectedPayment.mentorName}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedPayment.mentorEmail}
                </div>
              </div>

              <div>
                <Label>Bank Details</Label>
                <div className="text-sm">
                  {selectedPayment.bankDetails ? (
                    <>
                      <div>
                        <span className="font-semibold">Account Holder:</span>{" "}
                        {selectedPayment.bankDetails.accountHolderName}
                      </div>
                      <div>
                        <span className="font-semibold">Bank Name:</span>{" "}
                        {selectedPayment.bankDetails.bankName}
                      </div>
                      <div>
                        <span className="font-semibold">Account Number:</span>{" "}
                        {selectedPayment.bankDetails.accountNumber}
                      </div>
                      <div>
                        <span className="font-semibold">IFSC Code:</span>{" "}
                        {selectedPayment.bankDetails.ifscCode}
                      </div>
                      {selectedPayment.bankDetails.upiId && (
                        <div>
                          <span className="font-semibold">UPI ID:</span>{" "}
                          {selectedPayment.bankDetails.upiId}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-red-500">
                      Bank details not provided
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmMarkAsPaid}
              disabled={isLoading || !selectedPayment?.bankDetails}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

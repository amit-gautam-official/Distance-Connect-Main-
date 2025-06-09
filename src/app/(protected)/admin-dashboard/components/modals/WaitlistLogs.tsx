"use client";

import { useEffect, useState } from "react";
import { getWaitlistEntries } from "@/actions/waitlist";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: Date;
};

export default function WaitlistLogs() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const data = await getWaitlistEntries();
        setEntries(data);
        setError(null);
      } catch (err) {
        setError("Failed to load waitlist entries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchEntries();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No waitlist entries found.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.name || "N/A"}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(entry.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

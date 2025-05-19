import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { JsonValue } from "@prisma/client/runtime/library";


interface Mentor {
  userId: string;
  mentorName: string;
  verified: boolean;
  currentCompany?: string;
  companyEmailVerified?: boolean;
  linkedinUrl?: string;
  wholeExperience?: string;
  industry?: string;
    companyEmail?: string;
  user: {
    id: string;
    image: string;
    username: string;
    email: string;
  };
}

interface MentorViewModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onVerify: () => void;
}

export default function MentorViewModal({
  mentor,
  isOpen,
  setIsOpen,
  onVerify,
}: MentorViewModalProps) {
  if (!mentor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95%] rounded-lg p-4 sm:max-w-md md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            Mentor Details
          </DialogTitle>
          <DialogDescription>
            Viewing information for {mentor.mentorName}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{mentor.mentorName}</h3>
              <p className="text-sm text-gray-500">{mentor.user.email}</p>
            </div>
            <div>
              {mentor.verified ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-orange-500 text-orange-500"
                >
                  Pending
                </Badge>
              )}
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">
              Industry
            </h4>
            <p>{mentor.industry}</p>
          </div>

          
          {/* add current company email erification tag with eamil */}
            {mentor.companyEmailVerified && (
                <div className="rounded-md bg-green-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-green-700">
                    Company Email Verified
                </h4>
                <p>{mentor.companyEmail}</p>
                <p>{mentor.currentCompany}</p>
                </div>
            )}
            {/* add not verified tag as well */}
            {!mentor.companyEmailVerified && (
                <div className="rounded-md bg-red-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-red-700">
                    Company Email Not Verified
                </h4>
                <p>{mentor.companyEmail}</p>
                <p>{mentor.currentCompany}</p>
                </div>
            )}
            {/* //wholeExperience */}
          {/* //linkedInUrl */}
          {mentor.linkedinUrl &&
            <div className="rounded-md bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">
              LinkedIn URL
            </h4>
            <p>{mentor.linkedinUrl}</p>
          </div>}
          <div className="pt-2">
            <div className="flex gap-2">
              {!mentor.verified && (
                <Button
                  onClick={onVerify}
                  variant="default"
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Verify Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

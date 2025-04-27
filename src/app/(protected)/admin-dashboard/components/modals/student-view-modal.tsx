import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  year: string;
}

interface StudentViewModalProps {
  student: Student | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function StudentViewModal({
  student,
  isOpen,
  setIsOpen,
}: StudentViewModalProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95%] rounded-lg p-4 sm:max-w-md md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            Student Details
          </DialogTitle>
          <DialogDescription>
            Viewing information for {student.name}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 rounded-md bg-white p-3 md:p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base">{student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{student.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Course</p>
                <p className="text-base">{student.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p className="text-base">{student.year}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-gray-500">Actions</p>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
                <Button variant="destructive" size="sm">
                  Deactivate
                </Button>
              </div>
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

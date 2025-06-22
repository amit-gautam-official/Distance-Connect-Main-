import { toast } from "@/components/ui/use-toast";

/**
 * Converts a file to base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data:application/pdf;base64, part
        const base64String = reader.result.split(",")[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Invalid base64 format"));
        }
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Validates file type and size
 */
export const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number): boolean => {
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Invalid file type",
      description: `File must be one of: ${allowedTypes.join(", ")}`,
      variant: "destructive",
    });
    return false;
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    toast({
      title: "File too large",
      description: `Maximum file size is ${maxSizeMB}MB`,
      variant: "destructive",
    });
    return false;
  }

  return true;
};

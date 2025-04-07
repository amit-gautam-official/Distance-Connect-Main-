"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center justify-center w-full h-full max-h-[85vh] overflow-auto bg-black">
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


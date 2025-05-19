"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  file: File
  className?: string
}

export default function ImagePreview({ file, className }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Free memory when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  if (!preview) {
    return (
      <div className={cn("w-24 h-24 bg-gray-200 rounded flex items-center justify-center", className)}>Loading...</div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded border", className)}>
      <img src={preview || "/placeholder.svg"} alt={file.name} className="w-24 h-24 object-cover" />
    </div>
  )
}


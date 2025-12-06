"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Trash, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface MultipleImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()

    Array.from(files).forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      // Append new URLs to existing ones
      onChange([...value, ...data.urls])
      toast({ title: "Success", description: "Images uploaded successfully" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during upload.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset input so the same file can be selected again if needed
      e.target.value = ""
    }
  }

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url))
  }

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      
      <div>
         <label>
            <div className="flex items-center justify-center w-[200px] h-[200px] rounded-md border-2 border-dashed border-gray-300 hover:bg-gray-50 cursor-pointer transition flex-col gap-2">
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-sm">Uploading...</p>
                    </div>
                ) : (
                    <>
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload Images</span>
                    </>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onUpload}
                disabled={disabled || isUploading}
            />
         </label>
      </div>
    </div>
  )
}

export default MultipleImageUpload
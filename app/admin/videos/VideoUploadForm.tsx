"use client"

import { useState } from "react"
import { uploadVideoAction } from "@/lib/actions/video-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, AlertCircle } from "lucide-react"

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [fileSelected, setFileSelected] = useState(false)

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file || !title) return alert("Please provide both title and video file.")

    // Limit check (5MB recommended for Base64 server actions)
    if (file.size > 5 * 1024 * 1024) {
      return alert("Video is too large (Max 5MB). Please compress it first.")
    }

    setLoading(true)
    const reader = new FileReader()
    
    reader.onloadend = async () => {
      try {
        await uploadVideoAction(reader.result as string, title)
        setTitle("")
        setFileSelected(false)
        form.reset()
        alert("Success! Video is now live.")
      } catch (err) {
        console.error(err)
        alert("Failed to upload. Check your internet or file size.")
      } finally {
        setLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleUpload} className="p-6 border rounded-2xl bg-card shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
        <Upload className="h-4 w-4" />
        New Upload
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Video Title</Label>
        <Input 
          id="title"
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g. Winter Essentials Ad" 
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video">Video File</Label>
        <div className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${fileSelected ? 'border-primary/50 bg-primary/5' : 'hover:bg-muted/50'}`}>
           <input 
              id="video"
              type="file" 
              accept="video/*" 
              onChange={(e) => setFileSelected(!!e.target.files?.[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
              disabled={loading}
           />
           <div className="text-center space-y-1">
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {fileSelected ? "Video selected!" : "Click to select MP4/WebM"}
              </p>
           </div>
        </div>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Max size: 5MB. Aspect ratio 16:9 recommended.
        </p>
      </div>

      <Button type="submit" className="w-full font-bold" disabled={loading || !title || !fileSelected}>
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
        ) : (
          "Upload Promo Video"
        )}
      </Button>
    </form>
  )
}
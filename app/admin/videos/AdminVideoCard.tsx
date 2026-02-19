"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminVideoCardProps {
  video: any;
  deleteAction: any; // This will receive the .bind version
}

export default function AdminVideoCard({ video, deleteAction }: AdminVideoCardProps) {
  return (
    <div className="group bg-background border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-video bg-black">
        <video 
          src={video.url} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
          muted
          loop
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0; // Optional: Reset to start
          }}
        />
      </div>
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{video.title}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* The delete form stays here */}
        <form action={deleteAction}>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-full shadow-lg"
            type="submit"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
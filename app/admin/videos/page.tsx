import { getVideos } from "@/lib/db/videos";
import { removeVideoAction } from "@/lib/actions/video-actions";
import VideoUploadForm from "./VideoUploadForm";
import AdminVideoCard from "./AdminVideoCard"; // Import the new component
import { Play } from "lucide-react";

export default async function AdminVideosPage() {
  const rawVideos = await getVideos();
  
  // Clean the data for the Client Component
  const videos = JSON.parse(JSON.stringify(rawVideos));

  return (
    <div className="space-y-10 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">Promotional Videos</h1>
          <p className="text-muted-foreground text-sm">Manage the video grid on your home page.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-24">
          <VideoUploadForm />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Play className="h-4 w-4" /> Current Videos ({videos.length})
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {videos.length === 0 && (
              <div className="col-span-2 py-20 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
                No videos uploaded yet.
              </div>
            )}
            
            {videos.map((video: any) => (
              <AdminVideoCard 
                key={video._id} 
                video={video} 
                // Pass the bound action to the client component
                deleteAction={removeVideoAction.bind(null, video._id, video.publicId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
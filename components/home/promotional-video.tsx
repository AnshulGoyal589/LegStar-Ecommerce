import { getVideos } from "@/lib/db/videos";import VideoPlayer from "./VideoPlayer";

const PromotionalVideosGrid = async () => {
  const videos = await getVideos();

  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">
          Video Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => {
            // Render the new client component for each video
            // We need to pass the full video object, not just a stringified ID for the key
            const plainVideoObject = {
              ...video,
              _id: video._id.toString(),
            } as any;
            return <VideoPlayer key={plainVideoObject._id} video={plainVideoObject} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PromotionalVideosGrid;
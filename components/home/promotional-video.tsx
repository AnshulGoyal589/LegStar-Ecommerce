import { getVideos } from "@/lib/db/videos"

const PromotionalVideosGrid = async () => {
  const videos = await getVideos()

  if (videos.length === 0) return null

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Video Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => {
            return (
              <div 
                key={video._id.toString()}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-t from-gray-900/20 to-transparent"
              >
                <div className="aspect-video w-full">
                  <video
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay loop muted playsInline
                  >
                    {/* Cloudinary handles formats automatically with the URL provided */}
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{video.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromotionalVideosGrid;
// components/PromotionalVideosGrid.jsx

const PromotionalVideosGrid = () => {
  // Replace these with your actual 8 Cloudinary video public IDs
  const videos = [
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1764929164/WEBSITE_VIDEO_c7hxii",
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905968/WhatsApp_Video_2026-02-09_at_9.48.38_PM_evgjda",
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905971/WhatsApp_Video_2026-02-09_at_9.48.39_PM_phm9fs", 
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905978/WhatsApp_Video_2026-02-09_at_9.48.38_PM_1_zauhkv",
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905978/WhatsApp_Video_2026-02-09_at_9.14.35_PM_clidno", 
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905979/WhatsApp_Video_2026-02-09_at_9.48.37_PM_cw46ik", 
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905979/WhatsApp_Video_2026-02-09_at_9.48.38_PM_2_kbuhwl",
    "https://res.cloudinary.com/dkuhayoum/video/upload/v1770905981/WhatsApp_Video_2026-02-09_at_9.14.52_PM_nsujfg"
  ];


  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((videoUrl, index) => {
            return (
              <div 
                key={`${index}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-t from-gray-900/20 to-transparent"
              >
                <div className="aspect-video w-full">
                  <video
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay loop muted playsInline
                  >
                    <source src={`${videoUrl}.webm`} type="video/webm" />
                    <source src={`${videoUrl}.mp4`} type="video/mp4" />
                  </video>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromotionalVideosGrid;

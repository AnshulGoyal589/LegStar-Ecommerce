// components/PromotionalVideo.jsx

const PromotionalVideo = () => {
  // Base URL for your video assets from Cloudinary
  const videoUrl = "https://res.cloudinary.com/dkuhayoum/video/upload/v1764929164/WEBSITE_VIDEO_c7hxii";
  
  // By changing the extension, Cloudinary can generate a poster image from the video
  const posterUrl = "https://res.cloudinary.com/dkuhayoum/video/upload/v1764929164/WEBSITE_VIDEO_c7hxii.jpg";

  return (
    // The container controls the overall size and styling
    <div className="w-full max-w-xl mx-auto mb-8 px-20">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
    
        <div className=" w-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl} // Shows this image while the video loads
          >
            {/* Best practice: Provide multiple formats for browser compatibility */}
            <source src={`${videoUrl}.webm`} type="video/webm" />
            <source src={`${videoUrl}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default PromotionalVideo;
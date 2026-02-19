// components/promotional-videos/VideoPlayer.tsx
"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react"; // Using lucide-react for icons

// Define the type for the video prop for better type safety
interface Video {
  _id: { toString: () => string };
  url: string;
  title: string;
}

const VideoPlayer = ({ video }: { video: Video }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      // Toggle the video's muted property
      videoRef.current.muted = !videoRef.current.muted;
      // Sync the state with the video's actual muted status
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      key={video._id.toString()}
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-t from-gray-900/20 to-transparent"
    >
      <div className="w-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          autoPlay
          loop
          muted // Start muted by default
          playsInline
        >
          <source src={video.url} type="video/mp4" />
        </video>
      </div>

      {/* Title Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
        <p className="text-white text-sm font-medium">{video.title}</p>
      </div>
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

export default VideoPlayer;
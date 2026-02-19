"use server"

import { revalidatePath } from "next/cache"
import { addVideo, deleteVideo, getVideoById } from "@/lib/db/videos"
import { uploadVideo, deleteImage } from "@/lib/cloudinary"

export async function uploadVideoAction(base64Video: string, title: string) {
  // 1. Upload to Cloudinary
  const result = await uploadVideo(base64Video, "legstar/promotional-videos")

  // 2. Save to DB
  await addVideo({
    title,
    url: result.url,
    publicId: result.publicId
  })

  revalidatePath("/")
  revalidatePath("/admin/videos")
}

export async function removeVideoAction(id: string, publicId: string) {
  // Use the publicId passed from the bind to delete from Cloudinary
  if (publicId) {
    await deleteImage(publicId);
  }
  
  await deleteVideo(id);
  
  revalidatePath("/");
  revalidatePath("/admin/videos");
}
"use server"

import { revalidatePath } from "next/cache"
import { saveBanner, deleteBanner, getBannerById } from "@/lib/db/banners"
import { uploadImage, uploadVideo, deleteImage } from "@/lib/cloudinary"

export async function saveBannerAction(id: string | null, formData: any, mediaBase64: string | null) {
  let mediaData = { 
    url: formData.image, 
    publicId: formData.imagePublicId, 
    resourceType: formData.resourceType 
  };

  // If a new file is being uploaded
  if (mediaBase64 && mediaBase64.startsWith("data:")) {
    
    // 1. CLEANUP: If we are EDITING, delete the old image/video from Cloudinary first
    if (id) {
      const existingBanner = await getBannerById(id);
      if (existingBanner?.imagePublicId) {
        // Cloudinary's destroy method works for both images and videos
        await deleteImage(existingBanner.imagePublicId);
      }
    }

    // 2. UPLOAD: Determine type and upload to Cloudinary
    const isVideo = mediaBase64.startsWith("data:video");
    const result = isVideo 
      ? await uploadVideo(mediaBase64, "legstar/banners")
      : await uploadImage(mediaBase64, "legstar/banners");

    mediaData.url = result.url;
    mediaData.publicId = result.publicId;
    mediaData.resourceType = isVideo ? "video" : "image";
  }

  // 3. DATABASE: Save the record
  const payload = {
    ...formData,
    image: mediaData.url,
    imagePublicId: mediaData.publicId,
    resourceType: mediaData.resourceType,
  };

  await saveBanner(id, payload);

  revalidatePath("/admin/banners");
  revalidatePath("/"); // Update home page
  return { success: true };
}

export async function deleteBannerAction(id: string) {
  // 1. Fetch the banner to get the publicId
  const banner = await getBannerById(id);

  // 2. CLEANUP: Delete from Cloudinary
  if (banner?.imagePublicId) {
    await deleteImage(banner.imagePublicId);
  }

  // 3. DATABASE: Delete from MongoDB
  await deleteBanner(id);

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}
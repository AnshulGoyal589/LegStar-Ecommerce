import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: string, folder = "legstar"): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    transformation: [{ width: 1200, height: 1200, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export async function uploadMultipleImages(
  files: string[],
  folder = "legstar/products",
): Promise<Array<{ url: string; publicId: string }>> {
  const uploadPromises = files.map((file) => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

export { cloudinary }

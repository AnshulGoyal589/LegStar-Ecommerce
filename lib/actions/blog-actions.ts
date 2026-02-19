"use server"

import { revalidatePath } from "next/cache"
import { createBlog, updateBlog, deleteBlog, getBlogById } from "@/lib/db/blogs"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

export async function saveBlogAction(blogData: any, base64Image: string | null, isEdit: boolean, id?: string) {
  let imageData = { url: blogData.image, publicId: blogData.imagePublicId || "" };

  // Handle Cloudinary Image Upload
  if (base64Image && base64Image.startsWith("data:image")) {
    // If editing, delete the old image first
    if (isEdit && id) {
      const existing = await getBlogById(id);
      if (existing?.imagePublicId) await deleteImage(existing.imagePublicId);
    }
    
    // Upload new image
    const uploaded = await uploadImage(base64Image, "legstar/blogs");
    imageData.url = uploaded.url;
    imageData.publicId = uploaded.publicId;
  }

  const finalData = {
    ...blogData,
    image: imageData.url,
    imagePublicId: imageData.publicId,
    updatedAt: new Date()
  };

  if (isEdit && id) {
    await updateBlog(id, finalData);
  } else {
    await createBlog({ ...finalData, createdAt: new Date() });
  }

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");
  if (blogData.slug) revalidatePath(`/blogs/${blogData.slug}`);
  return { success: true }; 
}

export async function deleteBlogAction(id: string) {
  const blog = await getBlogById(id);
  if (blog?.imagePublicId) await deleteImage(blog.imagePublicId);
  await deleteBlog(id);
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
}
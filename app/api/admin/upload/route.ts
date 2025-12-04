// app/api/admin/upload/route.ts

import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary with credentials from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Recommended for https urls
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: "No files were provided." }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      // 1. Read the file into an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      // 2. Convert the ArrayBuffer to a Node.js Buffer
      const buffer = Buffer.from(arrayBuffer)

      // 3. Upload the buffer to Cloudinary
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products", // Optional: organize uploads
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error)
              return reject(error.message)
            }
            if (result) {
              return resolve(result.secure_url)
            }
            reject("Cloudinary upload failed for an unknown reason.")
          }
        )
        
        // Write the buffer to the stream and end it
        uploadStream.end(buffer)
      })
    })

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises)

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    console.error("Upload API Error:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
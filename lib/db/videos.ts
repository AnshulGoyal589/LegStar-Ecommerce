import clientPromise from "../mongodb"
import { ObjectId } from "mongodb"

export interface Video {
  _id?: string | ObjectId
  title: string
  url: string
  publicId: string
  createdAt: Date
}

export async function addVideo(video: Omit<Video, "_id" | "createdAt">) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("videos").insertOne({ ...video, createdAt: new Date() })
}

export async function getVideos() {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("videos").find().sort({ createdAt: -1 }).toArray()
}

export async function deleteVideo(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("videos").deleteOne({ _id: new ObjectId(id) })
}

export async function getVideoById(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("videos").findOne({ _id: new ObjectId(id) })
}
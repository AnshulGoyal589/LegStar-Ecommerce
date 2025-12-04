import clientPromise from "../mongodb"
import type { B2BLead } from "../types"
import { ObjectId } from "mongodb"

export async function getB2BLeads() {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<B2BLead>("b2b_leads").find().sort({ createdAt: -1 }).toArray()
}

export async function createB2BLead(lead: Omit<B2BLead, "_id" | "createdAt">) {
  const client = await clientPromise
  const db = client.db("legstar")
  const result = await db.collection("b2b_leads").insertOne({
    ...lead,
    createdAt: new Date(),
  })
  return result
}

export async function deleteB2BLead(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("b2b_leads").deleteOne({ _id: new ObjectId(id) })
}

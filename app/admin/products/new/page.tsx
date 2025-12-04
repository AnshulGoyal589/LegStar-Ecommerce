import { getCategories } from "@/lib/db/categories"
import NewProductPage from "./NewProductPage"

export const dynamic = "force-dynamic" 

export default async function AddProductServerPage() {
  const allCategories = await getCategories()

  const serializedCategories = JSON.parse(JSON.stringify(allCategories))

  return <NewProductPage allCategories={serializedCategories} />
}
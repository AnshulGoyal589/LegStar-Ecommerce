import { getBanners } from "@/lib/db/banners"
import BannersPage from "./BannersPage"

export default async function BannersAdminPage() {
  const rawBanners = await getBanners()
  const banners = JSON.parse(JSON.stringify(rawBanners))
  
  return <BannersPage banners={banners} />
}
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external"

let authToken: string | null = null
let tokenExpiry = 0

async function getAuthToken(): Promise<string> {
  // Check if token is still valid
  if (authToken && Date.now() < tokenExpiry) {
    return authToken
  }

  const response = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })

  const data = await response.json()
  const token = data?.token
  if (typeof token !== "string") {
    throw new Error("Failed to obtain Shiprocket auth token")
  }
  authToken = token
  // Token valid for 10 days, refresh after 9
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000
  return token
}

export interface ShiprocketOrderPayload {
  order_id: string
  order_date: string
  pickup_location: string
  billing_customer_name: string
  billing_last_name: string
  billing_address: string
  billing_city: string
  billing_pincode: string
  billing_state: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: boolean
  shipping_customer_name?: string
  shipping_last_name?: string
  shipping_address?: string
  shipping_city?: string
  shipping_pincode?: string
  shipping_state?: string
  shipping_country?: string
  shipping_email?: string
  shipping_phone?: string
  order_items: {
    name: string
    sku: string
    units: number
    selling_price: number
  }[]
  payment_method: "Prepaid" | "COD"
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number
}

export async function createShiprocketOrder(payload: ShiprocketOrderPayload) {
  const token = await getAuthToken()

  const response = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  return data
}

export async function generateAWB(shipmentId: number, courierId?: number) {
  const token = await getAuthToken()

  const response = await fetch(`${SHIPROCKET_API_URL}/courier/assign/awb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: shipmentId,
      courier_id: courierId,
    }),
  })

  const data = await response.json()
  return data
}

export async function schedulePickup(shipmentId: number) {
  const token = await getAuthToken()

  const response = await fetch(`${SHIPROCKET_API_URL}/courier/generate/pickup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: [shipmentId],
    }),
  })

  const data = await response.json()
  return data
}

export async function trackShipment(shipmentId: number) {
  const token = await getAuthToken()

  const response = await fetch(`${SHIPROCKET_API_URL}/courier/track/shipment/${shipmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return data
}

export async function cancelOrder(orderId: string) {
  const token = await getAuthToken()

  const response = await fetch(`${SHIPROCKET_API_URL}/orders/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ids: [orderId],
    }),
  })

  const data = await response.json()
  return data
}

export async function getServiceability(pickupPincode: string, deliveryPincode: string, weight: number, cod: boolean) {
  const token = await getAuthToken()

  const params = new URLSearchParams({
    pickup_postcode: pickupPincode,
    delivery_postcode: deliveryPincode,
    weight: weight.toString(),
    cod: cod ? "1" : "0",
  })

  const response = await fetch(`${SHIPROCKET_API_URL}/courier/serviceability?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return data
}

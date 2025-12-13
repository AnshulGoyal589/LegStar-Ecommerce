// components/DeleteOrderButton.tsx
"use client"

import { useTransition } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteOrderAction } from "@/app/account/orders/actions"

interface DeleteOrderButtonProps {
  orderId: string
}

export function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      startTransition(async () => {
        // You can optionally handle the returned result here, e.g., show a toast notification
        await deleteOrderAction(orderId)
      })
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete order"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}
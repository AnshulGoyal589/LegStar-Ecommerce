"use client"

import { useState, useEffect } from "react"
import { Loader2, Trash2, Building, Phone, Mail, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { B2BLead } from "@/lib/types"

export default function B2BLeadsPage() {
  const [leads, setLeads] = useState<B2BLead[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/b2b/leads")
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (error) {
      toast.error("Failed to fetch leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/b2b/leads/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Lead deleted")
        fetchLeads()
      } else {
        toast.error("Failed to delete lead")
      }
    } catch (error) {
      toast.error("Failed to delete lead")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">B2B Partnership Leads</h1>
        <p className="text-muted-foreground">View and manage partnership applications</p>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-background border rounded-lg">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No partnership applications yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-background border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{lead.companyName}</h3>
                    <Badge variant="secondary">{lead.partnerType}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.contactName}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setDeleteId(lead._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {lead.city}, {lead.state}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>GST: {lead.gstNumber}</span>
                </div>
              </div>

              {lead.message && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{lead.message}</p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                {lead.experience && <span>Experience: {lead.experience} years</span>}
                {lead.investment && <span>Investment: ₹{lead.investment} Lakhs</span>}
                <span>Applied: {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this partnership application?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

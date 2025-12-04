"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ruler } from "lucide-react"

interface SizeChartDialogProps {
  gender?: "men" | "women" | "kids"
  category?: string
  trigger?: React.ReactNode
}

const menSizes = {
  innerwear: {
    headers: ["Size", "Waist (inches)", "Hip (inches)"],
    rows: [
      ["S", "28-30", "34-36"],
      ["M", "30-32", "36-38"],
      ["L", "32-34", "38-40"],
      ["XL", "34-36", "40-42"],
      ["XXL", "36-38", "42-44"],
      ["3XL", "38-40", "44-46"],
    ],
  },
  tops: {
    headers: ["Size", "Chest (inches)", "Length (inches)"],
    rows: [
      ["S", "36-38", "26"],
      ["M", "38-40", "27"],
      ["L", "40-42", "28"],
      ["XL", "42-44", "29"],
      ["XXL", "44-46", "30"],
      ["3XL", "46-48", "31"],
    ],
  },
}

const womenSizes = {
  innerwear: {
    headers: ["Size", "Bust (inches)", "Under Bust (inches)"],
    rows: [
      ["28B", "28-30", "26-28"],
      ["30B", "30-32", "28-30"],
      ["32B", "32-34", "30-32"],
      ["34B", "34-36", "32-34"],
      ["36B", "36-38", "34-36"],
      ["38B", "38-40", "36-38"],
    ],
  },
  bottoms: {
    headers: ["Size", "Waist (inches)", "Hip (inches)"],
    rows: [
      ["XS", "24-26", "34-36"],
      ["S", "26-28", "36-38"],
      ["M", "28-30", "38-40"],
      ["L", "30-32", "40-42"],
      ["XL", "32-34", "42-44"],
      ["XXL", "34-36", "44-46"],
    ],
  },
}

const kidsSizes = {
  boys: {
    headers: ["Size", "Age", "Chest (inches)", "Waist (inches)"],
    rows: [
      ["2-3Y", "2-3 Years", "21-22", "20-21"],
      ["3-4Y", "3-4 Years", "22-23", "21-22"],
      ["4-5Y", "4-5 Years", "23-24", "22-23"],
      ["6-7Y", "6-7 Years", "25-26", "23-24"],
      ["8-9Y", "8-9 Years", "27-28", "24-25"],
      ["10-11Y", "10-11 Years", "29-30", "25-26"],
    ],
  },
  girls: {
    headers: ["Size", "Age", "Chest (inches)", "Waist (inches)"],
    rows: [
      ["2-3Y", "2-3 Years", "20-21", "19-20"],
      ["3-4Y", "3-4 Years", "21-22", "20-21"],
      ["4-5Y", "4-5 Years", "22-23", "21-22"],
      ["6-7Y", "6-7 Years", "24-25", "22-23"],
      ["8-9Y", "8-9 Years", "26-27", "23-24"],
      ["10-11Y", "10-11 Years", "28-29", "24-25"],
    ],
  },
}

export function SizeChartDialog({ gender = "men", trigger }: SizeChartDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-sm text-primary underline flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            Size Guide
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={gender} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="men">Men</TabsTrigger>
            <TabsTrigger value="women">Women</TabsTrigger>
            <TabsTrigger value="kids">Kids</TabsTrigger>
          </TabsList>

          <TabsContent value="men" className="space-y-6 mt-4">
            <div>
              <h4 className="font-medium mb-3">Innerwear (Briefs, Trunks, Boxers)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      {menSizes.innerwear.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {menSizes.innerwear.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Tops (Vests, T-Shirts)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      {menSizes.tops.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {menSizes.tops.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="women" className="space-y-6 mt-4">
            <div>
              <h4 className="font-medium mb-3">Bras</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      {womenSizes.innerwear.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {womenSizes.innerwear.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Panties, Shorts, Capris</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      {womenSizes.bottoms.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {womenSizes.bottoms.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kids" className="space-y-6 mt-4">
            <div>
              <h4 className="font-medium mb-3">Boys</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      {kidsSizes.boys.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kidsSizes.boys.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Girls</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      {kidsSizes.girls.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kidsSizes.girls.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">How to Measure</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>Chest:</strong> Measure around the fullest part of your chest
            </li>
            <li>
              <strong>Waist:</strong> Measure around your natural waistline
            </li>
            <li>
              <strong>Hip:</strong> Measure around the fullest part of your hips
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

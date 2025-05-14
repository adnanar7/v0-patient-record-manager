"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { addRecord } from "@/lib/record-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, FilePlus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AddRecordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const type = formData.get("type") as "prescription" | "lab_result" | "doctor_note" | "imaging" | "other"
    const provider = formData.get("provider") as string
    const notes = formData.get("notes") as string

    if (!title || !type || !date || !provider) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const recordId = await addRecord(
        {
          userId: user.uid,
          title,
          type,
          date,
          provider,
          notes,
        },
        file || undefined,
      )

      router.push(`/dashboard/records/${recordId}`)
    } catch (error) {
      console.error("Error adding record:", error)
      alert("Failed to add record. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Add New Medical Record</h1>

      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
          <CardDescription>Enter the details of your medical record</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Annual Checkup Results" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Record Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="lab_result">Lab Result</SelectItem>
                  <SelectItem value="doctor_note">Doctor Note</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Healthcare Provider</Label>
              <Input id="provider" name="provider" placeholder="Dr. Smith / City Hospital" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes or details about this record"
                className="min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Document (optional)</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Record...
                </>
              ) : (
                <>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Record
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

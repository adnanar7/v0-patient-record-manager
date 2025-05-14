"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getRecord, deleteRecord, type MedicalRecord } from "@/lib/record-service"
import { summarizeRecord } from "@/lib/ai-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, User, FileText, Trash2, PencilLine, Download, Brain, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function RecordDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [summaryType, setSummaryType] = useState<"layman" | "doctor">("layman")

  useEffect(() => {
    async function loadRecord() {
      if (!user) return

      try {
        const recordData = await getRecord(params.id)

        // Verify the record belongs to the current user
        if (recordData.userId !== user.uid) {
          router.push("/dashboard")
          return
        }

        setRecord(recordData)
      } catch (error) {
        console.error("Error loading record:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadRecord()
  }, [params.id, user, router])

  const handleDelete = async () => {
    if (!record) return

    try {
      await deleteRecord(record.id!)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting record:", error)
      alert("Failed to delete record. Please try again.")
    }
  }

  const handleGenerateSummary = async () => {
    if (!record) return

    setGeneratingSummary(true)

    try {
      // Combine all text content for summarization
      const textToSummarize = [
        `Title: ${record.title}`,
        `Type: ${record.type}`,
        `Provider: ${record.provider}`,
        `Date: ${format(new Date(record.date), "PPP")}`,
        `Notes: ${record.notes || "No additional notes"}`,
      ].join("\n\n")

      const summary = await summarizeRecord(textToSummarize, summaryType)

      // Update the record with the new summary
      if (summaryType === "layman") {
        setRecord({
          ...record,
          laymanSummary: summary,
        })
      } else {
        setRecord({
          ...record,
          doctorSummary: summary,
        })
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      alert("Failed to generate summary. Please try again.")
    } finally {
      setGeneratingSummary(false)
    }
  }

  const recordTypes = {
    prescription: "Prescription",
    lab_result: "Lab Result",
    doctor_note: "Doctor Note",
    imaging: "Imaging",
    other: "Other",
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!record) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-medium">Record not found</h2>
        <p className="text-muted-foreground">
          The record you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{record.title}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/records/${record.id}/edit`}>
              <PencilLine className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this medical record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
          <CardDescription>{recordTypes[record.type as keyof typeof recordTypes]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p>{record.date instanceof Date ? format(record.date, "PPP") : format(new Date(record.date), "PPP")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Provider</p>
                <p>{record.provider}</p>
              </div>
            </div>
          </div>

          {record.notes && (
            <div>
              <h3 className="mb-2 font-medium">Notes</h3>
              <p className="whitespace-pre-line text-muted-foreground">{record.notes}</p>
            </div>
          )}

          {record.fileUrl && (
            <div>
              <h3 className="mb-2 font-medium">Attached Document</h3>
              <Button asChild variant="outline">
                <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  {record.fileName || "Download Document"}
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Summaries
          </CardTitle>
          <CardDescription>Get simplified explanations of your medical record</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="layman" onValueChange={(value) => setSummaryType(value as "layman" | "doctor")}>
            <TabsList className="mb-4">
              <TabsTrigger value="layman">Patient-Friendly</TabsTrigger>
              <TabsTrigger value="doctor">Medical Professional</TabsTrigger>
            </TabsList>

            <TabsContent value="layman">
              {record.laymanSummary ? (
                <div className="rounded-md bg-muted p-4">
                  <p className="whitespace-pre-line">{record.laymanSummary}</p>
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <Brain className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">No patient-friendly summary yet</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Generate a summary that explains this record in simple, easy-to-understand terms.
                  </p>
                  <Button onClick={handleGenerateSummary} disabled={generatingSummary}>
                    {generatingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Patient-Friendly Summary
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="doctor">
              {record.doctorSummary ? (
                <div className="rounded-md bg-muted p-4">
                  <p className="whitespace-pre-line">{record.doctorSummary}</p>
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <Brain className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">No medical professional summary yet</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Generate a detailed summary using proper medical terminology for healthcare professionals.
                  </p>
                  <Button onClick={handleGenerateSummary} disabled={generatingSummary}>
                    {generatingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Medical Professional Summary
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

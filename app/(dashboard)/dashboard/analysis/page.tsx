"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserRecords, type MedicalRecord } from "@/lib/record-service"
import { analyzePatternAcrossRecords } from "@/lib/ai-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BarChart, Brain, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function PatternAnalysisPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    async function loadRecords() {
      if (user) {
        try {
          const userRecords = await getUserRecords(user.uid)
          setRecords(userRecords)
        } catch (error) {
          console.error("Error loading records:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadRecords()
  }, [user])

  const handleRecordSelection = (recordId: string) => {
    setSelectedRecords((prev) => {
      if (prev.includes(recordId)) {
        return prev.filter((id) => id !== recordId)
      } else {
        return [...prev, recordId]
      }
    })
  }

  const handleAnalyze = async () => {
    if (selectedRecords.length < 2) {
      alert("Please select at least 2 records to analyze")
      return
    }

    setAnalyzing(true)

    try {
      const recordsToAnalyze = records
        .filter((record) => selectedRecords.includes(record.id!))
        .map((record) => {
          return [
            `Title: ${record.title}`,
            `Type: ${record.type}`,
            `Provider: ${record.provider}`,
            `Date: ${format(new Date(record.date), "PPP")}`,
            `Notes: ${record.notes || "No additional notes"}`,
          ].join("\n")
        })

      const analysisResult = await analyzePatternAcrossRecords(recordsToAnalyze)
      setAnalysis(analysisResult)
    } catch (error) {
      console.error("Error analyzing patterns:", error)
      alert("Failed to analyze patterns. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pattern Analysis</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Medical Record Pattern Analysis
          </CardTitle>
          <CardDescription>
            Select multiple records to analyze patterns and trends across your medical history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <BarChart className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="mb-2 text-lg font-medium">No records found</p>
              <p className="text-muted-foreground">You need to add medical records before you can analyze patterns.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Records to Analyze</h3>
                <div className="max-h-96 overflow-y-auto rounded-md border p-4">
                  {records.map((record) => (
                    <div key={record.id} className="flex items-start gap-2 py-2">
                      <Checkbox
                        id={record.id}
                        checked={selectedRecords.includes(record.id!)}
                        onCheckedChange={() => handleRecordSelection(record.id!)}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={record.id} className="cursor-pointer font-medium">
                          {record.title}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {format(record.date instanceof Date ? record.date : new Date(record.date), "PPP")} •{" "}
                          {record.provider}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleAnalyze} disabled={selectedRecords.length < 2 || analyzing} className="w-full">
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Selected Records ({selectedRecords.length})
                    </>
                  )}
                </Button>
              </div>

              {analysis && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Analysis Results</h3>
                  <div className="rounded-md bg-muted p-4">
                    <p className="whitespace-pre-line">{analysis}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

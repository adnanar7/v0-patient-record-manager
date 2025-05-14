"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { recognizeHandwriting } from "@/lib/ai-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenTool, Upload, ImageIcon, Loader2, Copy, Save } from "lucide-react"
import { addRecord } from "@/lib/record-service"
import { useRouter } from "next/navigation"

export default function HandwritingRecognitionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [recognizedText, setRecognizedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [savingRecord, setSavingRecord] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImage(event.target.result)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleRecognize = async () => {
    if (!image) return

    setLoading(true)

    try {
      const text = await recognizeHandwriting(image)
      setRecognizedText(text)
    } catch (error) {
      console.error("Error recognizing handwriting:", error)
      alert("Failed to recognize handwriting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(recognizedText)
    alert("Text copied to clipboard!")
  }

  const handleSaveAsRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !recognizedText) return

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const provider = formData.get("provider") as string

    if (!title || !provider) {
      alert("Please fill in all required fields")
      return
    }

    setSavingRecord(true)

    try {
      const recordId = await addRecord(
        {
          userId: user.uid,
          title,
          type: "prescription",
          date: new Date(),
          provider,
          notes: recognizedText,
        },
        file || undefined,
      )

      router.push(`/dashboard/records/${recordId}`)
    } catch (error) {
      console.error("Error saving record:", error)
      alert("Failed to save record. Please try again.")
    } finally {
      setSavingRecord(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Handwriting Recognition</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Prescription & Handwriting Recognition
          </CardTitle>
          <CardDescription>
            Upload an image of handwritten medical notes or prescriptions to convert them to text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="results" disabled={!recognizedText}>
                Results
              </TabsTrigger>
              <TabsTrigger value="save" disabled={!recognizedText}>
                Save as Record
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {image ? (
                      <div className="relative h-full w-full">
                        <img
                          src={image || "/placeholder.svg"}
                          alt="Uploaded prescription"
                          className="mx-auto h-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                        <p className="mb-1 text-lg font-medium">Upload an image</p>
                        <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Image
                    </Button>
                    <Button onClick={handleRecognize} disabled={!image || loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <PenTool className="mr-2 h-4 w-4" />
                          Recognize Text
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Recognized Text</h3>
                  <Button variant="outline" size="sm" onClick={handleCopyText}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Text
                  </Button>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="whitespace-pre-line">{recognizedText}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="save">
              <form onSubmit={handleSaveAsRecord} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Record Title</Label>
                  <Input id="title" name="title" placeholder="Prescription from Dr. Smith" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Healthcare Provider</Label>
                  <Input id="provider" name="provider" placeholder="Dr. Smith / City Hospital" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Recognized Text</Label>
                  <Textarea
                    id="notes"
                    value={recognizedText}
                    onChange={(e) => setRecognizedText(e.target.value)}
                    className="min-h-32"
                    placeholder="The recognized text will appear here"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={savingRecord}>
                  {savingRecord ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save as Medical Record
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"
import { useState } from "react"

export default function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Authentication Successful!
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-700 dark:text-green-400"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        <CardDescription className="text-green-600 dark:text-green-500">
          You've successfully authenticated with Firebase.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-green-600 dark:text-green-500">
        <p>
          Your Patient Record Manager is now ready to use. You can start adding medical records, using AI-powered
          features, and managing your health information securely.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            asChild
          >
            <a href="/dashboard/add-record">Add Your First Record</a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            asChild
          >
            <a href="/dashboard/handwriting">Try Handwriting Recognition</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

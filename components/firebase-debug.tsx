"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react"
import { debugInfo } from "@/lib/firebase"

export default function FirebaseDebug() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Firebase API Key Error
        </CardTitle>
        <CardDescription>
          The Firebase API key is not valid. This is causing the auth/api-key-not-valid error.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Status:</p>
            <ul className="list-inside space-y-1 text-sm">
              <li>
                API Key: {debugInfo.apiKeyPresent ? "Present" : "Missing"}{" "}
                {debugInfo.apiKeyPresent && !debugInfo.apiKeyValid && "(Invalid format)"}
              </li>
              <li>API Key Length: {debugInfo.apiKeyLength} characters</li>
              <li>API Key Prefix: {debugInfo.apiKeyPrefix}</li>
            </ul>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showDetails && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Troubleshooting steps:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>
                    <strong>Check your API key:</strong> Make sure it's correctly copied from the Firebase console
                    without any extra spaces or characters
                  </li>
                  <li>
                    <strong>Regenerate the API key:</strong> Try generating a new API key in the Firebase console
                  </li>
                  <li>
                    <strong>Verify project settings:</strong> Ensure the Firebase project has Authentication enabled
                  </li>
                  <li>
                    <strong>Check environment variables:</strong> Make sure all Firebase environment variables are
                    correctly set in your Vercel project
                  </li>
                </ol>
              </div>

              <div className="rounded-md bg-muted p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <p className="font-medium">All environment variables:</p>
                </div>
                <ul className="mt-2 list-inside space-y-1">
                  <li>Auth Domain: {debugInfo.authDomainPresent ? "✅ Present" : "❌ Missing"}</li>
                  <li>Project ID: {debugInfo.projectIdPresent ? "✅ Present" : "❌ Missing"}</li>
                  <li>Storage Bucket: {debugInfo.storageBucketPresent ? "✅ Present" : "❌ Missing"}</li>
                  <li>Messaging Sender ID: {debugInfo.messagingSenderIdPresent ? "✅ Present" : "❌ Missing"}</li>
                  <li>App ID: {debugInfo.appIdPresent ? "✅ Present" : "❌ Missing"}</li>
                </ul>
              </div>

              <div className="rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
                <p className="font-medium text-amber-800 dark:text-amber-300">How to fix this issue:</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-amber-700 dark:text-amber-400">
                  <li>Go to the Firebase console (console.firebase.google.com)</li>
                  <li>Select your project</li>
                  <li>Go to Project settings (gear icon) &gt; General tab</li>
                  <li>Find the "Web API Key" in the "Your apps" section</li>
                  <li>Copy this key and update your NEXT_PUBLIC_FIREBASE_API_KEY environment variable</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

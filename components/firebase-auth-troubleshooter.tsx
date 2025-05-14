import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { firebaseConfig } from "@/lib/firebase"

export default function FirebaseAuthTroubleshooter() {
  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Firebase Authentication Error
        </CardTitle>
        <CardDescription>
          The Firebase project configuration could not be found. This is causing the auth/configuration-not-found error.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">Troubleshooting steps:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>
                <strong>Enable Authentication in Firebase Console:</strong> Make sure Email/Password authentication is
                enabled in your Firebase project.
              </li>
              <li>
                <strong>Check Project Configuration:</strong> Verify that the Firebase project exists and is properly
                configured.
              </li>
              <li>
                <strong>Verify Project ID:</strong> Ensure the project ID in your configuration matches your Firebase
                project.
              </li>
              <li>
                <strong>Check Storage Bucket:</strong> The storage bucket URL might be incorrect. It should typically be{" "}
                <code>{firebaseConfig.projectId}.appspot.com</code>.
              </li>
            </ol>
          </div>

          <div className="rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
            <p className="font-medium text-amber-800 dark:text-amber-300">How to enable Authentication:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-amber-700 dark:text-amber-400">
              <li>Go to the Firebase console (console.firebase.google.com)</li>
              <li>Select your project: {firebaseConfig.projectId}</li>
              <li>Go to "Authentication" in the left sidebar</li>
              <li>Click on the "Sign-in method" tab</li>
              <li>Enable "Email/Password" as a sign-in provider</li>
              <li>Save your changes</li>
            </ol>
          </div>

          <Button asChild className="w-full">
            <Link
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span>Open Firebase Authentication Settings</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

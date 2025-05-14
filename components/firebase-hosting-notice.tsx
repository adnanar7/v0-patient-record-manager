import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function FirebaseHostingNotice() {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
          Firebase Hosting Not Deployed
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-400">
          Your Firebase project is set up, but the hosting site hasn't been deployed yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-amber-700 dark:text-amber-400">
        <p>
          This doesn't affect the functionality of your application, but you may want to deploy your Firebase hosting
          site for production use. You can do this by following these steps:
        </p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>
            Install the Firebase CLI: <code>npm install -g firebase-tools</code>
          </li>
          <li>
            Login to Firebase: <code>firebase login</code>
          </li>
          <li>
            Initialize your project: <code>firebase init</code>
          </li>
          <li>
            Deploy to Firebase: <code>firebase deploy</code>
          </li>
        </ol>
        <p className="mt-2">
          For more information, see the{" "}
          <Link
            href="https://firebase.google.com/docs/hosting/quickstart"
            className="font-medium text-amber-800 underline dark:text-amber-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firebase Hosting documentation
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}

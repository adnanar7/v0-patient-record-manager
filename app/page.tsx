import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileIcon as FileMedical, Shield, Brain, PenTool, BarChart } from "lucide-react"
import FirebaseHostingNotice from "@/components/firebase-hosting-notice"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <FileMedical className="h-5 w-5 text-primary" />
            <span>Patient Record Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <FirebaseHostingNotice />
        </div>

        <section className="bg-gradient-to-b from-background to-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Never Lose Your Medical Records Again
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Securely store, manage, and understand your medical records with AI-powered insights and analysis.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <Shield className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium">Secure Storage</h3>
                <p className="text-muted-foreground">
                  Keep all your medical records in one secure place with end-to-end encryption.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <Brain className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium">AI Summaries</h3>
                <p className="text-muted-foreground">
                  Get easy-to-understand summaries of your medical records in plain language.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <PenTool className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium">Handwriting Recognition</h3>
                <p className="text-muted-foreground">
                  Convert doctor's handwritten notes and prescriptions into readable text.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <BarChart className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium">Pattern Analysis</h3>
                <p className="text-muted-foreground">
                  Identify trends and patterns across your medical history for better insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold">Take Control of Your Health Records</h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Join thousands of users who have simplified managing their medical history with our platform.
              </p>
              <Button asChild size="lg">
                <Link href="/signup">Create Your Free Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-semibold">
              <FileMedical className="h-5 w-5 text-primary" />
              <span>Patient Record Manager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Patient Record Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

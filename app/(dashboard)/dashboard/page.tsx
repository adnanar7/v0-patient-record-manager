"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserRecords, type MedicalRecord } from "@/lib/record-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePlus, FileText, Calendar, User } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import WelcomeBanner from "@/components/welcome-banner"

export default function DashboardPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Check if this is the first visit after login/signup
    const isFirstVisit = sessionStorage.getItem("firstDashboardVisit") !== "false"
    setShowWelcome(isFirstVisit)

    // Mark as visited
    sessionStorage.setItem("firstDashboardVisit", "false")

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

  const recordTypes = {
    prescription: "Prescription",
    lab_result: "Lab Result",
    doctor_note: "Doctor Note",
    imaging: "Imaging",
    other: "Other",
  }

  return (
    <div className="space-y-6">
      {showWelcome && <WelcomeBanner />}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Medical Records</h1>
        <Button asChild>
          <Link href="/dashboard/add-record">
            <FilePlus className="mr-2 h-4 w-4" />
            Add New Record
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab_result">Lab Results</TabsTrigger>
          <TabsTrigger value="doctor_note">Doctor Notes</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
        </TabsList>

        {Object.entries(recordTypes).map(([type, label]) => (
          <TabsContent key={type} value={type === "other" ? "all" : type} className="space-y-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <p>Loading records...</p>
              </div>
            ) : records.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-xl font-medium">No records found</p>
                  <p className="text-center text-muted-foreground">You haven't added any medical records yet.</p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/add-record">
                      <FilePlus className="mr-2 h-4 w-4" />
                      Add Your First Record
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {records
                  .filter((record) => (type === "other" ? true : record.type === type))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => (
                    <Card key={record.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle>{record.title}</CardTitle>
                        <CardDescription>{recordTypes[record.type as keyof typeof recordTypes]}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {record.date instanceof Date
                              ? format(record.date, "PPP")
                              : format(new Date(record.date), "PPP")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{record.provider}</span>
                        </div>
                        {record.notes && <p className="line-clamp-2 text-sm text-muted-foreground">{record.notes}</p>}
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/dashboard/records/${record.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

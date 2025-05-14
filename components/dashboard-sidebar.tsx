"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, FilePlus, FileSearch, Brain, PenTool, BarChart } from "lucide-react"

const navItems = [
  {
    title: "All Records",
    href: "/dashboard",
    icon: FileText,
  },
  {
    title: "Add Record",
    href: "/dashboard/add-record",
    icon: FilePlus,
  },
  {
    title: "Search Records",
    href: "/dashboard/search",
    icon: FileSearch,
  },
  {
    title: "AI Summaries",
    href: "/dashboard/summaries",
    icon: Brain,
  },
  {
    title: "Handwriting Recognition",
    href: "/dashboard/handwriting",
    icon: PenTool,
  },
  {
    title: "Pattern Analysis",
    href: "/dashboard/analysis",
    icon: BarChart,
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r bg-muted/40 md:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

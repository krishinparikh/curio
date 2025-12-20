"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/Header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export function ProfileHeader() {
  return (
    <Header
      content={
        <div className="flex items-center justify-between w-full gap-2">
          <Link href="/home" className="md:hidden flex-shrink-0">
            <Image src="/CurioIcon.png" alt="Curio" width={200} height={200} priority className="h-7 w-7" />
          </Link>
          <Breadcrumb className="flex-1 min-w-0">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>My Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      }
    />
  )
}


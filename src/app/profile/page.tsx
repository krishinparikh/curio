"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { X } from "lucide-react"
import { useGetUser } from "@/hooks/useGetUser"
import { useUpdateUser } from "./hooks"
import { Field } from "./components/Field"
import { IconButton } from "@/components/IconButton"
import { EditOrSaveButton } from "./components/EditOrSaveButton"
import { ProfileHeader } from "./components/ProfileHeader"

function splitFullName(name: string | null): [string, string] {
  if (!name) {
    return ["", ""]
  }

  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) {
    return ["", ""]
  }

  const first = parts.shift() ?? ""
  const last = parts.join(" ")

  return [first, last]
}

function combineName(first: string, last: string) {
  return [first, last].map((value) => value.trim()).filter(Boolean).join(" ")
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userId = session?.user?.id || ""

  const getUserQuery = useGetUser(userId)
  const updateUserMutation = useUpdateUser(userId)

  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (getUserQuery.data) {
      const [fName, lName] = splitFullName(getUserQuery.data.name)
      setFirstName(fName)
      setLastName(lName)
      setBio(getUserQuery.data.bio ?? "")
    }
  }, [getUserQuery.data])

  const handleSave = async () => {
    setSuccessMessage(null)

    const name = combineName(firstName, lastName) || undefined

    updateUserMutation.mutate(
      { name, bio },
      {
        onSuccess: () => {
          setSuccessMessage("Profile updated successfully")
          setIsEditing(false)
        },
      }
    )
  }

  const handleCancel = () => {
    if (getUserQuery.data) {
      const [fName, lName] = splitFullName(getUserQuery.data.name)
      setFirstName(fName)
      setLastName(lName)
      setBio(getUserQuery.data.bio ?? "")
    }
    setIsEditing(false)
    setSuccessMessage(null)
    updateUserMutation.reset()
  }

  const isLoading = status === "loading" || getUserQuery.isLoading

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your profile…</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const errorMessage = getUserQuery.error?.message || updateUserMutation.error?.message

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />
      <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 rounded border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">{errorMessage}</p>
          </div>
        )}

        {!errorMessage && successMessage && (
          <div className="mb-6 rounded border border-emerald-500/50 bg-emerald-500/10 p-4">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{successMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded border border-border bg-card shadow-sm relative">
          <div className="px-6 py-8 space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
                <Field
                  label="First name"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter first name"
                />

                <Field
                  label="Last name"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter last name"
                />

                <Field
                  label="Email address"
                  id="email"
                  type="email"
                  value={getUserQuery.data?.email || ""}
                  disabled
                  helperText="Email address cannot be changed"
                />

                <Field
                  label="Bio"
                  id="bio"
                  multiline
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell us a bit about yourself..."
                  helperText="Brief description for your profile. Max 500 characters."
                />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-border bg-muted/50 px-6 py-4">
            {isEditing && (
              <IconButton
                type="button"
                variant="outline"
                icon={<X className="h-4 w-4" />}
                onClick={handleCancel}
                disabled={updateUserMutation.isPending}
              >
                Cancel
              </IconButton>
            )}
            <EditOrSaveButton
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              isSaving={updateUserMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

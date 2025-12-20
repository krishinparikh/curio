import { IconButton } from "@/components/IconButton"
import { Pencil, Save } from "lucide-react"

interface EditOrSaveButtonProps {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  isSaving?: boolean
}

export function EditOrSaveButton({ isEditing, onEdit, onSave, isSaving = false }: EditOrSaveButtonProps) {
  if (isEditing) {
    return (
      <IconButton
        type="button"
        icon={<Save className="h-4 w-4" />}
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </IconButton>
    )
  }

  return (
    <IconButton
      type="button"
      icon={<Pencil className="h-4 w-4" />}
      onClick={onEdit}
    >
      Edit
    </IconButton>
  )
}


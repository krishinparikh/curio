import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ChangeEvent } from "react"

interface FieldProps {
  label: string
  id: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  disabled?: boolean
  placeholder?: string
  helperText?: string
  type?: "text" | "email"
  multiline?: boolean
}

export function Field({
  label,
  id,
  value,
  onChange,
  disabled = false,
  placeholder,
  helperText,
  type = "text",
  multiline = false,
}: FieldProps) {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
          disabled={disabled}
          className={`min-h-[120px] resize-none ${disabled ? "border-muted bg-muted/50" : ""}`}
          placeholder={placeholder}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
          disabled={disabled}
          className={disabled ? "border-muted bg-muted/50" : ""}
          placeholder={placeholder}
        />
      )}
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}


"use client";

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <InputGroup className="bg-sidebar-accent !border-sidebar-border h-10 !rounded-lg">
      <InputGroupAddon>
        <InputGroupText>
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Search sessions"
        className="focus-visible:ring-0 focus-visible:ring-offset-0 text-sm bg-transparent placeholder:text-muted-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}

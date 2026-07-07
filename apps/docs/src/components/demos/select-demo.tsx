"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@manpowerhub/ui";

export function SelectDemo() {
  return (
    <div className="w-48">
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Select fruit…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

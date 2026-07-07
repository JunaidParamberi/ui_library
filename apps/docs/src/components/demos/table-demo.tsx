"use client";
import { DataTable } from "@manpowerhub/ui";

interface Person {
  id: string;
  name: string;
  role: string;
  age: number;
}

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", age: 36 },
  { id: "2", name: "Grace Hopper", role: "Engineer", age: 85 },
  { id: "3", name: "Alan Turing", role: "Researcher", age: 41 },
];

export function TableDemo() {
  return (
    <DataTable
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
        { key: "age", header: "Age" },
      ]}
      data={people}
      getRowId={(p: Person) => p.id}
    />
  );
}

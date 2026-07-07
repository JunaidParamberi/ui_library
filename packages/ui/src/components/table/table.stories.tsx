import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DataTable } from "./index";

const meta: Meta<typeof Table> = { title: "Components/Table", component: Table };
export default meta;

interface Person { id: string; name: string; role: string; age: number }
const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", age: 36 },
  { id: "2", name: "Grace Hopper", role: "Engineer", age: 85 },
  { id: "3", name: "Alan Turing", role: "Researcher", age: 41 },
];

export const Static: StoryObj<typeof Table> = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell>{p.role}</TableCell></TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Sortable: StoryObj<typeof DataTable> = {
  render: () => (
    <DataTable
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
        { key: "age", header: "Age" },
      ]}
      data={people}
      getRowId={(p: Person) => p.id}
    />
  ),
};

export const Dark: StoryObj<typeof Table> = { ...Static, globals: { theme: "dark" } };
export const Customization: StoryObj<typeof Table> = { render: () => <Table className="max-w-md"><TableBody><TableRow><TableCell>Narrow table</TableCell></TableRow></TableBody></Table> };

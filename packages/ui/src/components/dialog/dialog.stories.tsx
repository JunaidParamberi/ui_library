import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";

const meta: Meta<typeof Dialog> = { title: "Components/Dialog", component: Dialog };
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlwaysOpen: Story = {
  render: () => (
    <Dialog open>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Always open (visual test)</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <Dialog open>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent className="max-w-lg border-primary">
        <DialogTitle>Custom width + border</DialogTitle>
      </DialogContent>
    </Dialog>
  ),
};

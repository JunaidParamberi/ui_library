import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AuthForm } from "./auth-form";

const meta: Meta<typeof AuthForm> = { title: "Blocks/AuthForm", component: AuthForm };
export default meta;
type Story = StoryObj<typeof AuthForm>;

function Controlled(args: Partial<React.ComponentProps<typeof AuthForm>>) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  return (
    <AuthForm
      email={{ value: email, onChange: setEmail }}
      password={{ value: password, onChange: setPassword }}
      remember={{ checked: remember, onChange: setRemember }}
      onSubmit={(e) => e.preventDefault()}
      footer={<a href="#" className="text-primary hover:underline">Forgot password?</a>}
      {...args}
    />
  );
}

export const Login: Story = { render: (a) => <Controlled {...a} /> };
export const Signup: Story = { render: (a) => <Controlled {...a} mode="signup" /> };
export const Loading: Story = { render: (a) => <Controlled {...a} loading /> };
export const WithError: Story = { render: (a) => <Controlled {...a} error="Invalid email or password." /> };
export const Dark: Story = { render: (a) => <Controlled {...a} />, globals: { theme: "dark" } };
export const Customization: Story = { render: (a) => <Controlled {...a} className="max-w-lg ring-1 ring-primary/30" /> };

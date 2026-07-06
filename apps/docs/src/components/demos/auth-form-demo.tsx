"use client";
import * as React from "react";
import { AuthForm } from "@manpowerhub/blocks";

export function AuthFormDemo() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <AuthForm
      email={{ value: email, onChange: setEmail }}
      password={{ value: password, onChange: setPassword }}
      onSubmit={(e) => e.preventDefault()}
      footer={
        <a href="#" className="text-primary hover:underline">
          Forgot password?
        </a>
      }
    />
  );
}

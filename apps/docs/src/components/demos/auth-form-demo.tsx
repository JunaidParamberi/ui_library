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

export function AuthFormDefaultState() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <AuthForm
      email={{ value: email, onChange: setEmail }}
      password={{ value: password, onChange: setPassword }}
      onSubmit={(e) => e.preventDefault()}
    />
  );
}

export function AuthFormLoadingState() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <AuthForm
      email={{ value: email, onChange: setEmail }}
      password={{ value: password, onChange: setPassword }}
      onSubmit={(e) => e.preventDefault()}
      loading
    />
  );
}

export function AuthFormErrorState() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <AuthForm
      email={{ value: email, onChange: setEmail }}
      password={{ value: password, onChange: setPassword }}
      onSubmit={(e) => e.preventDefault()}
      error="Invalid email or password."
    />
  );
}

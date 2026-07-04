import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardBody, Field, Input, Button, Checkbox, cn } from "@manpowerhub/ui";

export const authFormVariants = cva("w-full", {
  variants: {
    width: { sm: "max-w-sm", md: "max-w-md" },
  },
  defaultVariants: { width: "sm" },
});

export interface AuthFieldControl {
  value: string;
  onChange: (value: string) => void;
}

export interface AuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    VariantProps<typeof authFormVariants> {
  mode?: "login" | "signup";
  email: AuthFieldControl;
  password: AuthFieldControl;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  error?: string;
  loading?: boolean;
  remember?: { checked: boolean; onChange: (checked: boolean) => void };
  showPassword?: boolean;
  onTogglePassword?: () => void;
  footer?: React.ReactNode;
}

export const AuthForm = React.forwardRef<HTMLFormElement, AuthFormProps>(
  (
    {
      className,
      width,
      mode = "login",
      email,
      password,
      onSubmit,
      title,
      error,
      loading = false,
      remember,
      showPassword,
      footer,
      onTogglePassword,
      ...props
    },
    ref,
  ) => {
    const isSignup = mode === "signup";
    const heading = title ?? (isSignup ? "Create your account" : "Sign in");
    const submitLabel = isSignup ? "Create account" : "Sign in";
    const emailId = React.useId();
    const pwId = React.useId();

    return (
      <Card>
        <CardBody>
          <form
            ref={ref}
            onSubmit={onSubmit}
            className={cn("flex flex-col gap-4", authFormVariants({ width }), className)}
            {...props}
          >
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">{heading}</h2>

            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Field label="Email" htmlFor={emailId} required>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                value={email.value}
                onChange={(e) => email.onChange(e.target.value)}
              />
            </Field>

            <Field label="Password" htmlFor={pwId} required>
              <Input
                id={pwId}
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password.value}
                onChange={(e) => password.onChange(e.target.value)}
              />
            </Field>

            {onTogglePassword && (
              <Button type="button" variant="ghost" size="sm" className="self-start" onClick={onTogglePassword}>
                {showPassword ? "Hide password" : "Show password"}
              </Button>
            )}

            {remember && !isSignup && (
              <Checkbox
                id={`${emailId}-remember`}
                label="Remember me"
                checked={remember.checked}
                onCheckedChange={(c) => remember.onChange(c === true)}
              />
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              {submitLabel}
            </Button>

            {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
          </form>
        </CardBody>
      </Card>
    );
  },
);
AuthForm.displayName = "AuthForm";

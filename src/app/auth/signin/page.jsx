"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Checkbox, Input, Label, TextField } from "@heroui/react";
import { ArrowRight, Envelope, Eye, EyeSlash, Lock } from "@gravity-ui/icons";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Could not sign in.");
        return;
      }

      setSuccessMessage("Signed in successfully!");
      
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect");
      router.push(redirectUrl || "/");
    } catch (error) {
      setErrorMessage(error?.message || "Could not sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-black/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-14 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[#0088FF]/20 blur-[120px]" />
        <div className="absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-[#FF5E00]/15 blur-[90px]" />
        <div className="absolute -right-10 top-1/3 h-60 w-60 rounded-full bg-[#0055FF]/20 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_54%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 py-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-zinc-700/60 bg-zinc-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
            NextHire Access
          </div>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Welcome back. Continue where your hiring journey left off.
          </h1>
        </div>

        <Card className="border border-zinc-800/80 bg-zinc-900/50 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <Card.Header className="py-3">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Access your NextHire account.
              </p>
            </div>
          </Card.Header>

          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-2">
              <Field
                id="email"
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
                autoComplete="email"
                type="email"
                icon={<Envelope className="h-4 w-4 text-zinc-400" />}
              />

              <PasswordField
                id="password"
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                autoComplete="current-password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((value) => !value)}
              />

              <div className="flex items-center justify-between gap-4 pt-1">
                <Checkbox
                  isSelected={rememberMe}
                  onChange={(value) => setRememberMe(Boolean(value))}
                >
                  <Checkbox.Control className="mt-0.5 h-5 w-5 rounded-[6px] border border-zinc-500/80 bg-zinc-950 data-[selected=true]:border-[#0088FF] data-[selected=true]:bg-[#0088FF]">
                    <Checkbox.Indicator className="text-white">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path
                          d="m3.2 8 3 3 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.Content className="text-sm flex flex-row gap-1 flex-wrap text-zinc-300">
                    Remember me
                  </Checkbox.Content>
                </Checkbox>

                <Link
                  href="#"
                  className="text-sm text-[#56ABFF] transition-colors hover:text-[#86C2FF]"
                >
                  Forgot password?
                </Link>
              </div>

              {errorMessage ? (
                <p className="text-sm text-red-400">{errorMessage}</p>
              ) : null}

              {successMessage ? (
                <p className="text-sm text-emerald-400">{successMessage}</p>
              ) : null}

              <Button
                type="submit"
                isDisabled={isSubmitting || !email.trim() || !password}
                className="mt-2 h-12 w-full bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,136,255,0.35)]"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Card.Content>

          <Card.Footer className="flex justify-center pb-6 pt-4">
            <p className="text-sm text-zinc-400">
              New to NextHire?{" "}
              <Link 
                href="/auth/signup"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/auth/signup${window.location.search}`);
                }}
                className="text-[#FF8A3D] hover:text-[#FFA15F]"
              >
                Create an account
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
  type = "text",
}) {
  return (
    <TextField className="w-full" name={id} isRequired>
      <Label className="mb-1.5 text-sm font-medium text-zinc-200">{label}</Label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
          {icon}
        </div>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-xl border border-zinc-700/70 bg-zinc-950/70 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0088FF]/70"
        />
      </div>
    </TextField>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  showPassword,
  onTogglePassword,
}) {
  return (
    <TextField className="w-full" name={id} isRequired>
      <Label className="mb-1.5 text-sm font-medium text-zinc-200">{label}</Label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <Lock className="h-4 w-4 text-zinc-400" />
        </div>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-xl border border-zinc-700/70 bg-zinc-950/70 pl-10 pr-11 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0088FF]/70"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeSlash className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </TextField>
  );
}

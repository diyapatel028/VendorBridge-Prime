import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const email = watch("email");

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/80 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 border border-white/20 items-center justify-center mb-4">
            <span className="font-bold text-white text-xl">VB</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {sent ? "Check your email" : "Reset your password"}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {sent ? `We've sent reset instructions to ${email}` : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                If an account exists with that email address, you'll receive password reset instructions within a few minutes.
              </p>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => setSent(false)} variant="outline">
                  Try a different email
                </Button>
                <Link href="/login">
                  <Button className="w-full">Return to sign in</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@company.com" className="pl-10" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t">
                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

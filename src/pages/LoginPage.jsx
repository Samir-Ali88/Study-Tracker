import { useState } from "react";
import { Navigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";
import LoginForm from "@/features/auth/LoginForm";
import RegisterForm from "@/features/auth/RegisterForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState("login");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner message="Checking your session..." />
      </div>
    );
  }

  // Logged-in students visiting /login go straight to Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Study Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semester 3 · Final Exam Preparation
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div
            role="alert"
            className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900"
          >
            <p className="font-semibold">Firebase setup needed</p>
            <p className="mt-1">
              Copy <code>.env.example</code> to <code>.env</code>, paste your
              Firebase Web App keys, and restart <code>npm run dev</code> before
              registering or logging in.
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1">
              <Button
                type="button"
                variant={mode === "login" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("login")}
              >
                Log in
              </Button>
              <Button
                type="button"
                variant={mode === "register" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("register")}
              >
                Register
              </Button>
            </div>

            <CardTitle className="pt-3 text-xl">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in with your student email and password."
                : "Register to track your Semester 3 final exam progress."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

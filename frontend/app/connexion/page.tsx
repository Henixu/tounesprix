"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";

type LoginForm = {
  email: string;
  password: string;
};

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const nextErrors: Partial<LoginForm> = {};

    if (!form.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Format d'email invalide.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Le mot de passe doit contenir au moins 6 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError("");
    setSuccessMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      setSuccessMessage("Connexion reussie.");
      router.push(user.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      setGlobalError(getApiErrorMessage(error, "Impossible de se connecter pour le moment."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-md">
        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-7">
            <div className="mb-6 text-center">
              <p className="font-heading text-3xl font-medium text-ink-950">TounesPrix</p>
              <h1 className="mt-2 text-lg font-semibold text-ink-900">Connexion</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-900">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="vous@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink-900">Mot de passe</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="******"
                />
                {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password}</p>}
              </div>

              {globalError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{globalError}</p>}
              {successMessage && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="font-semibold text-brass-700 hover:text-brass-600">
                Creer un compte
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

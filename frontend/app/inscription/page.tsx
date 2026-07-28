"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function InscriptionPage() {
  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const nextErrors: Partial<RegisterForm> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Le nom est requis.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Format d'email invalide.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Le mot de passe doit contenir au moins 8 caracteres.";
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Veuillez confirmer le mot de passe.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    if (form.email.toLowerCase() === "deja@tounesprix.tn") {
      setGlobalError("Cette adresse email est deja utilisee.");
      return;
    }

    setSuccessMessage("Inscription simulee avec succes.");
  };

  return (
    <div className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-md">
        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-7">
            <div className="mb-6 text-center">
              <p className="font-heading text-3xl font-medium text-ink-950">TounesPrix</p>
              <h1 className="mt-2 text-lg font-semibold text-ink-900">Inscription</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-900">Nom complet</label>
                <Input
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Votre nom"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>}
              </div>

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
                  placeholder="Au moins 8 caracteres"
                />
                {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink-900">Confirmation</label>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  placeholder="Confirmer le mot de passe"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-700">{errors.confirmPassword}</p>
                )}
              </div>

              {globalError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{globalError}</p>}
              {successMessage && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creation du compte..." : "S'inscrire"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              Deja inscrit ?{" "}
              <Link href="/connexion" className="font-semibold text-brass-700 hover:text-brass-600">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

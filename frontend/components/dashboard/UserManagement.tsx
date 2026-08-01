"use client";

import { useCallback, useEffect, useState } from "react";
import { FormMessage, MessageBanner } from "@/components/dashboard/AdminFormControls";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { deleteUser, getUsers, updateUserRole, type AdminUser } from "@/services/users";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [message, setMessage] = useState<FormMessage>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setListError("");
    } catch (error) {
      setListError(getApiErrorMessage(error, "Impossible de charger les utilisateurs."));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refreshUsers().finally(() => setLoading(false));
  }, [refreshUsers]);

  const handleToggleRole = async (targetUser: AdminUser) => {
    const nextRole = targetUser.role === "admin" ? "user" : "admin";
    setPendingUserId(targetUser._id);
    setMessage(null);
    try {
      await updateUserRole(targetUser._id, nextRole);
      setMessage({ type: "success", text: `${targetUser.name} est maintenant ${nextRole === "admin" ? "administrateur" : "utilisateur"}.` });
      await refreshUsers();
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setPendingUserId(null);
    }
  };

  const handleDelete = async (targetUser: AdminUser) => {
    if (!window.confirm(`Supprimer le compte de "${targetUser.name}" ?`)) return;
    setPendingUserId(targetUser._id);
    setMessage(null);
    try {
      await deleteUser(targetUser._id);
      setMessage({ type: "success", text: "Utilisateur supprime." });
      await refreshUsers();
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setPendingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader label="Chargement des utilisateurs..." />
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {listError && <MessageBanner message={{ type: "error", text: listError }} />}
      {message && <MessageBanner message={message} />}

      <Card className="rounded-xl border-line bg-paper">
        <CardContent className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="py-3 pr-3 font-semibold text-ink-900">Nom</th>
                  <th className="py-3 pr-3 font-semibold text-ink-900">Email</th>
                  <th className="py-3 pr-3 font-semibold text-ink-900">Role</th>
                  <th className="py-3 pr-3 font-semibold text-ink-900">Inscrit le</th>
                  <th className="py-3 font-semibold text-ink-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => {
                  const isSelf = item._id === currentUser?.id;
                  const isPending = pendingUserId === item._id;

                  return (
                    <tr key={item._id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-3 text-ink-900">
                        {item.name}
                        {isSelf && <span className="ml-2 text-xs text-muted">(vous)</span>}
                      </td>
                      <td className="py-3 pr-3 text-muted">{item.email}</td>
                      <td className="py-3 pr-3">
                        <Badge variant={item.role === "admin" ? "primary" : "neutral"}>
                          {item.role === "admin" ? "Admin" : "Utilisateur"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3 text-muted">{formatDate(item.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            disabled={isSelf || isPending}
                            onClick={() => handleToggleRole(item)}
                            className="text-xs font-semibold text-brass-700 hover:text-brass-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {item.role === "admin" ? "Retrograder" : "Promouvoir admin"}
                          </button>
                          <button
                            type="button"
                            disabled={isSelf || isPending}
                            onClick={() => handleDelete(item)}
                            className="text-xs font-semibold text-red-700 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">Aucun utilisateur inscrit.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

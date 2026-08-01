"use client";

import { useCallback, useEffect, useState } from "react";
import { FormMessage, MessageBanner, inputClassName } from "@/components/dashboard/AdminFormControls";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { getApiErrorMessage } from "@/services/api";
import { createStore, deleteStore, getStores, type Store } from "@/services/stores";

const emptyStoreForm = { name: "", city: "", website: "", logo: "" };

export function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState("");

  const refreshStores = useCallback(async () => {
    try {
      const storesData = await getStores();
      setStores(storesData);
      setListsError("");
    } catch (error) {
      setListsError(getApiErrorMessage(error, "Impossible de charger les magasins."));
    }
  }, []);

  useEffect(() => {
    setListsLoading(true);
    refreshStores().finally(() => setListsLoading(false));
  }, [refreshStores]);

  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [storeSubmitting, setStoreSubmitting] = useState(false);
  const [storeMessage, setStoreMessage] = useState<FormMessage>(null);

  const handleStoreSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStoreSubmitting(true);
    setStoreMessage(null);

    try {
      await createStore(storeForm);
      setStoreMessage({ type: "success", text: "Magasin ajoute." });
      setStoreForm(emptyStoreForm);
      await refreshStores();
    } catch (error) {
      setStoreMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setStoreSubmitting(false);
    }
  };

  const handleDeleteStore = async (store: Store) => {
    if (!window.confirm(`Supprimer "${store.name}" ?`)) return;
    try {
      await deleteStore(store._id);
      await refreshStores();
    } catch (error) {
      setStoreMessage({ type: "error", text: getApiErrorMessage(error) });
    }
  };

  return (
    <section className="space-y-4">
      {listsError && <MessageBanner message={{ type: "error", text: listsError }} />}

      {listsLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader label="Chargement des magasins..." />
        </div>
      ) : (
        <Card className="max-w-xl rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            <h3 className="font-heading text-xl font-medium text-ink-950">Ajouter un magasin</h3>
            <form onSubmit={handleStoreSubmit} className="mt-4 space-y-3">
              <input
                className={inputClassName}
                placeholder="Nom du magasin"
                required
                value={storeForm.name}
                onChange={(event) => setStoreForm({ ...storeForm, name: event.target.value })}
              />
              <input
                className={inputClassName}
                placeholder="Ville"
                value={storeForm.city}
                onChange={(event) => setStoreForm({ ...storeForm, city: event.target.value })}
              />
              <input
                className={inputClassName}
                placeholder="Site web"
                value={storeForm.website}
                onChange={(event) => setStoreForm({ ...storeForm, website: event.target.value })}
              />
              <input
                className={inputClassName}
                placeholder="Logo / initiales"
                value={storeForm.logo}
                onChange={(event) => setStoreForm({ ...storeForm, logo: event.target.value })}
              />

              <MessageBanner message={storeMessage} />

              <Button type="submit" className="w-full" disabled={storeSubmitting}>
                {storeSubmitting ? "Enregistrement..." : "Ajouter un magasin"}
              </Button>
            </form>

            {stores.length > 0 && (
              <ul className="mt-5 max-h-72 space-y-2 overflow-y-auto border-t border-line pt-3">
                {stores.map((store) => (
                  <li
                    key={store._id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-paper-muted px-3 py-2 text-sm"
                  >
                    <span className="truncate text-ink-900">{store.name}</span>
                    <button
                      type="button"
                      className="shrink-0 text-xs font-semibold text-red-700 hover:text-red-600"
                      onClick={() => handleDeleteStore(store)}
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}

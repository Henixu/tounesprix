"use client";

import { useCallback, useEffect, useState } from "react";
import { FormMessage, MessageBanner, inputClassName } from "@/components/dashboard/AdminFormControls";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { getApiErrorMessage } from "@/services/api";
import { createPrice, type PricePayload } from "@/services/prices";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product,
  type ProductInput,
} from "@/services/products";
import { getStores, type Store } from "@/services/stores";

const emptyProductForm = { name: "", brand: "", category: "", description: "" };
const emptyPriceForm = { productId: "", storeId: "", price: "", date: "" };

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState("");

  const refreshLists = useCallback(async () => {
    try {
      const [productsData, storesData] = await Promise.all([getProducts(), getStores()]);
      setProducts(productsData);
      setStores(storesData);
      setListsError("");
    } catch (error) {
      setListsError(getApiErrorMessage(error, "Impossible de charger les donnees de gestion."));
    }
  }, []);

  useEffect(() => {
    setListsLoading(true);
    refreshLists().finally(() => setListsLoading(false));
  }, [refreshLists]);

  // --- Produits ---
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productMessage, setProductMessage] = useState<FormMessage>(null);

  const handleProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProductSubmitting(true);
    setProductMessage(null);

    const payload: ProductInput = {
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category,
      description: productForm.description,
      image: productImage,
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setProductMessage({ type: "success", text: "Produit mis a jour." });
      } else {
        await createProduct(payload);
        setProductMessage({ type: "success", text: "Produit ajoute." });
      }
      setProductForm(emptyProductForm);
      setProductImage(null);
      setEditingProductId(null);
      await refreshLists();
    } catch (error) {
      setProductMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
    });
    setProductImage(null);
    setProductMessage(null);
  };

  const handleCancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setProductImage(null);
    setProductMessage(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Supprimer "${product.name}" ?`)) return;
    try {
      await deleteProduct(product._id);
      if (editingProductId === product._id) handleCancelEditProduct();
      await refreshLists();
    } catch (error) {
      setProductMessage({ type: "error", text: getApiErrorMessage(error) });
    }
  };

  // --- Prix ---
  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const [priceSubmitting, setPriceSubmitting] = useState(false);
  const [priceMessage, setPriceMessage] = useState<FormMessage>(null);

  const handlePriceSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPriceSubmitting(true);
    setPriceMessage(null);

    if (!priceForm.productId || !priceForm.storeId || !priceForm.price) {
      setPriceMessage({ type: "error", text: "Produit, magasin et prix sont obligatoires." });
      setPriceSubmitting(false);
      return;
    }

    const payload: PricePayload = {
      productId: priceForm.productId,
      storeId: priceForm.storeId,
      price: Number(priceForm.price),
      date: priceForm.date || undefined,
    };

    try {
      await createPrice(payload);
      setPriceMessage({ type: "success", text: "Prix ajoute." });
      setPriceForm(emptyPriceForm);
      await refreshLists();
    } catch (error) {
      setPriceMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setPriceSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      {listsError && <MessageBanner message={{ type: "error", text: listsError }} />}

      {listsLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader label="Chargement des produits..." />
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="rounded-xl border-line bg-paper">
            <CardContent className="p-5">
              <h3 className="font-heading text-xl font-medium text-ink-950">
                {editingProductId ? "Modifier le produit" : "Ajouter un produit"}
              </h3>
              <form onSubmit={handleProductSubmit} className="mt-4 space-y-3">
                <input
                  className={inputClassName}
                  placeholder="Nom du produit"
                  required
                  value={productForm.name}
                  onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                />
                <input
                  className={inputClassName}
                  placeholder="Marque"
                  required
                  value={productForm.brand}
                  onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })}
                />
                <input
                  className={inputClassName}
                  placeholder="Categorie"
                  required
                  value={productForm.category}
                  onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                />
                <textarea
                  className={inputClassName}
                  placeholder="Description"
                  rows={2}
                  value={productForm.description}
                  onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="w-full text-sm text-ink-900"
                  onChange={(event) => setProductImage(event.target.files?.[0] ?? null)}
                />

                <MessageBanner message={productMessage} />

                <div className="flex gap-2">
                  <Button type="submit" className="w-full" disabled={productSubmitting}>
                    {productSubmitting
                      ? "Enregistrement..."
                      : editingProductId
                        ? "Mettre a jour"
                        : "Ajouter un produit"}
                  </Button>
                  {editingProductId && (
                    <Button type="button" variant="outline" onClick={handleCancelEditProduct}>
                      Annuler
                    </Button>
                  )}
                </div>
              </form>

              {products.length > 0 && (
                <ul className="mt-5 max-h-60 space-y-2 overflow-y-auto border-t border-line pt-3">
                  {products.map((product) => (
                    <li
                      key={product._id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-paper-muted px-3 py-2 text-sm"
                    >
                      <span className="truncate text-ink-900">{product.name}</span>
                      <span className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="text-xs font-semibold text-brass-700 hover:text-brass-600"
                          onClick={() => handleEditProduct(product)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold text-red-700 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          Supprimer
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-line bg-paper">
            <CardContent className="p-5">
              <h3 className="font-heading text-xl font-medium text-ink-950">Ajouter un prix</h3>
              <form onSubmit={handlePriceSubmit} className="mt-4 space-y-3">
                <select
                  className={inputClassName}
                  required
                  value={priceForm.productId}
                  onChange={(event) => setPriceForm({ ...priceForm, productId: event.target.value })}
                >
                  <option value="">Selectionner un produit</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <select
                  className={inputClassName}
                  required
                  value={priceForm.storeId}
                  onChange={(event) => setPriceForm({ ...priceForm, storeId: event.target.value })}
                >
                  <option value="">Selectionner un magasin</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClassName}
                  placeholder="Prix (TND)"
                  required
                  value={priceForm.price}
                  onChange={(event) => setPriceForm({ ...priceForm, price: event.target.value })}
                />
                <input
                  type="date"
                  className={inputClassName}
                  value={priceForm.date}
                  onChange={(event) => setPriceForm({ ...priceForm, date: event.target.value })}
                />

                <MessageBanner message={priceMessage} />

                <Button type="submit" className="w-full" disabled={priceSubmitting}>
                  {priceSubmitting ? "Enregistrement..." : "Ajouter un prix"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

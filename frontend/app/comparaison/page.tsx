"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { ProductThumbnail } from "@/components/ui/ProductThumbnail";
import { getApiErrorMessage } from "@/services/api";
import { getProducts, type Product } from "@/services/products";

type Metric = "price" | "cpu" | "ram" | "storage" | "gpu";

function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} TND`;
}

function cpuScore(cpu: string | undefined) {
  if (!cpu) return 0;
  const match = cpu.match(/(?:i|Ryzen|Core)\s*-?\s*([3579])/i);
  return match ? Number(match[1]) : 0;
}

function gpuScore(gpu: string | undefined) {
  if (!gpu) return 0;
  const match = gpu.match(/(\d{4})/);
  return match ? Number(match[1]) : 0;
}

export default function ComparaisonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader label="Chargement..." />
        </div>
      }
    >
      <ComparaisonContent />
    </Suspense>
  );
}

function ComparaisonContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([null, null, null]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Impossible de charger les produits."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const addId = searchParams.get("add");
    if (!addId) return;

    setSelectedIds((current) => {
      if (current.includes(addId)) return current;
      // The product clicked from a "Comparer" link always becomes Produit 1.
      const next = [...current];
      next[0] = addId;
      return next;
    });
  }, [searchParams]);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .filter((id): id is string => id !== null)
        .map((id) => products.find((product) => product._id === id))
        .filter((product): product is Product => Boolean(product)),
    [selectedIds, products],
  );

  const bestValueByMetric = useMemo(() => {
    const mapping: Partial<Record<Metric, string>> = {};
    if (selectedProducts.length === 0) return mapping;

    const scoreProduct = (metric: Metric, product: Product) => {
      switch (metric) {
        case "price":
          return product.bestPrice ? -product.bestPrice.price : -Infinity;
        case "cpu":
          return cpuScore(product.specifications?.cpu);
        case "ram":
          return Number(product.specifications?.ramGB) || 0;
        case "storage":
          return Number(product.specifications?.storageGB) || 0;
        case "gpu":
          return gpuScore(product.specifications?.gpu);
        default:
          return 0;
      }
    };

    (["price", "cpu", "ram", "storage", "gpu"] as Metric[]).forEach((metric) => {
      let currentBest = selectedProducts[0]._id;
      let currentScore = scoreProduct(metric, selectedProducts[0]);

      selectedProducts.forEach((product) => {
        const score = scoreProduct(metric, product);
        if (score > currentScore) {
          currentBest = product._id;
          currentScore = score;
        }
      });

      mapping[metric] = currentBest;
    });

    return mapping;
  }, [selectedProducts]);

  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-heading text-4xl font-medium text-ink-950">Comparaison</h1>
        <p className="mt-2 text-sm text-muted">Selectionnez jusqu&apos;a 3 produits pour comparer leurs specs cote a cote.</p>

        <Card className="mt-7 rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            {loading ? (
              <div className="flex min-h-[10vh] items-center justify-center">
                <Loader label="Chargement des produits..." />
              </div>
            ) : error ? (
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-3">
                {selectedIds.map((selectedId, index) => (
                  <div key={`slot-${index}`} className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">Produit {index + 1}</label>
                    <select
                      value={selectedId ?? ""}
                      onChange={(event) => {
                        const value = event.target.value || null;
                        setSelectedIds((current) => {
                          const next = [...current];
                          next[index] = value;
                          return next;
                        });
                      }}
                      className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                    >
                      <option value="">Choisir un produit</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="w-full rounded-xl border border-ink-900 bg-paper px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-950 hover:text-paper"
                      onClick={() => {
                        setSelectedIds((current) => {
                          const next = [...current];
                          next[index] = null;
                          return next;
                        });
                      }}
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {!loading && !error && (
          selectedProducts.length === 0 ? (
            <Card className="mt-6 rounded-xl border-line bg-paper">
              <CardContent className="p-8 text-center">
                <h2 className="font-heading text-2xl font-medium text-ink-950">Aucune comparaison en cours</h2>
                <p className="mt-2 text-sm text-muted">Ajoutez 2 ou 3 produits pour afficher le tableau comparatif.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
              <table className="min-w-[900px] w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper-muted">
                    <th className="px-4 py-3 text-left font-semibold text-ink-950">Attribut</th>
                    {selectedProducts.map((product) => (
                      <th key={product._id} className="px-4 py-3 text-left font-semibold text-ink-950">
                        <div className="space-y-1">
                          <p className="line-clamp-2 font-heading text-base font-medium">{product.name}</p>
                          <p className="text-xs uppercase tracking-wide text-muted">{product.brand}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-line">
                    <td className="px-4 py-3 font-semibold text-ink-900">Image</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product._id}-image`} className="px-4 py-3">
                        <ProductThumbnail image={product.image} alt={product.name} label={product.category} className="h-20 rounded-md border" />
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-line">
                    <td className="px-4 py-3 font-semibold text-ink-900">Prix</td>
                    {selectedProducts.map((product) => {
                      const isBest = bestValueByMetric.price === product._id;
                      return (
                        <td
                          key={`${product._id}-price`}
                          className={`px-4 py-3 font-mono-tab ${isBest ? "bg-brass-100 text-ink-950" : "text-ink-900"}`}
                        >
                          {product.bestPrice ? formatPrice(product.bestPrice.price) : "Aucun prix disponible"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-line">
                    <td className="px-4 py-3 font-semibold text-ink-900">Processeur</td>
                    {selectedProducts.map((product) => {
                      const isBest = bestValueByMetric.cpu === product._id;
                      return (
                        <td key={`${product._id}-cpu`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                          {product.specifications?.cpu ?? "-"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-line">
                    <td className="px-4 py-3 font-semibold text-ink-900">RAM</td>
                    {selectedProducts.map((product) => {
                      const isBest = bestValueByMetric.ram === product._id;
                      return (
                        <td key={`${product._id}-ram`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                          {product.specifications?.ramGB ? `${product.specifications.ramGB} Go` : "-"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-line">
                    <td className="px-4 py-3 font-semibold text-ink-900">Stockage</td>
                    {selectedProducts.map((product) => {
                      const isBest = bestValueByMetric.storage === product._id;
                      return (
                        <td key={`${product._id}-storage`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                          {product.specifications?.storageGB ? `${product.specifications.storageGB} Go` : "-"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-line">
                    <td className="px-4 py-3 font-semibold text-ink-900">GPU</td>
                    {selectedProducts.map((product) => {
                      const isBest = bestValueByMetric.gpu === product._id;
                      return (
                        <td key={`${product._id}-gpu`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                          {product.specifications?.gpu ?? "-"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-semibold text-ink-900">Marque</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product._id}-brand`} className="px-4 py-3 text-ink-900">
                        {product.brand}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice, getBestOffer, mockProducts } from "@/mock/catalogData";

type Metric = "price" | "processor" | "ram" | "ssd" | "gpu" | "screen";

function extractNumber(text: string) {
  const match = text.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function cpuScore(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("ultra 9") || normalized.includes("i9") || normalized.includes("ryzen 9")) return 9;
  if (normalized.includes("ultra 7") || normalized.includes("i7") || normalized.includes("ryzen 7")) return 8;
  if (normalized.includes("i5") || normalized.includes("ryzen 5") || normalized.includes("a18")) return 7;
  if (normalized.includes("snapdragon 8") || normalized.includes("m3")) return 8;
  return 5;
}

function gpuScore(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("rtx 5070")) return 10;
  if (normalized.includes("rtx 4070")) return 9;
  if (normalized.includes("rtx 4060")) return 8;
  if (normalized.includes("rtx 4050")) return 7;
  if (normalized.includes("rtx 5060")) return 8;
  if (normalized.includes("adreno")) return 6;
  if (normalized.includes("apple gpu")) return 7;
  return 5;
}

function screenScore(value: string) {
  const refreshMatch = value.toLowerCase().match(/(\d+)hz/);
  const inchesMatch = value.match(/(\d+(?:\.\d+)?)\"/);
  const refresh = refreshMatch ? Number(refreshMatch[1]) : 60;
  const inches = inchesMatch ? Number(inchesMatch[1]) : 0;
  return refresh * 10 + inches;
}

export default function ComparaisonPage() {
  const [selectedIds, setSelectedIds] = useState<(number | null)[]>([null, null, null]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const addFromQuery = new URLSearchParams(window.location.search).get("add");
    if (!addFromQuery) return;

    const parsedId = Number(addFromQuery);
    if (Number.isNaN(parsedId)) return;

    setSelectedIds((current) => {
      if (current.includes(parsedId)) return current;
      const clone = [...current];
      const freeSlot = clone.findIndex((item) => item === null);
      if (freeSlot !== -1) {
        clone[freeSlot] = parsedId;
      }
      return clone;
    });
  }, []);

  const selectedProducts = useMemo(
    () => selectedIds
      .filter((id): id is number => id !== null)
      .map((id) => mockProducts.find((product) => product.id === id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product)),
    [selectedIds],
  );

  const bestValueByMetric = useMemo(() => {
    const mapping: Partial<Record<Metric, number>> = {};

    if (selectedProducts.length === 0) return mapping;

    const scoreProduct = (metric: Metric, productId: number) => {
      const product = selectedProducts.find((item) => item.id === productId);
      if (!product) return -1;

      switch (metric) {
        case "price":
          return -getBestOffer(product).price;
        case "processor":
          return cpuScore(product.specs.processor);
        case "ram":
          return extractNumber(product.specs.ram);
        case "ssd":
          return extractNumber(product.specs.ssd);
        case "gpu":
          return gpuScore(product.specs.gpu);
        case "screen":
          return screenScore(product.specs.screen);
        default:
          return 0;
      }
    };

    (["price", "processor", "ram", "ssd", "gpu", "screen"] as Metric[]).forEach((metric) => {
      let currentBest = selectedProducts[0].id;
      let currentScore = scoreProduct(metric, currentBest);

      selectedProducts.forEach((product) => {
        const score = scoreProduct(metric, product.id);
        if (score > currentScore) {
          currentBest = product.id;
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
        <p className="mt-2 text-sm text-muted">Selectionnez jusqu'a 3 produits pour comparer leurs specs cote a cote.</p>

        <Card className="mt-7 rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {selectedIds.map((selectedId, index) => (
                <div key={`slot-${index}`} className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">Produit {index + 1}</label>
                  <select
                    value={selectedId ?? ""}
                    onChange={(event) => {
                      const value = event.target.value ? Number(event.target.value) : null;
                      setSelectedIds((current) => {
                        const next = [...current];
                        next[index] = value;
                        return next;
                      });
                    }}
                    className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                  >
                    <option value="">Choisir un produit</option>
                    {mockProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedIds((current) => {
                        const next = [...current];
                        next[index] = null;
                        return next;
                      });
                    }}
                  >
                    Retirer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedProducts.length === 0 ? (
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
                    <th key={product.id} className="px-4 py-3 text-left font-semibold text-ink-950">
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
                    <td key={`${product.id}-image`} className="px-4 py-3">
                      <div className="flex h-16 w-full items-center justify-center rounded-md border border-line bg-paper-muted text-xs uppercase tracking-wide text-muted">
                        {product.category}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">Nom</td>
                  {selectedProducts.map((product) => (
                    <td key={`${product.id}-name`} className="px-4 py-3 text-ink-900">
                      {product.name}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">Prix</td>
                  {selectedProducts.map((product) => {
                    const isBest = bestValueByMetric.price === product.id;
                    return (
                      <td
                        key={`${product.id}-price`}
                        className={`px-4 py-3 font-mono-tab ${isBest ? "bg-brass-100 text-ink-950" : "text-ink-900"}`}
                      >
                        {formatPrice(getBestOffer(product).price)}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">Processeur</td>
                  {selectedProducts.map((product) => {
                    const isBest = bestValueByMetric.processor === product.id;
                    return (
                      <td key={`${product.id}-processor`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                        {product.specs.processor}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">RAM</td>
                  {selectedProducts.map((product) => {
                    const isBest = bestValueByMetric.ram === product.id;
                    return (
                      <td key={`${product.id}-ram`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                        {product.specs.ram}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">SSD</td>
                  {selectedProducts.map((product) => {
                    const isBest = bestValueByMetric.ssd === product.id;
                    return (
                      <td key={`${product.id}-ssd`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                        {product.specs.ssd}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">GPU</td>
                  {selectedProducts.map((product) => {
                    const isBest = bestValueByMetric.gpu === product.id;
                    return (
                      <td key={`${product.id}-gpu`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                        {product.specs.gpu}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-semibold text-ink-900">Ecran</td>
                  {selectedProducts.map((product) => {
                    const isBest = bestValueByMetric.screen === product.id;
                    return (
                      <td key={`${product.id}-screen`} className={`px-4 py-3 ${isBest ? "bg-brass-100" : ""}`}>
                        {product.specs.screen}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="px-4 py-3 font-semibold text-ink-900">Marque</td>
                  {selectedProducts.map((product) => (
                    <td key={`${product.id}-brand`} className="px-4 py-3 text-ink-900">
                      {product.brand}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { getApiErrorMessage } from "@/services/api";
import { getProductById, getProducts, type Product, type ProductDetails } from "@/services/products";

function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} TND`;
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getProductById(productId)
      .then(async (data) => {
        if (cancelled) return;
        setProduct(data);

        try {
          const sameCategory = await getProducts({ category: data.category });
          if (!cancelled) {
            setSimilarProducts(sameCategory.filter((item) => item._id !== data._id).slice(0, 4));
          }
        } catch {
          if (!cancelled) setSimilarProducts([]);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Produit introuvable."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
        <Loader label="Chargement du produit..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-line bg-paper p-8 text-center">
          <h1 className="font-heading text-3xl font-medium text-ink-950">Produit introuvable</h1>
          <p className="mt-3 text-sm text-muted">{error || "Ce produit n'existe pas."}</p>
          <Link href="/catalogue" className="mt-5 inline-flex">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
  const bestPrice = sortedPrices[0]?.price;
  const specs = Object.entries(product.specifications ?? {});

  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="overflow-hidden rounded-xl border-line bg-paper">
            <div className="flex h-72 items-center justify-center border-b border-line bg-paper-muted text-xs uppercase tracking-wide text-muted">
              {product.category}
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neutral">{product.brand}</Badge>
                <Badge variant="accent">{product.category}</Badge>
              </div>
              <h1 className="mt-4 font-heading text-3xl font-medium text-ink-950">{product.name}</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

              <div className="mt-6">
                <Link href={`/comparaison?add=${product._id}`}>
                  <Button>Ajouter a la comparaison</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-line bg-paper">
            <CardContent className="p-6">
              <h2 className="font-heading text-2xl font-medium text-ink-950">Caracteristiques</h2>
              {specs.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Aucune caracteristique renseignee.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      {specs.map(([label, value]) => (
                        <tr key={label} className="border-b border-line last:border-0">
                          <td className="py-3 pr-3 font-semibold capitalize text-ink-900">{label}</td>
                          <td className="py-3 text-muted">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-6">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Comparatif des prix</h2>
            {sortedPrices.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Aucun prix disponible pour ce produit.</p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line text-left">
                      <th className="py-3 pr-3 font-semibold text-ink-900">Magasin</th>
                      <th className="py-3 pr-3 font-semibold text-ink-900">Ville</th>
                      <th className="py-3 pr-3 font-semibold text-ink-900">Prix</th>
                      <th className="py-3 font-semibold text-ink-900">Lien</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPrices.map((entry) => (
                      <tr key={entry._id} className="border-b border-line last:border-0">
                        <td className="py-3 pr-3 text-ink-900">{entry.storeId?.name ?? "-"}</td>
                        <td className="py-3 pr-3 text-muted">{entry.storeId?.city ?? "-"}</td>
                        <td className="py-3 pr-3">
                          <span className="font-mono-tab text-ink-950">{formatPrice(entry.price)}</span>
                          {entry.price === bestPrice && (
                            <Badge variant="primary" className="ml-2">
                              Meilleur prix
                            </Badge>
                          )}
                        </td>
                        <td className="py-3">
                          {entry.storeId?.website ? (
                            <a
                              href={entry.storeId.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-brass-700 hover:text-brass-600"
                            >
                              Voir sur le site
                            </a>
                          ) : (
                            <span className="text-sm text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {similarProducts.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-medium text-ink-950">Produits similaires</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <Card key={item._id} className="rounded-xl border-line bg-paper">
                  <CardContent className="p-4">
                    <p className="line-clamp-2 min-h-10 text-sm font-semibold text-ink-950">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted">{item.brand}</p>
                    {item.bestPrice && (
                      <p className="mt-3 font-mono-tab text-lg text-ink-950">{formatPrice(item.bestPrice.price)}</p>
                    )}
                    <Link href={`/produits/${item._id}`} className="mt-3 inline-flex w-full">
                      <Button variant="outline" className="w-full rounded-md">
                        Voir details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

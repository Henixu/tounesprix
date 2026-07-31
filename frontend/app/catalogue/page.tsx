"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { useDebounce } from "@/hooks/useDebounce";
import { getApiErrorMessage } from "@/services/api";
import { getProducts, type Product } from "@/services/products";

const PAGE_SIZE = 6;

function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} TND`;
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader label="Chargement du catalogue..." />
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}

function CatalogueContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1") || 1);

  const debouncedSearch = useDebounce(search, 400);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((allProducts) => {
        if (cancelled) return;
        setAvailableCategories(Array.from(new Set(allProducts.map((item) => item.category))).sort());
        setAvailableBrands(Array.from(new Set(allProducts.map((item) => item.brand))).sort());
      })
      .catch(() => {
        // les options de filtre restent vides si l'appel initial echoue
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category !== "all") params.set("category", category);
    if (brand !== "all") params.set("brand", brand);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (page > 1) params.set("page", String(page));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [debouncedSearch, category, brand, minPrice, maxPrice, page, pathname, router]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getProducts({
      search: debouncedSearch || undefined,
      category: category !== "all" ? category : undefined,
      brand: brand !== "all" ? brand : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Impossible de charger le catalogue."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, brand, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  const currentPageProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-heading text-4xl font-medium text-ink-950">Catalogue produits</h1>
        <p className="mt-2 text-sm text-muted">
          Comparez les meilleures offres de PC portables, smartphones et composants en Tunisie.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-xl border border-line bg-paper p-5">
            <h2 className="font-heading text-xl font-medium text-ink-950">Filtres</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Recherche</label>
                <Input
                  value={search}
                  onChange={(event) => updateFilter(setSearch)(event.target.value)}
                  placeholder="Nom, marque ou categorie"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Categorie</label>
                <select
                  value={category}
                  onChange={(event) => updateFilter(setCategory)(event.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                >
                  <option value="all">Toutes les categories</option>
                  {availableCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Marque</label>
                <select
                  value={brand}
                  onChange={(event) => updateFilter(setBrand)(event.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                >
                  <option value="all">Toutes les marques</option>
                  {availableBrands.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Prix minimum (TND)</label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(event) => updateFilter(setMinPrice)(event.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Prix maximum (TND)</label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(event) => updateFilter(setMaxPrice)(event.target.value)}
                  placeholder="7000"
                />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setBrand("all");
                  setMinPrice("");
                  setMaxPrice("");
                  setPage(1);
                }}
              >
                Reinitialiser
              </Button>
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader label="Chargement du catalogue..." />
              </div>
            ) : error ? (
              <Card className="rounded-xl border-line bg-paper">
                <CardContent className="p-8 text-center">
                  <h3 className="font-heading text-2xl font-medium text-ink-950">Erreur</h3>
                  <p className="mt-2 text-sm text-muted">{error}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted">
                    {products.length} resultat{products.length > 1 ? "s" : ""}
                  </p>
                  <Badge variant="neutral">Page {page} / {totalPages}</Badge>
                </div>

                {products.length === 0 ? (
                  <Card className="rounded-xl border-line bg-paper">
                    <CardContent className="p-8 text-center">
                      <h3 className="font-heading text-2xl font-medium text-ink-950">Aucun resultat</h3>
                      <p className="mt-2 text-sm text-muted">
                        Aucun produit ne correspond a vos filtres. Essayez d'elargir votre recherche.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {currentPageProducts.map((product) => (
                        <Card key={product._id} className="overflow-hidden rounded-xl border-line bg-paper">
                          <div className="flex h-40 items-center justify-center border-b border-line bg-paper-muted text-xs uppercase tracking-wide text-muted">
                            {product.category}
                          </div>
                          <CardContent className="p-5">
                            <p className="line-clamp-2 min-h-10 text-sm font-semibold text-ink-950">{product.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-wide text-muted">{product.brand}</p>

                            {product.bestPrice ? (
                              <>
                                <div className="price-ticket mt-3">
                                  <span className="stamp" />
                                  <p className="font-mono-tab text-lg font-semibold text-ink-950">
                                    {formatPrice(product.bestPrice.price)}
                                  </p>
                                </div>
                                <p className="mt-1 text-xs text-brass-700">
                                  Meilleur prix chez {product.bestPrice.storeId?.name ?? "un magasin"}
                                </p>
                              </>
                            ) : (
                              <p className="mt-3 text-xs text-muted">Aucun prix disponible</p>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <Link href={`/produits/${product._id}`}>
                                <Button variant="outline" className="w-full rounded-md">
                                  Voir details
                                </Button>
                              </Link>
                              <Link href={`/comparaison?add=${product._id}`}>
                                <Button className="w-full rounded-md">Comparer</Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                      >
                        Precedent
                      </Button>

                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                            pageNumber === page
                              ? "border-ink-950 bg-ink-950 text-paper"
                              : "border-line bg-paper text-ink-900 hover:border-brass-500"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <Button
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                      >
                        Suivant
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

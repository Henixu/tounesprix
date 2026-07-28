"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  allBrands,
  allCategories,
  formatPrice,
  getBestOffer,
  mockProducts,
} from "@/mock/catalogData";

const PAGE_SIZE = 6;

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const min = minPrice ? Number(minPrice) : Number.NEGATIVE_INFINITY;
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;
    const query = search.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const bestOffer = getBestOffer(product);
      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory = category === "all" || product.category === category;
      const matchesBrand = brand === "all" || product.brand === brand;
      const matchesPrice = bestOffer.price >= min && bestOffer.price <= max;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [search, category, brand, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const currentPageProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Nom, marque ou categorie"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Categorie</label>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                >
                  <option value="all">Toutes les categories</option>
                  {allCategories.map((item) => (
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
                  onChange={(event) => {
                    setBrand(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                >
                  <option value="all">Toutes les marques</option>
                  {allBrands.map((item) => (
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
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Prix maximum (TND)</label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setPage(1);
                  }}
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
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">
                {filteredProducts.length} resultat{filteredProducts.length > 1 ? "s" : ""}
              </p>
              <Badge variant="neutral">Page {page} / {totalPages}</Badge>
            </div>

            {filteredProducts.length === 0 ? (
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
                  {currentPageProducts.map((product) => {
                    const bestOffer = getBestOffer(product);
                    return (
                      <Card key={product.id} className="overflow-hidden rounded-xl border-line bg-paper">
                        <div className="flex h-40 items-center justify-center border-b border-line bg-paper-muted text-xs uppercase tracking-wide text-muted">
                          {product.category}
                        </div>
                        <CardContent className="p-5">
                          <p className="line-clamp-2 min-h-10 text-sm font-semibold text-ink-950">{product.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-muted">{product.brand}</p>

                          <div className="price-ticket mt-3">
                            <span className="stamp" />
                            <p className="font-mono-tab text-lg font-semibold text-ink-950">{formatPrice(bestOffer.price)}</p>
                          </div>

                          <p className="mt-1 text-xs text-brass-700">Meilleur prix chez {bestOffer.store}</p>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link href={`/produits/${product.id}`}>
                              <Button variant="outline" className="w-full rounded-md">
                                Voir details
                              </Button>
                            </Link>
                            <Link href={`/comparaison?add=${product.id}`}>
                              <Button className="w-full rounded-md">Comparer</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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
          </section>
        </div>
      </div>
    </div>
  );
}

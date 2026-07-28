import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { categories, featuredProducts } from "@/mock/products";

export default function Home() {
  return (
    <div className="pb-20">
      <section className="hero-ledger px-4 pb-24 pt-20 sm:px-8">
        <div className="relative mx-auto max-w-6xl">
          <Badge variant="primary" className="mb-6 border-brass-500/40 bg-transparent text-brass-300">
            Comparateur — Tunisie
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-medium italic leading-[1.1] text-paper md:text-6xl">
            Le juste prix du materiel informatique en Tunisie
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-muted/80 md:text-lg">
            Un releve clair des prix pratiques par les principales boutiques tech du pays, mis a jour en continu.
          </p>
          <div className="mt-9 flex max-w-2xl flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-2 sm:flex-row">
            <Input
              placeholder="Rechercher un produit, une marque ou une categorie"
              className="h-12 border-0 bg-paper text-ink-950"
            />
            <Button className="h-12 rounded-lg bg-brass-600 px-6 font-semibold text-ink-950 hover:bg-brass-500">
              Comparer
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between border-b border-line pb-4">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Categories</h2>
            <Link href="/catalogue" className="text-sm font-semibold text-brass-600 hover:text-brass-700">
              Tout le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category: string) => (
              <Link key={category} href="/catalogue" className="group">
                <Card className="h-full rounded-lg border-line bg-paper transition-colors duration-150 group-hover:border-brass-500">
                  <CardContent className="p-4 text-center">
                    <p className="font-medium text-ink-800">{category}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 border-b border-line pb-4">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Produits en vedette</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-lg border-line bg-paper">
                <div className="flex h-36 items-center justify-center border-b border-line bg-paper-muted text-xs font-medium uppercase tracking-wide text-muted">
                  Image
                </div>
                <CardContent className="space-y-1 p-5">
                  <p className="line-clamp-2 min-h-10 text-sm font-semibold text-ink-950">{product.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">{product.brand}</p>

                  <div className="price-ticket">
                    <span className="stamp" />
                    <p className="font-mono-tab text-lg font-semibold text-ink-950">{product.lowestPrice}</p>
                    <span className="ml-auto text-[11px] uppercase tracking-wide text-brass-600">{product.store}</span>
                  </div>

                  <Button variant="outline" className="mt-3 w-full rounded-md border-ink-900 text-ink-900 hover:bg-ink-950 hover:text-paper">
                    Comparer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-line bg-paper p-8">
          <h2 className="mb-8 font-heading text-2xl font-medium text-ink-950">Comment ca marche</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Rechercher",
                description: "Tapez un produit, une marque ou une gamme pour afficher les offres disponibles.",
              },
              {
                title: "Comparer",
                description: "Visualisez les prix, les boutiques et les caracteristiques essentielles en un coup d'oeil.",
              },
              {
                title: "Economiser",
                description: "Choisissez l'offre la plus avantageuse selon votre budget et vos priorites.",
              },
            ].map((step, i) => (
              <div key={step.title} className="border-l-2 border-brass-500 pl-4">
                <p className="font-mono-tab text-xs text-brass-600">0{i + 1}</p>
                <p className="mt-1 font-heading text-lg font-medium text-ink-950">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
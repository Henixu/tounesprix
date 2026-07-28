import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { categories, featuredProducts } from "@/mock/products";

export default function Home() {
  return (
    <div className="pb-16">
      <section className="hero-sheen px-4 pb-20 pt-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Badge variant="primary" className="mb-6">
            Comparateur 100% Tunisie
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">
            Comparez les prix du materiel informatique en Tunisie
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
            Trouvez rapidement les meilleures offres parmi les principales boutiques tech tunisiennes.
          </p>
          <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm sm:flex-row">
            <Input
              placeholder="Rechercher un produit, une marque ou une categorie"
              className="h-12 border-white/20 bg-white/95"
            />
            <Button className="h-12 px-6">Lancer la recherche</Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-semibold text-slate-900">Categories populaires</h2>
            <Link href="/catalogue" className="text-sm font-semibold text-brand-700 hover:text-brand-600">
              Voir tout le catalogue
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category: string) => (
              <Link key={category} href="/catalogue" className="group">
                <Card className="h-full border-slate-200 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl">
                  <CardContent className="p-4 text-center">
                    <p className="font-medium text-slate-800">{category}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-slate-900">Produits en vedette</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-slate-200">
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500">
                  Image placeholder
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="space-y-1">
                    <p className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.brand}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-accent-600">{product.lowestPrice}</p>
                    <Badge variant="neutral">{product.store}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Comparer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-7 font-heading text-2xl font-semibold text-slate-900">Comment ca marche ?</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "1. Recherchez",
                description: "Tapez un produit, une marque ou une gamme pour afficher les offres disponibles.",
              },
              {
                title: "2. Comparez",
                description: "Visualisez les prix, les boutiques et les caracteristiques essentielles en un coup d'oeil.",
              },
              {
                title: "3. Economisez",
                description: "Choisissez l'offre la plus avantageuse selon votre budget et vos priorites.",
              },
            ].map((step) => (
              <Card key={step.title} className="border-slate-200 bg-slate-50">
                <CardContent className="p-5">
                  <p className="font-heading text-lg font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

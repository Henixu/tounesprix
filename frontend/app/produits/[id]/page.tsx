import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  formatPrice,
  getBestOffer,
  getProductById,
  getSimilarProducts,
} from "@/mock/catalogData";

type ProductDetailsPageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = Number(params.id);
  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-line bg-paper p-8 text-center">
          <h1 className="font-heading text-3xl font-medium text-ink-950">Produit introuvable</h1>
          <p className="mt-3 text-sm text-muted">Le produit que vous cherchez n'existe pas dans le mock actuel.</p>
          <Link href="/catalogue" className="mt-5 inline-flex">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
  const bestPrice = getBestOffer(product).price;
  const similarProducts = getSimilarProducts(product.id, 4);

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
                <Link href={`/comparaison?add=${product.id}`}>
                  <Button>Ajouter a la comparaison</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-line bg-paper">
            <CardContent className="p-6">
              <h2 className="font-heading text-2xl font-medium text-ink-950">Caracteristiques</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {[
                      ["Processeur", product.specs.processor],
                      ["RAM", product.specs.ram],
                      ["SSD", product.specs.ssd],
                      ["GPU", product.specs.gpu],
                      ["Ecran", product.specs.screen],
                    ].map(([label, value]) => (
                      <tr key={label} className="border-b border-line last:border-0">
                        <td className="py-3 pr-3 font-semibold text-ink-900">{label}</td>
                        <td className="py-3 text-muted">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-6">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Comparatif des prix</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-3 pr-3 font-semibold text-ink-900">Magasin</th>
                    <th className="py-3 pr-3 font-semibold text-ink-900">Logo</th>
                    <th className="py-3 pr-3 font-semibold text-ink-900">Prix</th>
                    <th className="py-3 font-semibold text-ink-900">Lien</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOffers.map((offer) => (
                    <tr key={`${offer.store}-${offer.price}`} className="border-b border-line last:border-0">
                      <td className="py-3 pr-3 text-ink-900">{offer.store}</td>
                      <td className="py-3 pr-3">
                        <span className="inline-flex rounded-md bg-paper-muted px-2 py-1 font-mono-tab text-xs text-ink-900">
                          {offer.logo}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="font-mono-tab text-ink-950">{formatPrice(offer.price)}</span>
                        {offer.price === bestPrice && (
                          <Badge variant="primary" className="ml-2">
                            Meilleur prix
                          </Badge>
                        )}
                      </td>
                      <td className="py-3">
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-brass-700 hover:text-brass-600"
                        >
                          Voir sur le site
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="font-heading text-2xl font-medium text-ink-950">Produits similaires</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((item) => {
              const offer = getBestOffer(item);
              return (
                <Card key={item.id} className="rounded-xl border-line bg-paper">
                  <CardContent className="p-4">
                    <p className="line-clamp-2 min-h-10 text-sm font-semibold text-ink-950">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted">{item.brand}</p>
                    <p className="mt-3 font-mono-tab text-lg text-ink-950">{formatPrice(offer.price)}</p>
                    <Link href={`/produits/${item.id}`} className="mt-3 inline-flex w-full">
                      <Button variant="outline" className="w-full rounded-md">
                        Voir details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

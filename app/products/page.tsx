import { ProductCard } from "@/components/ProductCard";
import { SAMPLE_PRODUCTS } from "@/lib/products";

export default function ProductsPage() {
  return (
    <section>
      <h1>Products</h1>
      <p className="muted">Fresh picks from nearby local businesses.</p>
      <div className="grid">
        {SAMPLE_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function DiscountBadge({ discountPercent }: { discountPercent: number }) {
  return <span className="discount-badge">Save {discountPercent}%</span>;
}

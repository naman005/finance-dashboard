export function formatAmount(v) {
  if (v>=100000) return `₹${(v/100000).toFixed(2)}L`;
  if (v>=1000)   return `₹${(v/1000).toFixed(1)}K`;
  return `₹${v.toLocaleString("en-IN")}`;
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

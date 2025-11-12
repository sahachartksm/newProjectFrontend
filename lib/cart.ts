// lib/cart.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}

const KEY = "cart";

function safeGet(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getCart(): CartItem[] {
  return safeGet();
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const cur = safeGet();
  const i = cur.findIndex((x) => x.id === item.id);
  if (i >= 0) cur[i].qty += qty;
  else cur.push({ ...item, qty });
  save(cur);
}

export function updateQty(id: number, qty: number) {
  const cur = safeGet().map((x) => (x.id === id ? { ...x, qty } : x));
  save(cur.filter((x) => x.qty > 0));
}

export function removeItem(id: number) {
  save(safeGet().filter((x) => x.id !== id));
}

export function clearCart() {
  save([]);
}

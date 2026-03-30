import { create } from "zustand";

const calcTotal = (items) =>
  items.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    return sum + quantity * price;
  }, 0);

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const current = get().items;
    const existing = current.find((item) => item.productId === product._id);

    let next;
    if (existing) {
      next = current.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      next = [
        ...current,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }

    set({ items: next });
  },
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  increase: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),
  decrease: (productId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0),
    })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => calcTotal(get().items),
  totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

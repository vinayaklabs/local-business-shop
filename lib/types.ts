export type Theme = "light" | "dark";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Account = {
  fullName: string;
  email: string;
  password: string;
};

export type DeliveryInfo = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
};

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  delivery: DeliveryInfo;
};

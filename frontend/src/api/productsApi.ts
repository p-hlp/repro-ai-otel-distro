import { axiosInstance } from "../lib/axios";

interface Product {
  id?: string;
  name: string;
}

export const productsApi = () => {
  const api = {
    get: async () => {
      const response = await axiosInstance.get<Product[]>("/products");
      return response.data;
    },
    post: async (product: Product) => {
      const response = await axiosInstance.post<string>("/products", product);
      return response.data;
    },
    delete: async (id: string) => {
      await axiosInstance.delete(`/products/${id}`);
    },
  };
  return api;
};

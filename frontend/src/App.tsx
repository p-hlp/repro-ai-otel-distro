import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productsApi } from "./api/productsApi";

export const App = () => {
  const api = productsApi();
  const [newProductName, setNewProductName] = useState("");

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: api.get,
  });

  const addQueryMutation = useMutation({
    mutationFn: api.post,
    onSuccess: () => {
      refetch();
    },
  });

  const deleteQueryMutation = useMutation({
    mutationFn: api.delete,
    onSuccess: () => {
      refetch();
    },
  });

  const handleAddProduct = async () => {
    if (!newProductName) return;
    await addQueryMutation.mutateAsync({ name: newProductName });
    setNewProductName("");
  };

  const handleDeleteProduct = async (id: string | undefined) => {
    if (!id) return;
    await deleteQueryMutation.mutateAsync(id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Name"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add</button>
      </div>
      {isLoading && products && <div>Loading...</div>}
      {!isLoading && products && (
        <ul style={{ maxWidth: "300px", listStyleType: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>{product.name}</span>
              <button onClick={() => handleDeleteProduct(product.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

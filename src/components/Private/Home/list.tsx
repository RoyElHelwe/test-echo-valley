"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
}
interface History {
  userId: string;
  searchTerm: string;
  timestamp: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const productIds = useRef<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/history");
        setHistory(response.data.map((h: History) => h.searchTerm));
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm && searchTerm.length > 0) {
      try {
        const response = await axios.post("/api/search", { searchTerm });
        setProducts(response.data.products);
        setHasSearched(true);
        setHistory((prevHistory) =>
          prevHistory.includes(searchTerm)
            ? prevHistory
            : [...prevHistory, searchTerm]
        );
      } catch (err) {
        console.error("Error searching products:", err);
      }
    } else {
      setHasSearched(false);
      setPage(1);
    }
  };
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products?page=${page}&limit=10`);

      const fetchedProducts = response.data.data;

      if (fetchedProducts.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const newProducts = fetchedProducts.filter(
        (product: Product) => !productIds.current.has(product.id)
      );

      newProducts.forEach((product: Product) =>
        productIds.current.add(product.id)
      );

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setHasMore(response.data.currentPage < response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching products:", err);
    }
  }, [page]);

  useEffect(() => {
    if (!hasSearched) {
      fetchProducts();
    }
  }, [page, fetchProducts, hasSearched]);

  // Infinite scroll observer
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <h1>Product List</h1>
      <form onSubmit={handleSearch}>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          list="history-suggestions"
          placeholder="Search for a product..."
        />
        <button type="submit">Search</button>

        <datalist id="history-suggestions">
          {history.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      </form>
      {products.length === 0 && !loading ? (
        <p>No products available.</p>
      ) : (
        <ul className="flex items-center gap-4 flex-wrap">
          {products.map((product, index) => {
            if (products.length === index + 1) {
              return (
                <Card
                  ref={lastProductRef}
                  key={product.id}
                  className="w-[200px]"
                >
                  <CardHeader>{product.name}</CardHeader>
                  <CardContent>
                    <p>{product.description}</p>
                    <p>Price: ${product?.price?.toFixed(2)}</p>
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <Card key={product.id} className="w-[200px]">
                  <CardHeader>{product.name}</CardHeader>
                  <CardContent>
                    <p>{product.description}</p>
                    <p>Price: ${product?.price?.toFixed(2)}</p>
                  </CardContent>
                </Card>
              );
            }
          })}
        </ul>
      )}
      {loading && <p>Loading more products...</p>}
    </div>
  );
};

export default ProductPage;

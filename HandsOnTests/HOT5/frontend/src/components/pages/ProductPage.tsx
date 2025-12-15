import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
};

function ProductPage() {
  const { id } = useParams<{ id?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let response;
        const url = id
          ? `http://localhost:2023/api/products/${id}`
          : "http://localhost:2023/api/products";

        response = await fetch(url, { credentials: "include" });

        const text = await response.text();
        console.log("API response:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("API did not return valid JSON");
        }

        let productsArray: Product[] = [];

        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data.products) {
          productsArray = data.products;
        } else if (data._id) {
          productsArray = [data];
        } else {
          throw new Error("Invalid product data structure");
        }

        setProducts(productsArray);
      } catch (err) {
        console.error("Error fetching product(s):", err);
        setError((err as Error).message || "Failed to fetch product(s)");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [id]);

  if (loading) return <div className="flex justify-center py-10">Loading products...</div>;
  if (error) return <div className="flex justify-center py-10 text-red-600">{error}</div>;
  if (products.length === 0) return <div className="flex justify-center py-10">No products found.</div>;

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-5xl shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            {id ? "Product Details" : "Product List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-gray-100 transition-colors">
                    <TableCell className="py-2 px-4 text-sm text-blue-600">
                      <Link
                        to={`/products/${product._id}`}
                        className="block w-full h-full hover:underline"
                      >
                        {product._id}
                      </Link>
                    </TableCell>
                    <TableCell className="py-2 px-4 font-medium">{product.name}</TableCell>
                    <TableCell className="py-2 px-4">${product.price}</TableCell>
                    <TableCell className="py-2 px-4">{product.category}</TableCell>
                    <TableCell className="py-2 px-4">
                      <img
                        src="/gear-svgrepo-com.svg"
                        className="w-5 h-5 opacity-70 hover:opacity-100"
                        alt="settings"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductPage;

import { useEffect, useState } from "react";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:2023/api/products", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract the products array from the paginated response
        const productsArray = data.products ?? [];

        // Optional: normalize fields to prevent missing data
        const normalizedProducts = productsArray.map((p: any) => ({
          _id: p._id,
          name: p.name ?? "",
          price: p.price ?? 0,
          category: p.category ?? "",
        }));

        setProducts(normalizedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-5xl shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Product List
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
                  <TableRow
                    key={product._id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <TableCell className="text-sm text-gray-700">
                      {product._id}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
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

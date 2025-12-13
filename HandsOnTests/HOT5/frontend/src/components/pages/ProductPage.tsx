//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function ProductPage() {

    const products = [
        { id: 1, name: "Laptop", price: "$999", category: "Electronics" },
        { id: 2, name: "Coffee Mug", price: "$12", category: "Kitchen" },
        { id: 3, name: "Gaming Chair", price: "$199", category: "Furniture" }
    ]

    return (
        <div className="flex justify-center">
        <Card className="w-1/2 p-4">
            <CardHeader>
                <CardTitle>Product List</CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    <img 
                                        className="w-5 h-5"
                                        src="/gear-svgrepo-com.svg" 
                                        alt="" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
    )
}

export default ProductPage;

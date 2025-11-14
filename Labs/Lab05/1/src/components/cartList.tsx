import { useState } from "react";
import { nanoid } from "nanoid";
import type { Item } from "../types/itemType";
import { ItemNameInput } from "./buttons";
import { QuantityButton } from "./buttons";

export default function CartList() {
  const [items, setItems] = useState<Item[]>([
    { id: nanoid(), name: "Hat", quantity: 2 },
    { id: nanoid(), name: "Shirt", quantity: 3 },
  ]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handlers
  const handleNameChange = (item: Item, newName: string) => {
    setItems(items.map(i => i.id === item.id ? { ...i, name: newName } : i));
  };

  const handleAddQuantity = (item: Item) => {
    setItems(items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const handleSubtractQuantity = (item: Item) => {
    setItems(items.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i));
  };

  return (
    <div className="container bg-black text-white border pt-1">
      <div className="relative m-5">
        <h1 className="text-4xl underline">My Shopping Cart</h1>
        <div className="absolute top-0 right-0 flex items-start">
          <img src="/shoppingCart.svg" alt="Shopping cart" className="w-16 h-16" />
          <span className="bg-white text-black px-3 mt-3 scale-58 py-1 rounded text-sm font-semibold -ml-10">
            {itemCount}
          </span>
        </div>
      </div>

      {items.map(item => (
        <div className="grid grid-cols-4 gap-2 border rounded-2xl m-5 p-2 items-center" key={item.id}>
          <ItemNameInput item={item} onChange={handleNameChange} />
          <QuantityButton item={item} onAdd={handleAddQuantity} onSubtract={handleSubtractQuantity} />
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { nanoid } from 'nanoid';

function CartItem({ item, onNameChange, onAddQuantity, onSubtractQuantity }) {
  return (
    <div className="bg-white rounded p-4 mb-4 border border-gray-300">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            className={`w-full px-4 py-2 rounded border ${
              item.name.length > 0
                ? 'border-gray-400'
                : 'border-gray-300 bg-gray-50'
            }`}
            value={item.name}
            onChange={(evt) => onNameChange(evt, item)}
            placeholder="Enter item name..."
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-black text-white px-4 py-2 rounded font-bold min-w-[60px] text-center">
            {item.quantity}
          </div>
          
          <button
            className="w-10 h-10 bg-red-600 rounded-full border-2 border-black text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => onSubtractQuantity(item)}
            disabled={item.quantity <= 0}
          >
            −
          </button>
          
          <button
            className="w-10 h-10 rounded-full bg-green-600 border border-black font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => onAddQuantity(item)}
            disabled={item.quantity >= 10}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function CartList() {
  const [items, setItems] = useState([
    { id: nanoid(), name: 'Hat', quantity: 2 },
    { id: nanoid(), name: 'Tie', quantity: 2 },
    { id: nanoid(), name: 'Belt', quantity: 1 }
  ]);

  console.log('Cart List component rendered');

  // Calculate total item count
  let itemCount = 0;
  for (const item of items) {
    if (item && item.quantity) {
      itemCount += item.quantity;
    }
  }

  // Handle name change
  const onNameChange = (evt, item) => {
    const newItems = [...items];
    const index = items.indexOf(item);
    newItems[index].name = evt.target.value;
    setItems(newItems);
  };

  // Handle add quantity
  const onAddQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= 10) {
      const newItems = [...items];
      const index = items.indexOf(item);
      newItems[index].quantity = newQuantity;
      setItems(newItems);
    }
  };

  // Handle subtract quantity
  const onSubtractQuantity = (item) => {
    const newQuantity = item.quantity - 1;
    if (newQuantity > 0) {
      const newItems = [...items];
      const index = items.indexOf(item);
      newItems[index].quantity = newQuantity;
      setItems(newItems);
    } else {
      // Remove item when quantity reaches 0
      setItems(items.filter((i) => i.id !== item.id));
    }
  };

  // Handle add item
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: nanoid(), name: '', quantity: 1 }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded p-8 mb-6 border border-black">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-300">
            <h1 className="text-3xl font-bold text-black">
              Shopping Cart
            </h1>
            
            {itemCount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Total Items:</span>
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                  {itemCount}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Please add items to cart</span>
            )}
          </div>

          {items.length === 0 && (
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded mb-6">
              <div className="flex items-center">
                <div className="text-4xl mr-4">🛒</div>
                <div>
                  <p className="font-semibold text-gray-800">Your cart is empty!</p>
                  <p className="text-gray-700">Add some items to get started.</p>
                </div>
              </div>
            </div>
          )}

          <div>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onNameChange={onNameChange}
                onAddQuantity={onAddQuantity}
                onSubtractQuantity={onSubtractQuantity}
              />
            ))}
          </div>

          <button
            type="button"
            className="mt-6 w-full bg-black text-white font-bold py-3 px-6 rounded"
            onClick={handleAddItem}
          >
            + Add New Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <CartList />;
}
import type React from "react";
import {useState} from 'react';
import { nanoid } from "nanoid";
export default function CartList(){
    console.log('CartList component rendered')
    const [items, setItems] = useState([
        {id:nanoid(), name:'Hat', quantity: 2},
        {id:nanoid(), name: 'shirt', quantity:3}
    ]);
    let itemCount = 0;
    for (const item of items){
        if(item && item.quantity){
            itemCount += item.quantity;
        }
    }
    function onNameChange(evt: any, item: any ){
        const newItems = [...items];
        const index = items.indexOf(item);
        newItems[index].name = evt.target.value;
        setItems(newItems);
    };
    function onSubtractQuantity(evt, item){
        const newItems = [...items];
        const index = items.indexOf(item);
        newItems[index].quantity--;
        setItems(newItems)

    }
    function onAddQuantity(evt, item){
        const newItems = [...items];
        const index = items.indexOf(item);
        newItems[index].quantity++;
        setItems(newItems)
    }
    return(
        <>
        <div className="container bg-black text-white pb-47 border pt-1">
            <h1 className="m-5 text-4xl text-blue-600 underline">Shopping Cart</h1>
            <h5 className="w-6.5 bg-blue-600 text-white m-5 border border-black rounded-full text-center">{itemCount}</h5>
            <img src="/shoppingCart.svg" alt="Shopping cart" className="scale-10 -ms-72.5 -mb-78 -mt-82.5"/>
            {items.map(item => 
                <div className="grid grid-cols-4 gap-2 border rounded-2xl m-5" key={item.id}>
                    <div className="">
                        <input type="text" className="ml-5 w-20 m-0.5" value={item.name} onChange={(evt) => onNameChange(evt, item)}/>
                    </div>
                    <div className="">
                        <span>{item.quantity}</span>
                    </div>
                    <div className="border-2 bg-green-600 w-10 border-black rounded-full text-center">
                        <button onClick={(evt)=> onAddQuantity(evt, item)}>+</button>
                    </div>
                    <div className="border-2 bg-red-600 w-7 border-black rounded-full text-center">
                        <button onClick={(evt)=> onSubtractQuantity(evt, item)}>-</button>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}
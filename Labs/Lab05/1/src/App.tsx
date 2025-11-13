import './App.css'
import CartList from "./components/cartList.tsx"
function App() {
  //the useEffect hook is used to load data from the api
  return (
    <>
    <div className='min-h-screen bg-black text-white '>
      <div className='lg:mx-120 scale-150 pt-40'>
        <CartList/>
      </div>
    </div>
    </>
  )
}

export default App

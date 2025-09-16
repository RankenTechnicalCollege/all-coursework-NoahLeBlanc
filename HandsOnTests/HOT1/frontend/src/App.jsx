import './App.css'

function App() {

  return (
    <>
      <header>
        <h1>Hot1</h1>
      </header>
      <main>
        
        <div>
          <input type="number" name="milesDriven" id="milesDriven" />
          <input type="number" name="gallonsUsed" id="gallonsUsed" />
        </div>

        <div>
          <input type="radio" name="single" id="single" />
          <input type="radio" name="married" id="married" />
          <input type="number" name="taxableIncome" id="taxableIncome" />
        </div>

        <div>
          <input type="radio" name="CtoF" id="CtoF" />
          <input type="radio" name="FtoC" id="FtoC" />
          <input type="number" name="temp" id="temp" />
        </div>

        <div>
          <input type="number" name="principle" id="principle" />
          <input type="number" name="interestRate" id="interestRate" />
          <input type="number" name="years" id="years" />
        </div>

      </main>
      <footer>
        <h3>Ⓒ Niah LeBlanc</h3>
      </footer>
    </>
  )
}

export default App

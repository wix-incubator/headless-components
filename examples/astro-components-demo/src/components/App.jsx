import "./App.css";
import MySort from "./MySort";
import MyFilter from "./MyFilter";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Headless Components Demo</h1>
        <p>Demonstrating the different available components</p>
      </header>
      <main>
        <MySort />
        <MyFilter />
      </main>
    </div>
  );
}

export default App;

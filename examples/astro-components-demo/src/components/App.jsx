import logo from "../assets/logo.svg";
import "./App.css";
import { Bookings } from "@wix/headless-bookings/react";
import { Ecom } from "@wix/headless-ecom/react";
import { Stores } from "@wix/headless-stores/react";

function App() {
  return (
    <div className="App">
      <Bookings />
      <Ecom />
      <Stores />
      <header className="App-header">
        <img src={logo.src} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/components/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

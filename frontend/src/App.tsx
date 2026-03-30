import React from "react";
import OrderForm from "./components/OrderForm";

export default function App() {
  return (
    <div className="app-container">
      <header className="hero">
        <h1>BioQuill — Order Access</h1>
        <p className="subtitle">Select a molecule or trial and place an order to get platform access.</p>
      </header>

      <main className="main-content">
        <OrderForm />
      </main>

      <footer className="footer">
        <small>BioQuill • ClinicalTrials.gov powered trial selection</small>
      </footer>
    </div>
  );
}

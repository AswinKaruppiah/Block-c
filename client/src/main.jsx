import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Transactionprovider } from "./context/TransactionContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Transactionprovider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Transactionprovider>
);

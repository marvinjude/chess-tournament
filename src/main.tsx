import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { SoundContextProvider } from "./contexts/Sound/index.tsx";
import "./index.css";
import { ThemeContextProvider } from "./contexts/Theme/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SoundContextProvider>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </SoundContextProvider>
  </React.StrictMode>
);

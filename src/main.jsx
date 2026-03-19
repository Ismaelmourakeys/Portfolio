import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"; // ← react, não /next
import { Analytics } from "@vercel/analytics/react";
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />  {/* ← coloca fora do App, aqui mesmo */}
    <Analytics />
  </React.StrictMode>
);

/*createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/
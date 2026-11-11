import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import keycloak from "./keycloak.js"

const root = ReactDOM.createRoot(document.getElementById('root'));


async function initialize() {
  await keycloak.init({onLoad: "check-sso", pkceMethod: "S256"})

  if (keycloak.authenticated) {
    await keycloak.updateToken(30);


    const res = await fetch("/api/account_sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`
        }
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Account sync error:", res.status, error);
    } else {
      const data = await res.json();
      console.log("Profil użytkownika:", data);
    }

  }
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

}


initialize().catch(err => console.log(err))
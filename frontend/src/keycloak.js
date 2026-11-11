import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "slowersus",
  clientId: "sw-client",
});

export default keycloak;
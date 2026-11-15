# Słowersus

**Słowersus** to aplikacja przeglądarkowa umożliwiająca zagranie w klasyczną grę [Wordle](wikipedia.org/wiki/Wordle) w formie pojedynków między użytkownikami. Gracz, który jako pierwszy odgadnie słowo wygrywa pojedynek i zdobywa punkty, dzięki którym może awansować w rankingu.

## Funkcjonalności
**Solo** - samodzielna gra Wordle polegająca na odgadnięciu ukrytego słowa w maksymalnie 6 próbach. Jest idealna do poćwiczenia swoich umiejętności przed pojedynkami. Nie wymaga rejestracji konta.


**Multi** - gra online. Gracz może dołączyć do pokoju rywala i rozegrać pojedynek w czasie rzeczywistym. Jeśli gracz odgadnie słowo poprawnie, wygrywa punkty, w przeciwnym przypadku je traci. Remis nie powoduje strat u żadnego z graczy.

**Ranking** - lista 10 najlepszych graczy, sortowana według ilości punktów. Jest aktualizowana po zakończeniu pojedynków.

**Profile** - na profilu użytkownika można zobaczyć jego opis, liczbę wygranych i przegranych gier oraz streak zwycięstw.

**Panel administracyjny** - administratorzy mogą zarządzać użytkownikami, w tym usuwać ich konta i wykluczać ich z rankingu.


## Technologie

### Frontend
- React - tworzenie interfejsu użytkownika.

- Vite - środowisko developerskie i narzędzie do budowania aplikacji.

- Nginx - serwowanie statycznych plików frontendu i pełnienie funkcji reverse proxy dla backendu.

- Socket.IO Client - komunikacja w czasie rzeczywistym.

### Backend
- Express - udostępnianie REST API.

- Socket.IO - obsługa komunikacji między użytkownikami w czasie rzeczywistym.

- PostgreSQL - przechowywanie danych użytkowników i statystyk.

- Keycloak - uwierzytelnianie użytkowników i zarządzanie kontami.

- Docker - konteneryzacja aplikacji i usług.

## Uruchomienie projektu

### Wymagania

- Docker

- Docker Compose

- Plik .env z wymaganymi zmiennymi środowiskowymi (przykładowy plik konfiguracyjny znajduje się w repozytorium).

### Instrukcja uruchomienia

1. Sklonuj repozytorium:

```
git clone https://github.com/witold-kwidzinski-ug/Slowersus
cd ./Slowersus
```

2. Przygotuj plik .env na podstawie dołączonego przykładu i uzupełnij wymagane zmienne środowiskowe.

3. Uruchom aplikację wraz z wymaganymi usługami:

```
docker compose up --build -d
```

4. Po uruchomieniu kontenerów otwórz aplikację w przeglądarce pod adresem:

http://localhost

Panel Keycloak jest dostępny pod adresem:

http://localhost:8080

### Zatrzymanie aplikacji

Aby zatrzymać kontenery, wykonaj:

```
docker compose down
```

Uwaga: Nie należy udostępniać pliku .env zawierającego prawdziwe hasła, tokeny lub inne dane dostępowe.$

## Architektura projektu

### Frontend
- React odpowiada za interfejs użytkownika i obsługę interakcji.
- Vite służy do uruchamiania środowiska developerskiego i budowania aplikacji.
- Socket.IO Client obsługuje komunikację w czasie rzeczywistym.
- Nginx serwowanie statycznych plików frontendu i reverse proxy dla backendu.
### Backend
- Express udostępnia REST API, np. do pobierania profili i rankingu.
- Socket.IO Server obsługuje rozgrywki multiplayer.
- Backend komunikuje się z PostgreSQL i Keycloakiem.
- Middleware weryfikuje tokeny JWT otrzymane od Keycloaka.
### Infrastruktura
- Docker Compose uruchamia frontend, backend, PostgreSQL i Keycloak.
- PostgreSQL przechowuje dane użytkowników i statystyki.
- Keycloak odpowiada za uwierzytelnianie i zarządzanie kontami.

### Źródła
Lista słów wykorzystywana w grze została zaczerpnięta z zewnętrznego repozytorium: [5-Letter-words](https://github.com/darkermango/5-Letter-words)
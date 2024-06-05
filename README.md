# Filmrecensionsplattform

Designa Mongoose-modeller för Movie, Review, och User med följande fält:

    Movie: title, director, releaseYear, genre.
    Review: movieId (referens till Movie), userId (referens till User), rating,comment, createdAt.
    User: username, email, password, role.

Följande endpoints ska finnas med:

    POST /movies: Lägg till en ny film.
    GET /movies: Hämta en lista med alla filmer.
    GET /movies/:id: Hämta detaljer för en specifik film.
    DELETE /movies/:id: Ta bort en specifik film.
    POST /register: Registrera en ny användare.
    POST /login: Logga in en användare
    PUT /movies/:id: Uppdatera en specifik film.
    POST /reviews: Lägg till en ny recension.
    GET /reviews: Hämta en lista med alla recensioner.
    GET /reviews/:id: Hämta detaljer för en specifik recension.
    DELETE /reviews/:id: Ta bort en specifik recension.
    PUT /reviews/:id: Uppdatera en specifik recension.
    GET /movies/:id/reviews: Hämta alla recensioner för en specifik film.

Att göra:

    GET /movies/ratings: Hämta en lista med alla filmer och deras genomsnittliga betyg.

För Godkänt:

    Uppfyller all funktionalitet enligt ovan
    bifoga exempelanrop till alla endpoints (se länk under inlämning)

För Väl Godkänt:

    backend följer en MVC-arkitektur (eller motsv.)
    Lägg till en endpoint:
    GET /movies/ratings: Hämta en lista med alla filmer och deras genomsnittliga betyg.
    använd olika roller: user och admin. Alla kan hämta filmer samt läsa/skriva rescensioner men endast admin kan lägga till, uppdatera eller ta bort filmer.

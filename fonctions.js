const urlBaseTitre = 'http://127.0.0.1:8000/api/v1/titles/';
const urlBaseGenre = 'http://127.0.0.1:8000/api/v1/genres/';
const uriMeilleursFilms = '?sort_by=-imdb_score,-votes';
const uriFilmsMieuxNotesPage1 = '?sort_by=-imdb_score&page=1';
const uriFilmsMysteryPage1 = '?genre=Mystery&sort_by=-imdb_score&page=1'
const uriFilmsAnimationPage1 = '?genre=Animation&sort_by=-imdb_score&page=1'
const urlMeilleursFilms = urlBaseTitre + uriMeilleursFilms

/**
* Affiche le meilleur film (meilleure note et le plus de vote).
* Récupère les données des meilleurs films depuis l’API et garde le 1er résultat,
* puis insère les informations dans l’élément HTML correspondant.
*
* @async
* @function afficherMeilleurFilm
* @returns {Promise<void>} Ne retourne rien (mise à jour du DOM)
*/
async function afficherMeilleurFilm() {

    try {
        // Étape 1 : récupérer la liste triée
        const reponseMeilleursFilms = await fetch(urlMeilleursFilms);
        if (!reponseMeilleursFilms.ok) throw new Error('Erreur réseau - liste meilleurs films');

        const dataListeMeilleursFilms = await reponseMeilleursFilms.json();
        const meilleurFilm = dataListeMeilleursFilms.results[0];

        // Étape 2 : récupérer les détails du film
        const reponseMeilleurFilm = await fetch(urlBaseTitre + meilleurFilm.id);
        if (!reponseMeilleurFilm.ok) throw new Error('Erreur réseau - détail');

        const filmDetail = await reponseMeilleurFilm.json();

        // Étape 3 : affichage dans le HTML
        const elementTitre = document.getElementById("titre-film");
        const elementImage = document.getElementById("img-film");
        const elementDescription = document.getElementById("description_film");

        elementTitre.innerText = meilleurFilm.title;
        elementImage.src = meilleurFilm.image_url;
        elementDescription.innerText = filmDetail.description;

        // Affichage modale
        // Récuparation du bouton pour l'écoute du click
        const boutonDetails = document.querySelector(".bouton-detail");

        // Ecoute de l'évenement click pour générer la modale
        boutonDetails.addEventListener("click", (event) => {
            afficherModale(meilleurFilm.url); // passage de l'url dans la fonction d’affichage de la modale
        });

    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}
/**
 * Affiche dynamiquement une catégorie de 6 films dans le HTML.
 *
 * Cette fonction :
 * - Récupère les films depuis l'API (page 1 obligatoire, page 2 facultative).
 * - Concatène le premier film de la page 2 à la liste correspondant à la page 1.
 * - Génère dynamiquement les blocs HTML pour chaque film à l'aide d'un <template>.
 * - Remplit les informations du film (titre, image).
 * - Ajoute un bouton "Détails" pour ouvrir la modale contenant le détail du film sélectionné.
 * - Gère le placeholder d'image en cas d'image non disponible.
 *
 * @async
 * @function afficherFilmsCategorie
 * @param {string} p_urlPage1 - URL de l'API pour la page 1 des films
 * @param {string} p_categorie - ID de la section HTML où insérer les films (ex : "mystery")
 * @returns {Promise<void>} Ne retourne rien (mise à jour directe du DOM)
 */
async function afficherFilmsCategorie(p_urlPage1, p_categorie) {

    try {

        // Etape 1 : récupérer la liste tirée et préparer les données
        const reponseFilmsPage1 = await fetch(p_urlPage1)
        if (!reponseFilmsPage1.ok) throw new Error('Erreur réseau - liste films de la page 1')
        const dataListeFilmsPage1 = await reponseFilmsPage1.json();

        let listeFilms = dataListeFilmsPage1.results;

        if (dataListeFilmsPage1.next) {
            const reponseFilmsPage2 = await fetch(dataListeFilmsPage1.next)
            if (!reponseFilmsPage2.ok) throw new Error('Erreur réseau - liste films de la page 2')
            const dataListeFilmsPage2 = await reponseFilmsPage2.json();

            const listeFilmsPage2 = dataListeFilmsPage2.results[0]
            listeFilms.push(listeFilmsPage2);
        }

        // Etape 2 : affichage dans le HTML
        const section = document.getElementById(p_categorie);
        const template = document.getElementById("template-film");
        const grid = section.getElementsByClassName("contenu-films");

        for (let i = 0; i < listeFilms.length; i++) {
            const cloneTemplate = template.content.cloneNode(true);
            // récupérer les détails du film
            const film = listeFilms[i]
            const urlfilm = film.url
            const reponseUrlFilm = await fetch(urlfilm);
            if (!reponseUrlFilm.ok) throw new Error('Erreur réseau - détail des film');


            cloneTemplate.querySelector(".titre-film").innerText = film.title;

            // Préparation du bouton pour qu'il récupère l'url du film
            const boutonDetails = cloneTemplate.querySelector(".bouton-detail");
            boutonDetails.innerText = "Détails"
            boutonDetails.dataset.url = film.url

            // Ecoute de l'évenement click pour générer la modale
            boutonDetails.addEventListener("click", (event) => {
                const urlFilm = event.target.dataset.url; // récupération de l'url stockée
                afficherModale(urlFilm); // passage de l'url dans la fonction d’affichage de la modale
            });

            // Gestion d'affichage de l'image si l'image de l'api renvoie une erreur 404
            const imageElement = cloneTemplate.querySelector(".img-film");
            chargerImage(imageElement, film.image_url);

            grid[0].appendChild(cloneTemplate);
        }

    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}


/**
 * Récupère dynamiquement tous les genres disponibles depuis l'API
 * (en parcourant les pages de résultats), filtre ceux déjà affichés,
 * puis les insère dans un menu déroulant (élément HTML <select>).
 *
 * Genres exclus de l'affichage : "Mystery", "Animation".
 *
 * @async
 * @function afficherGenres
 * @returns {Promise<void>} Ne retourne rien, mais insère dynamiquement des <option> dans le <select id="select-genres">
 */
async function afficherGenres() {
    try {

        // Etape 1 : récupérer la liste 
        const reponseGenresPage1 = await fetch(urlBaseGenre)
        if (!reponseGenresPage1.ok) throw new Error("Erreur réseau - liste des genres de la page 1")
        const dataListeGenrePage1 = await reponseGenresPage1.json();

        let listeGenreBrute = dataListeGenrePage1.results

        let urlPageSuivante = dataListeGenrePage1.next
        if (!dataListeGenrePage1.next) throw new Error('Erreur réseau - Impossible de changer de page');

        while (urlPageSuivante) {
            const reponseGenrePageSuivante = await fetch(urlPageSuivante)
            if (!reponseGenrePageSuivante.ok) throw new Error("Erreur réseau - Impossible de changer de page")
            const dataGenrePageSuivante = await reponseGenrePageSuivante.json();

            listeGenreBrute = listeGenreBrute.concat(dataGenrePageSuivante.results)
            urlPageSuivante = dataGenrePageSuivante.next
        }

        // Etape 2 : Filtrer pour enlever les filtres des catégories déjà affichés
        const categoriesDejaAffiches = ["Mystery", "Animation"];
        const listeGenre = listeGenreBrute.filter((genre) => {
            return !categoriesDejaAffiches.includes(genre.name);
        })

        // Etape 3 : affichage dans le HTML
        for (let index = 0; index < listeGenre.length; index++) {

            const nouvelleOption = document.createElement("option");
            nouvelleOption.value = listeGenre[index].name;
            nouvelleOption.textContent = listeGenre[index].name;
            document.getElementById("select-genres").appendChild(nouvelleOption);
        }

    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}

/**
* Charge une image dans un élément <img> et utilise une image par défaut si l'image est introuvable.
*
* @function chargerImage
* @param {HTMLImageElement} p_imageElement - Élément <img> dans lequel l'image sera chargée.
* @param {string} p_imageUrl - URL de l'image à charger.
* 
* Cette fonction tente de charger l'image spécifiée par p_imageUrl dans l'élément HTML donné.
* Si l'image échoue à se charger (erreur réseau, image absente, etc.), une image par défaut sera affichée à la place.
*/
function chargerImage(p_imageElement, p_imageUrl) {
    p_imageElement.src = p_imageUrl;

    p_imageElement.onerror = function () {
        this.src = "images/image_non_trouvee.png"; // Image de remplacement en cas d'erreur
    };
}

/**
 * Affiche une modale contenant les détails d'un film.
 *
 * Cette fonction :
 * - Récupère les informations détaillées du film via l'API (avec l'URL fournie).
 * - Clone le template de la modale.
 * - Remplit les champs de la modale (titre, image, année, genres, durée, score, réalisateurs, description, acteurs).
 * - Insère la modale dans le DOM.
 * - Ajoute un bouton de fermeture permettant de retirer la modale du DOM.
 *
 * @async
 * @function afficherModale
 * @param {string} p_url_film - L'URL de l'API pour récupérer les détails du film.
 * @returns {Promise<void>} Ne retourne rien (modifie uniquement le DOM).
 */
async function afficherModale(p_url_film) {

    try {
        // Récupérer les infos du film
        const reponseFilm = await fetch(p_url_film)
        if (!reponseFilm.ok) throw new Error('Erreur réseau - détail film')

        const filmDetail = await reponseFilm.json();

        // Afficher les infos dans la modale
        const template = document.getElementById("template-modale");
        const cloneTemplateDetail = template.content.cloneNode(true);

        cloneTemplateDetail.querySelector(".titre-film").innerText = filmDetail.title;

        // Gestion d'affichage de l'image si l'image de l'api renvoie une erreur 404
        const imageElement = cloneTemplateDetail.querySelector(".img-film");
        chargerImage(imageElement, filmDetail.image_url);

        cloneTemplateDetail.querySelector(".annee-film").innerText = filmDetail.year;
        cloneTemplateDetail.querySelector(".genre-film").innerText = filmDetail.genres;

        // Affichage de la classification
        if (filmDetail.rated !== "Not rated or unkown rating") {
            if (!isNaN(filmDetail.rated)) {
                cloneTemplateDetail.querySelector(".classification").innerText = "PG-" + filmDetail.rated + "  -";
            } else {
                cloneTemplateDetail.querySelector(".classification").innerText = filmDetail.rated + "  -";
            }
        } else {
            cloneTemplateDetail.querySelector(".classification").innerText = "Non classé - ";
        }

        cloneTemplateDetail.querySelector(".duree-film").innerText = filmDetail.duration + " minutes   ";
        cloneTemplateDetail.querySelector(".pays").innerText = "  (" + filmDetail.countries + ")";
        cloneTemplateDetail.querySelector(".score-film").innerText = "IMDB score : " + filmDetail.imdb_score + "/10";
        
        // Préparation des données monnaitaires pour affichage
        if (filmDetail.worldwide_gross_income !== null && filmDetail.budget_currency !== null) {
            const devise = filmDetail.budget_currency
            const symbols = {
                "USD": "$",
            };
            const symbol = symbols[devise];

            const recettes = filmDetail.worldwide_gross_income
            const recettesFormatees = (recettes / 1_000_000).toFixed(1);
            cloneTemplateDetail.querySelector(".recettes").innerText = "Recettes au box-office : " + symbol + recettesFormatees + "m";

        } else {
            cloneTemplateDetail.querySelector(".recettes").innerText = "Recettes au box-office non communiquées"
        }

        cloneTemplateDetail.querySelector(".realisateur-film").innerText = filmDetail.directors;
        cloneTemplateDetail.querySelector(".description_longue-film").innerText = filmDetail.long_description;
        cloneTemplateDetail.querySelector(".acteurs_film").innerText = filmDetail.actors;

        console.log(filmDetail.id)

        document.body.appendChild(cloneTemplateDetail);

        const modale = document.querySelector(".modale"); // Cible directement l'article de la modale

        const boutonFermer = modale.querySelector("button");

        boutonFermer.addEventListener("click", () => {
            modale.remove();
        });

    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}

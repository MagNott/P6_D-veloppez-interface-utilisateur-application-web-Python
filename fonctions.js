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
        const elementDescription = document.getElementById("description-film");

        elementTitre.innerText = meilleurFilm.title;
        chargerImage(elementImage, meilleurFilm.image_url, meilleurFilm.title);
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
        // grid est une liste d'un élément 

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
            boutonDetails.setAttribute("aria-label", `Voir les détails du film ${film.title}`)


            // Ecoute de l'évenement click pour générer la modale
            boutonDetails.addEventListener("click", (event) => {
                const urlFilm = event.target.dataset.url; // récupération de l'url stockée
                afficherModale(urlFilm); // passage de l'url dans la fonction d’affichage de la modale
            });

            // Gestion d'affichage de l'image si l'image de l'api renvoie une erreur 404
            const imageElement = cloneTemplate.querySelector(".img-film");
            chargerImage(imageElement, film.image_url, film.title);

            // Gestion du responsiv
            if (i === 0 || i === 1) {
                cloneTemplate.querySelector("article").classList.add("block");
            } else if (i === 2 || i === 3) {
                cloneTemplate.querySelector("article").classList.add("hidden", "sm:block");

            } else {
                cloneTemplate.querySelector("article").classList.add("hidden", "lg:block");
            }

            // Comme grid est une liste avec un seul éléement il faut pointer l'index 0 pour obtenir la zone où mettre le template
            grid[0].appendChild(cloneTemplate);
        }
        ajouterBoutonVoirPlus(grid[0]);

    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}

/**
 * Affiche dynamiquement une liste de genres dans une fausse select box personnalisée (en <ul> / <li>).
 *
 * Fonctionnement :
 * - Récupère tous les genres depuis l’API (avec pagination si besoin)
 * - Filtre pour exclure certains genres déjà affichés ailleurs (ex : "Mystery", "Animation")
 * - Crée un élément <li> pour chaque genre et l’insère dans le <ul> ayant l’id "select-genres"
 * - Ajoute des classes Tailwind pour le style visuel (bordures, gras, survol, etc.)
 * - Gère le clic sur chaque <li> :
 *    → Met à jour le texte du bouton (id="texte-bouton")
 *    → Cache la liste déroulante
 *    → Construit une URL avec le genre sélectionné
 *    → Vide la section #contenu-films
 *    → Affiche les films correspondant au genre choisi
 *    → Ajoute une icône ✅ à l’option sélectionnée (et la retire des autres)
 *
 *@async
 * @function afficherGenres
 * @returns {Promise<void>} Ne retourne rien, mais insère dynamiquement des <li> dans le <ul id="select-genres">
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

            // Creation de la nouvelle option (élément li) qui sera dans le ul qui représente le menu
            const nouvelleOption = document.createElement("li");
            nouvelleOption.dataset.value = listeGenre[index].name;
            nouvelleOption.textContent = listeGenre[index].name;

            // Recupration du menu déroulant (ul) avec l'id pour pour ajouter chaque option (li)
            document.getElementById("select-genres").appendChild(nouvelleOption);

            // Ajout des classes Tailwind pour mettre en forme les options (li)
            nouvelleOption.classList.add("border-b", "border-black", "px-4", "py-2", "hover:bg-gray-100", "cursor-pointer", "font-bold", "text-xl")

            // Accessibilité
            nouvelleOption.setAttribute("role", "option");
            nouvelleOption.setAttribute("tabindex", "0");
            nouvelleOption.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  nouvelleOption.click(); // Simule un clic
                }
              });

            // Ajout de l'évenement click sur l'option (li) pour la gestion du choix d'une option
            nouvelleOption.addEventListener("click", (event) => {

                // Reinitialisation de la section des films affichés
                document.getElementById("contenu-films").innerHTML = "";

                // Récupération du genre cliqué d'une option (li)
                const genreChoisi = event.target.dataset.value
                const bouton = document.getElementById("bouton-select");

                // Met à jour le texte du bouton avec le genre choisi
                document.getElementById("texte-bouton").innerText = genreChoisi;

                // Cache la liste déroulante
                document.getElementById("select-genres").classList.toggle("hidden");
                bouton.setAttribute("aria-expanded", "false");

                // Supprime le ✅ de toutes les options avant d’en mettre un sur celle cliquée
                const listeLi = document.getElementById("select-genres").querySelectorAll("li");
                listeLi.forEach(li => {
                    li.textContent = li.textContent.replace("✅","");
                    li.removeAttribute("aria-selected");
                });
                event.target.textContent += "  ✅";
                event.target.setAttribute("aria-selected", "true");

                // Construction de l'url pour le fetch de la catégorie
                const urlPage1 = urlBaseTitre + `?genre=${genreChoisi}&sort_by=-imdb_score&page=1`;

                afficherFilmsCategorie(urlPage1, "categorie-autres")
              });
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
* @param {string} p_titreFilm - Titre du film, utilisé pour générer un texte alternatif pertinent.
* 
* Cette fonction tente de charger l'image spécifiée par p_imageUrl dans l'élément HTML donné.
* Si l'image échoue à se charger (erreur réseau, image absente, etc.), une image par défaut sera affichée à la place.
* Un texte alternatif est ajouté avec le titre du film pour décrire l'image chargée
*/
function chargerImage(p_imageElement, p_imageUrl, p_titreFilm) {
    p_imageElement.src = p_imageUrl;
    p_imageElement.alt = `Affiche du film ${p_titreFilm}`;

    p_imageElement.onerror = function () {
        this.src = "images/image_non_trouvee.png"; // Image de remplacement en cas d'erreur
        this.alt = `Affiche manquante pour le film ${p_titreFilm}`;
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

        // Accessibilité
        const modaleElement = cloneTemplateDetail.querySelector(".modale")

        modaleElement.setAttribute("role", "dialog");
        modaleElement.setAttribute("aria-modal", "true")
        modaleElement.setAttribute("aria-labelledby", "titre-film-dialogue");
        modaleElement.setAttribute("aria-describedby", "contenu-film-dialogue");


        cloneTemplateDetail.querySelector(".titre-film").innerText = filmDetail.title;

        // Gestion d'affichage de l'image si l'image de l'api renvoie une erreur 404
        const imageElement = cloneTemplateDetail.querySelector(".img-film");
        chargerImage(imageElement, filmDetail.image_url, filmDetail.title);

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
        cloneTemplateDetail.querySelector(".description-longue-film").innerText = filmDetail.long_description;
        cloneTemplateDetail.querySelector(".acteurs-film").innerText = filmDetail.actors;

        document.body.appendChild(cloneTemplateDetail);

        // Une fois la modale insérée dans le DOM ajout de l'événement fermeture et du focus sur le bouton
        const modale = document.querySelector(".modale"); // Cible directement l'article de la modale
        const boutonFermer = modale.querySelector(" button");
        const croixFermer = modale.querySelector(".croix-fermer")
        document.body.classList.add("overflow-hidden");
        boutonFermer.focus(); 

        boutonFermer.addEventListener("click", () => {
            document.querySelector(".bouton-detail").focus();  // Permet de revenir au bouton qui a servi à ouvrir la modale
            document.body.classList.remove("overflow-hidden");
            modale.remove();
        });

        croixFermer.addEventListener("click", () => {
            document.querySelector(".bouton-detail").focus();  // Permet de revenir au bouton qui a servi à ouvrir la modale
            document.body.classList.remove("overflow-hidden");
            modale.remove();
        });


    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}

/**
 * Ajoute un bouton "Voir plus" dans un conteneur HTML, qui peut basculer en "Voir moins" au clic.
 *
 * Ce bouton permet d’afficher ou masquer dynamiquement les éléments <article> qui sont
 * initialement cachés avec la classe Tailwind "hidden". Il est visible uniquement sur
 * mobile et tablette grâce à la classe "lg:hidden".
 *
 * Si le conteneur contient peu d’articles :
 * - Moins de 3 articles : le bouton est masqué même en mobile (classe "sm:hidden")
 * - Moins de 5 articles : le bouton est masqué sur mobile ET tablette (classe "md:hidden")
 *
 * Fonctionnement du bouton :
 * - En mode "Voir plus" :
 *   • Affiche tous les articles cachés (supprime "hidden")
 *   • Ajoute la classe "est_affiche" pour pouvoir les cibler ensuite
 *   • Change le texte en "Voir moins"
 *
 * - En mode "Voir moins" :
 *   • Cache uniquement les articles marqués "est_affiche"
 *   • Réapplique "hidden" et retire "est_affiche"
 *   • Remet le texte en "Voir plus"
 *
 * @param {HTMLElement} p_cloneTemplate - Le conteneur dans lequel le bouton est inséré
 */
function ajouterBoutonVoirPlus(p_cloneTemplate) {

    // Ajout d'un conteneur pour le bouton afin de lui permettre d'être centré (sinon il est dans une grille)
    const conteneurBouton = document.createElement("div");
    conteneurBouton.classList.add("col-span-full", "flex", "justify-center");

    // Si il n'y a pas assez de films, il ne faut pas afifcher le bouton 
    const bouton = document.createElement("button");
    bouton.innerText = "Voir plus";
    bouton.classList.add("bouton-voir-plus", "bg-red-600", "lg:hidden", "text-white", "m-4", "px-12", "py-3", "rounded-3xl", "hover:bg-red-700", "transition", "text-2xl");

    if (p_cloneTemplate.querySelectorAll("article").length <= 2) {
        bouton.classList.add("sm:hidden")
    } else if (p_cloneTemplate.querySelectorAll("article").length <= 4){
        bouton.classList.add("md:hidden")
    }

    bouton.addEventListener("click", () => {
        if (bouton.innerText === "Voir plus") {
            const articlesCaches = p_cloneTemplate.querySelectorAll("article.hidden");
            articlesCaches.forEach(article => {
                article.classList.remove("hidden"); 
                article.classList.add("est_affiche"); 
                bouton.innerText = "Voir moins"; 
            });
        } else {
            const articlesAffiches = p_cloneTemplate.querySelectorAll("article.est_affiche");
            articlesAffiches.forEach(article => {
            article.classList.add("hidden"); 
            article.classList.remove("est_affiche"); 
            bouton.innerText = "Voir plus"; 
        });
    }
});

conteneurBouton.appendChild(bouton);
p_cloneTemplate.appendChild(conteneurBouton);
}
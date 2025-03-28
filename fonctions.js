const urlBaseTitre = 'http://127.0.0.1:8000/api/v1/titles/';
const urlBaseGenre = 'http://127.0.0.1:8000/api/v1/genres/';
const uriMeilleursFilms = '?sort_by=-imdb_score,-votes';
const uriFilmsMieuxNotesPage1 = '?sort_by=-imdb_score&page=1';
const uriFilmsMysteryPage1 = '?genre=Mystery&page=1'
const uriFilmsAnimationPage1 = '?genre=Animation&page=1'
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

    } catch (error) {
        console.error("Erreur Fetch :", error);
    }
}

/**
 * Construit dynamiquement une section HTML contenant les 6 meilleurs films d’une catégorie.
 * Récupère les données depuis deux pages de l’API, fusionne les résultats,
 * puis insère les informations dans l’élément HTML correspondant à la catégorie.
 *
 * @async
 * @function afficherFilmsCategorie
 * @param {string} p_urlPage1 - URL de l'API pour la page 1 des films
 * @param {string} p_urlPage2 - URL de l'API pour la page 2 des films
 * @param {string} p_categorie - ID de la section HTML correspondant à la catégorie (ex : "mystery")
 * @returns {Promise<void>} Ne retourne rien (mise à jour du DOM)
 */
async function afficherFilmsCategorie(p_urlPage1, p_categorie) {

    try {

        // Etape 1 : récupérer la liste tirée et préparer les données
        const reponseFilmsPage1 = await fetch(p_urlPage1)
        if (!reponseFilmsPage1.ok) throw new Error('Erreur réseau - liste films de la page 1')
        const dataListeFilmsPage1 = await reponseFilmsPage1.json();

        let listeFilms = dataListeFilmsPage1.results;

        if (dataListeFilmsPage1.next){
            const reponseFilmsPage2 = await fetch(dataListeFilmsPage1.next)
            if (!reponseFilmsPage2.ok) throw new Error('Erreur réseau - liste films de la page 2')
            const dataListeFilmsPage2 = await reponseFilmsPage2.json();

            const listeFilmsPage2 = dataListeFilmsPage2.results[0]
            console.log(Array.isArray(listeFilms));
            console.log(listeFilmsPage2);
            listeFilms.push(listeFilmsPage2);
        }


        // Etape 2 : réduire la liste à 6 films


        // Etape 3 : affichage dans le HTML
        const section = document.getElementById(p_categorie);
        const template = document.getElementById("template-film");

        for (let i = 0; i < listeFilms.length; i++) {
            const cloneTemplate = template.content.cloneNode(true);
            // récupérer les détails du film
            const film = listeFilms[i]
            const urlfilm = film.url
            const reponseUrlFilm = await fetch(urlfilm);
            if (!reponseUrlFilm.ok) throw new Error('Erreur réseau - détail des film');

            const filmDetail = await reponseUrlFilm.json();

            cloneTemplate.querySelector(".titre-film").innerText = film.title;

            // Gestion d'affichage de l'image si l'image de l'api renvoie une erreur 404
            const imageElement = cloneTemplate.querySelector(".img-film");
            chargerImage(imageElement, film.image_url);
            
            cloneTemplate.querySelector(".description-film").innerText = filmDetail.description;

            section.appendChild(cloneTemplate);
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
        
        p_imageElement.onerror = function() {
            this.src = "images/image_non_trouvee.jpg"; // Image de remplacement en cas d'erreur
        };
    }
    

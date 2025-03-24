const urlMeilleursFilms = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score,-votes';
const urlFilmsMieuxNotesPage1 = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=1';
const urlFilmsMieuxNotesPage2 = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=2';
const urlFilmsMysteryPage1 = 'http://127.0.0.1:8000/api/v1/titles/?genre=Mystery&page=1'
const urlFilmsMysteryPage2 = 'http://127.0.0.1:8000/api/v1/titles/?genre=Mystery&page=2'
const urlFilmsAnimationPage1 = 'http://127.0.0.1:8000/api/v1/titles/?genre=Animation&page=1'
const urlFilmsAnimationPage2 = 'http://127.0.0.1:8000/api/v1/titles/?genre=Animation&page=2'
const urlBaseTitre = 'http://127.0.0.1:8000/api/v1/titles/';
const urlBaseGenre = 'http://127.0.0.1:8000/api/v1/genres/';


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
  
afficherMeilleurFilm();

async function afficherFilmsMieuxNotes() {
  try {

    // Etape 1 : récupérer la liste tirée et préparer les données
    const reponseFilmsMieuxNotesPage1 = await fetch(urlFilmsMieuxNotesPage1)
    if (!reponseFilmsMieuxNotesPage1.ok) throw new Error('Erreur réseau - liste films les mieux notés de la page 1')
    const dataListeFilmsMieuxNotesPage1 = await reponseFilmsMieuxNotesPage1.json();

    const reponseFilmsMieuxNotesPage2 = await fetch(urlFilmsMieuxNotesPage2)
    if (!reponseFilmsMieuxNotesPage2.ok) throw new Error('Erreur réseau - liste films les mieux notés de la page 2')
    const dataListeFilmsMieuxNotesPage2 = await reponseFilmsMieuxNotesPage2.json();


    // Etape 2 : réduire la liste à 6 films

    const ListeFilmsMieuxNotesPage1 = dataListeFilmsMieuxNotesPage1.results;
    const ListeFilmsMieuxNotesPage2 = dataListeFilmsMieuxNotesPage2.results[0]

    const ListeFilmsMieuxNotes = ListeFilmsMieuxNotesPage1.concat(ListeFilmsMieuxNotesPage2);

    // Etape 3 : affichage dans lee HTML

    for (let i =0; i < ListeFilmsMieuxNotes.length; i++){
      // récupérer les détails du film
      const film = ListeFilmsMieuxNotes[i]
      const urlfilm = film.url
      const reponseUrlFilm = await fetch(urlfilm);
      if (!reponseUrlFilm.ok) throw new Error('Erreur réseau - détail des films les mieux notés');

      const filmDetail = await reponseUrlFilm.json();


      const elementTitre = document.getElementById("titre-film" + i);
      const elementImage = document.getElementById("img-film" + i);
      const elementDescription = document.getElementById("description_film" + i);

      elementTitre.innerText = film.title;
      elementImage.src = film.image_url;
      elementDescription.innerText = filmDetail.description;
    }



  } catch (error) {
    console.error("Erreur Fetch :", error);
  }
  
  }

afficherFilmsMieuxNotes()

async function afficherFilmsMystery() {
  try {

    // Etape 1 : récupérer la liste tirée et préparer les données
    const reponseMysteryPage1 = await fetch(urlFilmsMysteryPage1)
    if (!reponseMysteryPage1.ok) throw new Error('Erreur réseau - liste films Mystery de la page 1')
    const dataListeMysteryPage1 = await reponseMysteryPage1.json();

    const reponseMysteryPage2 = await fetch(urlFilmsMysteryPage2)
    if (!reponseMysteryPage2.ok) throw new Error('Erreur réseau - liste films Mystery de la page 2')
    const dataListeMysteryPage2 = await reponseMysteryPage2.json();


    // Etape 2 : réduire la liste à 6 films

    const ListeMysteryPage1 = dataListeMysteryPage1.results;
    const ListeMysteryPage2 = dataListeMysteryPage2.results[0]

    const ListeMystery = ListeMysteryPage1.concat(ListeMysteryPage2);

    // Etape 3 : affichage dans le HTML

    for (let i =0; i < ListeMystery.length; i++){
      // récupérer les détails du film
      const film = ListeMystery[i]
      const urlfilm = film.url
      const reponseUrlFilm = await fetch(urlfilm);
      if (!reponseUrlFilm.ok) throw new Error('Erreur réseau - détail des films Mystery');

      const filmDetail = await reponseUrlFilm.json();

      const elementTitre = document.getElementById("titre-film-mystery-" + i);
      const elementImage = document.getElementById("img-film-mystery-" + i);
      const elementDescription = document.getElementById("description_film-mystery-" + i);

      elementTitre.innerText = film.title;
      elementImage.src = film.image_url;
      elementDescription.innerText = filmDetail.description;
    }

  } catch (error) {
    console.error("Erreur Fetch :", error);
  }
    
  }

afficherFilmsMystery();

async function afficherFilmsAnimation() {
  try {

    // Etape 1 : récupérer la liste tirée et préparer les données
    const reponseAnimationPage1 = await fetch(urlFilmsAnimationPage1)
    if (!reponseAnimationPage1.ok) throw new Error("Erreur réseau - liste d'animation de la page 1")
    const dataListeAnimationPage1 = await reponseAnimationPage1.json();

    const reponseAnimationPage2 = await fetch(urlFilmsAnimationPage2)
    if (!reponseAnimationPage2.ok) throw new Error("Erreur réseau - liste d'animation de la page 2")
    const dataListeAnimationPage2 = await reponseAnimationPage2.json();


    // Etape 2 : réduire la liste à 6 films

    const ListeAnimationPage1 = dataListeAnimationPage1.results;
    const ListeAnimationPage2 = dataListeAnimationPage2.results[0]

    const ListeAnimation = ListeAnimationPage1.concat(ListeAnimationPage2);

    // Etape 3 : affichage dans le HTML

    for (let i =0; i < ListeAnimation.length; i++){
      // récupérer les détails du film
      const film = ListeAnimation[i]
      const urlfilm = film.url
      const reponseUrlFilm = await fetch(urlfilm);
      if (!reponseUrlFilm.ok) throw new Error('Erreur réseau - Détail des films animation');

      const filmDetail = await reponseUrlFilm.json();

      const elementTitre = document.getElementById("titre-film-animation-" + i);
      const elementImage = document.getElementById("img-film-animation-" + i);
      const elementDescription = document.getElementById("description_film-animation-" + i);

      elementTitre.innerText = film.title;
      elementImage.src = film.image_url;
      elementDescription.innerText = filmDetail.description;
    }

  } catch (error) {
    console.error("Erreur Fetch :", error);
  }
    
  }

afficherFilmsAnimation();

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
afficherGenres()
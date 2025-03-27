document.addEventListener("DOMContentLoaded", () => {


  //Affiche le meilleur film 
  afficherMeilleurFilm();

  // Affiche une catégorie de 6 films les mieux notés
  const urlFilmsMieuxNotesPage1 = urlBaseTitre + uriFilmsMieuxNotesPage1
  const urlFilmsMieuxNotesPage2 = urlBaseTitre + uriFilmsMieuxNotesPage2
  afficherFilmsCategorie(urlFilmsMieuxNotesPage1, urlFilmsMieuxNotesPage2, "meilleures-notes")

  // Affiche 6 films de la catégorie Mystery
  const urlFilmsMysteryPage1 = urlBaseTitre + uriFilmsMysteryPage1 
  const urlFilmsMysteryPage2 = urlBaseTitre + uriFilmsMysteryPage2 
  afficherFilmsCategorie(urlFilmsMysteryPage1, urlFilmsMysteryPage2, "mystery")
  
  // Affiche 6 films de la catégorie Animation
  const urlFilmsAnimationPage1 = urlBaseTitre +  uriFilmsAnimationPage1
  const urlFilmsAnimationPage2 = urlBaseTitre +  uriFilmsAnimationPage2
  afficherFilmsCategorie(urlFilmsAnimationPage1, urlFilmsAnimationPage2, "animation")

  // Prépare une Selectbox avec tous les genres de film
  afficherGenres()


  const selectBox = document.getElementById("select-genres")

  selectBox.addEventListener("change", (event) => {
    document.getElementById("contenu-films").innerHTML = "";
    const genreChoisi = event.target.value

    const urlPage1 = urlBaseTitre + `?genre=${genreChoisi}&page=1`;
    const urlPage2 = urlBaseTitre + `?genre=${genreChoisi}&page=2`;

    afficherFilmsCategorie(urlPage1, urlPage2, "contenu-films")

  })

});
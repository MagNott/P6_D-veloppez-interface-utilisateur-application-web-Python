document.addEventListener("DOMContentLoaded", () => {


  //Affiche le meilleur film 
  afficherMeilleurFilm();

  // Affiche une catégorie de 6 films les mieux notés
  const urlFilmsMieuxNotesPage1 = urlBaseTitre + uriFilmsMieuxNotesPage1
  afficherFilmsCategorie(urlFilmsMieuxNotesPage1, "meilleures-notes")

  // Affiche 6 films de la catégorie Mystery
  const urlFilmsMysteryPage1 = urlBaseTitre + uriFilmsMysteryPage1 
  afficherFilmsCategorie(urlFilmsMysteryPage1, "mystery")
  
  // Affiche 6 films de la catégorie Animation
  const urlFilmsAnimationPage1 = urlBaseTitre +  uriFilmsAnimationPage1
  afficherFilmsCategorie(urlFilmsAnimationPage1, "animation")

  // Prépare une Selectbox avec tous les genres de film
  afficherGenres()

  const selectBox = document.getElementById("select-genres")

  selectBox.addEventListener("change", (event) => {
    document.getElementById("contenu-films").innerHTML = "";
    const genreChoisi = event.target.value

    const urlPage1 = urlBaseTitre + `?genre=${genreChoisi}&sort_by=-imdb_score&page=1`;

    afficherFilmsCategorie(urlPage1, "categorie_autres")

  })

});
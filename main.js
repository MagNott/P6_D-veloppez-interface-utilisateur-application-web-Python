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

  // Prépare une Selectbox (en div, bouton, ul et li) avec tous les genres de film
  afficherGenres()

  // Ouvre ou ferme la liste au clic sur le bouton
  document.getElementById("bouton-select").addEventListener("click", () => {
    document.getElementById("select-genres").classList.toggle("hidden");
});


});
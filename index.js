const urlMeilleursFilms = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score,-votes';
const urlBaseTitre = 'http://127.0.0.1:8000/api/v1/titles/';


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






  
// fetch('http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score,-votes')
//   .then(response => {
//     if (!response.ok) throw new Error('Erreur réseau');
//     return response.json();
//   })
//   .then(data => {
//     const film = data.results[0];

//     fetch(url_titre + film.id)
//     . then(response => {
//         if (!response.ok) throw new Error('Erreur réseau');
//         return response.json();
//       })
//       .then(data => {
//         const description = data.description;

//         const elementDescription = document.getElementById("description_film");

//         elementDescription.innerText = description;
//       })
//       .catch(error => {
//         console.error('Erreur Fetch:', error);
//       })

//     const titre = film.title;
//     const image = film.image_url;
    

//     const elementTitre = document.getElementById("titre-film");
//     const elementImage = document.getElementById("img-film");
    

//     elementTitre.innerText = titre;
//     elementImage.src = image;
    
//   })
//   .catch(error => {
//     console.error('Erreur Fetch:', error);
//   })
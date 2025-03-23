const urlMeilleursFilms = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score,-votes';
const urlFilmsMieuxNotesPage1 = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=1';
const urlFilmsMieuxNotesPage2 = 'http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=2';
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

      console.log(ListeFilmsMieuxNotes)

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
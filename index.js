// 1) DECLARATION DES VARIABLES

const main = document.querySelector("main");
const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];
let exerciceArray = [];
// on creer un tableau avec plusieurs objets
// ça réprenste chaque card avec son excercice
// ce qui permettra de déplacer les cartes
// reviendra juste à changer sa place dans le tableau
// pour le nombre de min c'est pareil vu que c'est un variable
// pareil pour la supression on supprimera l'élément du tableaux

// on va créer un fonction anonyme qui ne se lance qu'une fois
// cette fonction va permettre de récupérer le local storage
(() => {
  if (localStorage.exercices) {
    // si il y a quelque chose dans le local storage alors
    // récupère le tableau de l'utilisateur avec ses modifs
    exerciceArray = JSON.parse(localStorage.exercices);
    // ne pas oublier de retransformer les éléments sauvegarder en JSON
    // en tableau pour qu'il puisse les interprété
  } else {
    // sinon le tableau dynamique et le tableau de base
    exerciceArray = basicArray;
  }
})();

// 2 DECLARATION DES CLASS
// Dans laquelle on va créer le système de chronomètre qui change
// d'excercice

class Exercice {
  constructor() {
    // on va créer nos index dynamique
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }

  updateCountdown() {
    // on va faire une ternaire pour afficher 00
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    // si la valeur est < 10 alors 0 + valeur affiché sinon affiche la
    // valeur sans 0
    setTimeout(() => {
      // création du chrono
      if (this.minutes === 0 && this.seconds === "00") {
        this.index++; // changement des exercice
        this.ring(); // lancer la fonction de la sonnette à chauque
        // changement d'exercice
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown(); // il faut penser à tjs
          // jouer la fonction pour afficher les éléments
        } else {
          // si il n'y a plus d'exercice écran de fin
          return page.finish(); // quand on met return celà
          // celà coupe toute la fonction
        }
      } else if (this.seconds === "00") {
        // règle pour les minutes
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        // règle pour les secondes
        this.seconds--;
        this.updateCountdown();
      }
    }, 1000);

    // on va créer l'affichage en injectant des valeurs dynamique
    // en fonction des valeurs de nos index
    return (main.innerHTML = `
        <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="./img/${exerciceArray[this.index].pic}.png" />
        <div>${this.index + 1}/${exerciceArray.length}</div>
        </div>`);
  }

  ring() {
    // création de la fonction de la sonnette
    const audio = new Audio(); // on utilise l'ojbet Audio de JS
    audio.src = "ring.mp3";
    audio.play();
  }
}

// 3) DECLARATION DES FONCTIONS
// que l'on va stocker dans un objets

const utils = {
  // 1) création d'une fonction qui changera les éléments
  // du DOM dynamiquement pour faire des changements de page
  // que codera ensuite dans la partie objet
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },

  handleEventMinutes: function () {
    // on va créer une fonction pour pouvoir changer le nombre
    // de minute dynamiquement via le dom (et dans notre tableau aussi)
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            // il faut seulement mettre == car
            // on compare des string et pas des number
            // on va comparer ce qui est cliqué avec notre bouton
            // pour agir sur le bon bouton
            exo.min = parseInt(e.target.value); // on veut faire en sorte que
            // lorsque on clique sur le timer on accède au tableau
            // et pour qu'il change le nombre de minutes
            // parseInt nous permet de passer en number au lieu de string
            this.store();
          }
        });
      });
    });
  },

  handleEventArrow: function () {
    // on va crér une fonction pour déplacer
    // l'exrcice (dans le tableau) en cliquant sur la flèche
    document.querySelectorAll(".arrow").forEach((arrow) => {
      // on va passer par la class arrow que l'on a rajouter via l'iner
      // html
      arrow.addEventListener("click", (e) => {
        let position = 0; // on créer une variable pour
        // pouvoir incrémenter la position dans le tableau
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            // si exo pic = la dataset de la fleche sur laquelle je
            // click et que position n'est pas égal à 0
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            // permet d'intervertir la position des 2 éléments dans le
            // tableau
            page.lobby(); // on relance notre fonction d'affichage
            // pour voir les éléments bouger visuellement
            this.store();
          } else {
            position++;
          }
        });
      });
    });
  },

  deleteItem: function () {
    // on va creer un fonction pour les boutons croix pour qu'il supprime
    // l'élement de notre tableaux
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let newArr = []; // on va creer un nouveau tableau dans
        // lequelle on va modifier les supressions
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            // si le n° de l'exo est égal au dataset du bouton
            newArr.push(exo);
            // sort du nouveau tableau l'exo
          }
        });
        exerciceArray = newArr;
        // on transfet les informations du nouveau tableau
        page.lobby(); // et on relance notre fonction d'affichage
        // pour l'afficher dynamiquement
        this.store(); // commande pour lancer la fonction store
        // this parce qu'on est déjà dans utils
      });
    });
  },
  reboot: function () {
    // on va creer un fonction pour remettre tout à zéro
    // pour celà on va conserver un tableau vierge avec tout les éléments
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },
  store: function () {
    // on va créer une fonction pour récuperer le local
    // storage pour le transmettre au démarrage
    localStorage.exercices = JSON.stringify(exerciceArray);
    // on devra lancer cette fonction a chaque fois qu'il y a des
    // modifications sur le tableau pour avoir une sauvegarde dynamique
    // pour que le locale storage puisse lire les éléments et les
    // retranscrire il faut lui transmettre en JSON
    // c'est pour celà que l'on transforme le tableau
    // sinon celà ne marche pas
  },
};

// 4) DECLARATION DES OBJETS
// ou l'on va créer la va coder les 3 pages à animer dynamiquement
// avec la fonction pageContent

const page = {
  lobby: function () {
    // page 1 le loby
    let mapArray = exerciceArray // on va vouloir utuliser notre tableau
      // pour faire apparaître les images et d'autre éléments
      // dynamiquement grâce au tableau
      .map(
        (exo) =>
          `
          <li>
      <div class="card-header">
      <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
      <span>min</span>
      </div>
      <img src="./img/${exo.pic}.png" />
      <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
      <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
      </li>
      `
      )
      .join("");

    utils.pageContent(
      // on rentre chaque éléments dynamique dans l'objet
      "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    // on la met ici car on va l'utiliser plusieurs fois
    start.addEventListener("click", () => this.routine());
    // va permettre que lorsque l'on click on change de page
  },
  routine: function () {
    // 2eme page celle avec le chrono
    const exercice = new Exercice();
    // on créer une boîte qui va conserver tout les exercices qu'il va
    // devoir jouer
    utils.pageContent("Routine", exercice.updateCountdown(), null);
    // pas de bouton donc on doit le déclarer null
  },
  finish: function () {
    // 3eme page final avec boutons pour relance
    utils.pageContent(
      "C'est terminé !",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinitialiser <i class='fas fa-times-circle'></i></button>"
    ); // on peut même coder un bouton qui s'injectera dynamiquement
    // Maintentant ajouter des événements à nos boutons
    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => utils.reboot());
    // on a déjà coder les fonctions on  juste à adosser le bon
    // event au bon bouton
  },
};

page.lobby();

class Card {
  #league;
  #gameStatus;
  #isGameLive;
  #gameScore;
  #homeLogo;
  #awayLogo;
  #isDoubleHeader;
  #game2Status;
  #isGame2Live;
  #game2Score;

  /**
   * Creates a Card object using the blob dictionary
   * @param {object} blob dictionary with specific api data
   */
  constructor(blob) {
    this.#league = blob["League"];
    this.#gameStatus = blob["GameStatus"];
    this.#isGameLive = blob["isGameLive"];
    this.#gameScore = blob["GameScore"];
    this.#homeLogo = blob["HomeLogo"];
    this.#awayLogo = blob["AwayLogo"];
    this.#isDoubleHeader = blob["isDoubleHeader"];
    if (this.#isDoubleHeader) {
      this.#game2Status = blob["Game2Status"];
      this.#isGame2Live = blob["isGame2Live"];
      this.#game2Score = blob["Game2Score"];
    }
  }

  /**
   * Constructs a container box inside the card to store game score and logos
   * @param {String} name name of previous div to check for doubleheader condition
   * @returns scoreContainer div with logos and score
   */
  #makeContainer(name) {
    let scoreContainer = document.createElement("div");
    let away_img = document.createElement("img");
    let score = document.createElement("span");
    let home_img = document.createElement("img");

    away_img.className = `logo ${this.#league}-away-logo`;
    away_img.src = this.#awayLogo;
    score.className = `${this.#league}-score`;
    if (this.#isDoubleHeader && name.includes("2")) {
      score.textContent = this.#game2Score;
    } else {
      score.textContent = this.#gameScore;
    }
    home_img.className = `logo ${this.#league}-home-logo`;
    home_img.src = this.#homeLogo;

    scoreContainer.className = "score-container";
    scoreContainer.appendChild(document.createElement("br"));
    scoreContainer.appendChild(away_img);
    scoreContainer.appendChild(score);
    scoreContainer.appendChild(home_img);

    return scoreContainer;
  }

  /**
   * Creates the card div whilst also calling makeContainer
   * @param {String} name name of div to check for doubleheader condition
   * @returns a div object with header, game status, and container items
   */
  #makeCard(name) {
    let div = document.createElement("div");
    let head = document.createElement("h3");
    let p = document.createElement("p");

    div.className = "card";
    div.id = name;
    head.textContent = `${this.#league.toUpperCase()}`;
    p.className = `${this.#league}-status status`;
    if (this.#isDoubleHeader && name.includes("2")) {
      p.textContent = this.#game2Status;
    } else {
      p.textContent = this.#gameStatus;
    }
    if (
      (this.#isGameLive && name.includes("1")) ||
      (this.#isGame2Live && name.includes("2"))
    ) {
      p.style.color = "red";
    }
    if (name.includes("1")) {
      div.appendChild(head);
    }
    div.appendChild(p);
    div.appendChild(this.#makeContainer(name));
    return div;
  }

  /**
   * Returns a div object of Card
   */
  get div() {
    if (this.#isDoubleHeader) {
      let div1 = this.#makeCard(`${this.#league}1`);
      div1.appendChild(this.#makeCard(`${this.#league}2`));
      return div1;
    } else {
      return this.#makeCard(`${this.#league}1`);
    }
  }
}

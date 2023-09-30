class Card {
    #param;

    constructor(param) {
        this.#param = param;
    }

    #makeContainer() {
        const scoreContainer = document.createElement("div");
        const away_img = document.createElement("img")
        const score = document.createElement("span")
        const home_img = document.createElement("img")
        
        scoreContainer.className = "score-container";
        away_img.className = `logo ${this.#param}-away-logo`;
        score.className = `${this.#param}-score`;
        home_img.className = `logo ${this.#param}-home-logo`;

        scoreContainer.appendChild(document.createElement("br"))
        scoreContainer.appendChild(away_img)
        scoreContainer.appendChild(score)
        scoreContainer.appendChild(home_img)

        return scoreContainer;
    }

    #makeCard(name) {
        const div = document.createElement("div");
        const head = document.createElement("h3");
        const p = document.createElement("p");
        
        div.className = "card";
        div.id = name;
        
        if (name === "alert") {
            p.textContent = "No games today"
            return div
        }
        
        div.style.display = "none";
        head.textContent = `${this.#param.toUpperCase()}`
        p.className = `${this.#param}-status status`
        
        if (!name.includes("mlb2")) {
            div.appendChild(head);
        }
        
        div.appendChild(p);
        return div;
    }
    
    get div() {
        if (this.#param === "mlb") {
            const div = this.#makeCard(`${this.#param}1`);
            const div2 = this.#makeCard(`${this.#param}2`);
            const scoreContainer = this.#makeContainer();
            const scoreContainer2 = this.#makeContainer();

            div.appendChild(scoreContainer);
            div2.appendChild(scoreContainer2);
            div.appendChild(div2);

            return div
        } else {
            const div = this.#makeCard(`${this.#param}1`);
            const scoreContainer = this.#makeContainer();
            div.appendChild(scoreContainer);
            return div
        }
    }
}
const puppeteer = require("puppeteer");

const trainerStabScraper = url => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      let trainer_Stab = await page.evaluate(() => {
        let results = [];
        function obj() {
          (this.link = null),
            (this.fupa_id = null),
            (this.name = null),
            (this.vorname = null),
            (this.funktion = null);
        }
        let items = document.querySelectorAll(
          "div.team_trainerstab_container > a"
        );

        for (let i = 0; i < items.length; i++) {
          let element = items[i];
          const objElement = new obj();

          objElement.link = element.pathname;
          start = element.pathname.lastIndexOf("-") + 1;
          end = element.pathname.indexOf(".html");
          let id = element.pathname.substring(start, end);
          objElement.fupa_id = id;

          for (let j = 0; j < element.children.length; j++) {
            let element2 = element.children[j];
            for (let k = 0; k < element2.children.length; k++) {
              let element3 = element2.children[k];

              for (let l = 0; l < element3.children.length; l++) {
                const element4 = element3.children[l];

                if (element4.className == "name") {
                  objElement.name = element4.innerHTML;
                }
                if (element4.className == "vorname") {
                  objElement.vorname = element4.innerHTML;
                }
                if (element4.className == "team_trainerstab_bezeich") {
                  objElement.funktion = element4.innerHTML;
                }
              }
            }
          }
          results.push(objElement);
        }
        return results;
      });
      resolve(trainer_Stab);
    } catch (e) {
      resolve(e);
    }
  });
};

const spielerScraper = url => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      let spieler = await page.evaluate(() => {
        let results = [];
        function obj() {
          (this.link = null),
            (this.fupa_id = null),
            (this.name = null),
            (this.vorname = null),
            (this.funktion = null),
            (this.trikotnummer = null),
            (this.tore = null),
            (this.einsaetze = null);
        }
        let items = document.querySelectorAll("div.team_kader_container > a");

        for (let i = 0; i < items.length; i++) {
          let element = items[i];
          const objElement = new obj();

          objElement.link = element.pathname;
          start = element.pathname.lastIndexOf("-") + 1;
          end = element.pathname.indexOf(".html");
          let id = element.pathname.substring(start, end);
          objElement.fupa_id = id;

          for (let j = 0; j < element.children.length; j++) {
            let element2 = element.children[j];
            for (let k = 0; k < element2.children.length; k++) {
              let element3 = element2.children[k];

              for (let l = 0; l < element3.children.length; l++) {
                const element4 = element3.children[l];

                if (element4.className == "name") {
                  objElement.name = element4.innerHTML;
                }
                if (element4.className == "vorname") {
                  objElement.vorname = element4.innerHTML;
                }
                objElement.funktion = "Spieler";

                for (let m = 0; m < element4.children.length; m++) {
                  const element5 = element4.children[m];
                  if (element5.className == "trikot") {
                    objElement.trikotnummer = element5.innerHTML;
                  }
                  if (element5.className == "tor") {
                    objElement.tore = element5.innerHTML;
                  }
                  if (element5.className == "einsatz") {
                    objElement.einsaetze = element5.innerHTML;
                  }
                }
              }
            }
          }
          results.push(objElement);
        }
        return results;
      });
      resolve(spieler);
    } catch (e) {
      resolve(e);
    }
  });
};

const birthdayScraper = arr => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      let results = [];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        await page.goto(`https://www.fupa.net${element.link}`);

        let birthday = await page.evaluate(() => {
          let results = [];
          function obj() {
            (this.fupa_id = null), (this.geburtsdatum = null);
          }

          let items = document.querySelectorAll(
            "td.stammdaten > table > tbody > tr > td"
          );

          let objElement = new obj();
          let baseURI = items[0].baseURI;
          let start = baseURI.lastIndexOf("-") + 1;
          let end = baseURI.indexOf(".html");
          let fupa_id = baseURI.substring(start, end);
          objElement.fupa_id = fupa_id;

          for (let i = 0; i < items.length; i++) {
            let element = items[i];
            let j = i;
            if (element.innerHTML === "Geburtsdatum:") {
              objElement.geburtsdatum = items[j + 1].innerHTML;
              results.push(objElement);
            }
          }
          return results;
        });
        results.push(birthday);
      }
      resolve(results);
    } catch (e) {
      resolve(e);
    }
  });
};

module.exports = Object.assign(
  {},
  { trainerStabScraper, spielerScraper, birthdayScraper }
);

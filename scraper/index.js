const assert = require("assert");
const scrapers = require("./scrapers");

const scrape = db => {
  const col = db.collection("teamMembers");

  const countMembers = async () => {
    try {
      let r;
      r = await col.find({}).count();
      return r;
    } catch (err) {
      return err;
    }
  };

  const executeBirthdayScraper = async () => {
    let r = await col.find({}).toArray();
    let r2 = await scrapers.birthdayScraper(r);
    r2.forEach(element => {
      if (typeof element[0] === "object") {
        col.updateOne(
          { fupa_id: element[0].fupa_id },
          { $set: { geburtsdatum: element[0].geburtsdatum.slice(0, 10) } },
          function(err, r) {
            assert.equal(null, err);
          }
        );
      }
    });
  };

  const executeSpielerSrcaper = new Promise((resolve, reject) => {
    let spieler = scrapers.spielerScraper(
      "https://www.fupa.net/club/fc-stahl-brandenburg/team/m1"
    );
    resolve(spieler);
  });

  const executeTrainerStabSrcaper = new Promise((resolve, reject) => {
    let trainerStab = scrapers.trainerStabScraper(
      "https://www.fupa.net/club/fc-stahl-brandenburg/team/m1"
    );
    resolve(trainerStab);
  });

  const noData = () => {
    Promise.all([executeSpielerSrcaper, executeTrainerStabSrcaper])
      .then(values => {
        let data = values[0].concat(values[1]);
        data.forEach(element => {
          col.insertOne(
            {
              link: element.link,
              fupa_id: element.fupa_id,
              name: element.name,
              vorname: element.vorname,
              geburtsdatum: null,
              funktion: element.funktion,
              trikotnummer: element.trikotnummer,
              tore: element.tore,
              einsaetze: element.einsaetze,
              datum: new Date()
            },
            function(err, r) {
              assert.equal(null, err);
            }
          );
        });
      })
      .then(() => {
        console.log("hello");
        executeBirthdayScraper();
      });
  };

  const hasData = () => {
    Promise.all([executeSpielerSrcaper, executeTrainerStabSrcaper])
      .then(values => {
        let data = values[0].concat(values[1]);
        data.forEach(element => {
          col.deleteOne({ fupa_id: element.fupa_id }, function(err, r) {
            assert.equal(null, err);
          });
        });
        return data;
      })
      .then(r => {
        r.forEach(element => {
          col.insertOne(
            {
              link: element.link,
              fupa_id: element.fupa_id,
              name: element.name,
              vorname: element.vorname,
              geburtsdatum: null,
              funktion: element.funktion,
              trikotnummer: element.trikotnummer,
              tore: element.tore,
              einsaetze: element.einsaetze,
              datum: new Date()
            },
            function(err, r) {
              assert.equal(null, err);
            }
          );
        });
      })
      .then(() => {
        console.log("hello");
        executeBirthdayScraper();
      });
  };

  const scrape = r => {
    if (r === 0) {
      noData();
    } else {
      hasData();
    }
  };

  countMembers()
    .then(r => {
      scrape(r);
    })
    .catch(err => {
      return err;
    });
};

const connect = async connection => {
  try {
    if (!connection) {
      throw Error("connection db not supplied!");
    }
    scrape(connection);
  } catch (err) {
    return err;
  }
};

module.exports = Object.assign({}, { connect });

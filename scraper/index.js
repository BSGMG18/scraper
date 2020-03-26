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

  const insertMembers = data => {
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
  };

  const deleteMembers = data => {
    data.forEach(element => {
      col.deleteOne({ name: element.name, vorname: element.vorname }, function(
        err,
        r
      ) {
        assert.equal(null, err);
      });
    });
  };

  const findAndUpdateMembers = async () => {
    let r = await col.find({}).toArray();
    console.log(r);
    for (let i = 0; i < r.length; i++) {
      const element = r[i];
      let r2 = await scrapers.birthdayScraper(
        `https://www.fupa.net${element.link}`
      );
      console.log(r2);
    }
  };

  /* for (let i = 0; i < r.length; i++) {
        const element = r[i];
        let r2 = await scrapers.birthdayScraper(
          `https://www.fupa.net${element.link}`
        );
        col.updateOne(
          { fupa_id: r2.fupa_id },
          { $set: { geburtsdatum: r2.geburtsdatum } }
        );
      } */

  const scrapeAndExecute = async fn => {
    let trainerStab = await scrapers.trainerStabScraper(
      "https://www.fupa.net/club/fc-stahl-brandenburg/team/m1"
    );
    let spieler = await scrapers.spielerScraper(
      "https://www.fupa.net/club/fc-stahl-brandenburg/team/m1"
    );
    fn(trainerStab);
    fn(spieler);
  };

  const noDataInsert = async () => {
    await scrapeAndExecute(insertMembers);
    await findAndUpdateMembers();
  };

  const deleteAndInsert = async () => {
    await scrapeAndExecute(deleteMembers);
    await scrapeAndExecute(insertMembers);
    await findAndUpdateMembers();
  };

  const scrape = r => {
    if (r === 0) {
      noDataInsert();
    } else {
      deleteAndInsert();
      console.log("collection has data");
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

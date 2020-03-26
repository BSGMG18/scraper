const db = require("./config/db");
const { EventEmitter } = require("events");
const event = new EventEmitter();
const scraper = require("./scraper");

event.on("db ready", db => {
  scraper.connect(db);
});

db.connect(event);

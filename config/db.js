const MongoClient = require("mongodb").MongoClient;

const connect = async event => {
  const url = "mongodb://172.17.0.2:27017/test";
  const dbName = "test";
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    console.log("Succesfully connected to MongoDB");
    const db = client.db(dbName);
    event.emit("db ready", db);
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = Object.assign({}, { connect });

// import all required packages
const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rick-and-morty-news.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref();

//_______________________________________________________
//
// Functions
//
//_______________________________________________________

function getArticle(url) {
  ref = db.ref(`articles/${url}`);
  return new Promise(resolve => {
    resolve(
      ref.once("value", snapshot => {
        return snapshot.val();
      })
    );
  });
}

function getAllTeasers() {
  ref = db.ref(`teasers`);
  return new Promise(resolve => {
    let arr = [];
    resolve(
      ref.once("value", snapshot => {
        for (const key in snapshot.val()) {
          arr.push(snapshot.val()[key]);
        }
        //console.log("!!! ---------------  HERE  --------------- !!", arr);
        return arr;
      })
    );
  });
}
//_______________________________________________________

const app = express();
app.use(cors());
port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
app.get("/teasers", async (req, res) => {
  const teasers = await getAllTeasers();
  res.json({ teasers });
});

app.get("/articles", async (req, res) => {
  const allArticles = await getAllArticles();
  res.json({ allArticles });
});

app.get("/articles/:url", async (req, res) => {
  const article = await getArticle(req.params.url);
  console.log("ARTICLE", article);
  res.json({
    article
  });
});

app.get("/", (req, res) => {
  res.send("hello Node API");
});

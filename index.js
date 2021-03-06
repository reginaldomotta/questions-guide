const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

connection
    .authenticate()
    .then(() => {
        console.log("Connection ON!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/question", (req, res) => {
    res.render("question");
})

app.post("/savequestion", (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    res.send("Formulário recebido! título " + title + " " + " descrição " + description);
});


app.listen(3333, () => { console.log("App running!"); });
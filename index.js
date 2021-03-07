/**
 * Frameworks and Libraries
 */
const express = require('express');
const connection = require("./database/database");
const Question = require("./models/Question")
const Answer = require("./models/Answer")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Connection database
 */
connection
    .authenticate()
    .then(() => {
        console.log("Connection ON!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

/**
 * EJS 
 */
app.set('view engine', 'ejs');
app.use(express.static('public'));


/**
 * Rotes
 * */
app.get("/", (req, res) => {
    Question.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(questions => {
        res.render("index", {
            questions: questions
        });
    });
});

app.get("/toask", (req, res) => {
    res.render("toask");
});

app.post("/savequestion", (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/question/:id", (req, res) => {
    var id = req.params.id;
    Question.findOne({
        where: { id: id }
    }).then(question => {
        if (question != undefined) {

            Answer.findAll({
                where: { questionId: question.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then(answers => {
                res.render("question", {
                    question: question,
                    answers: answers
                });
            });

        } else {
            res.redirect("/");
        }
    });
})

app.post("/answer", (req, res) => {
    var answerBody = req.body.answerBody;
    var questionId = req.body.question;
    Answer.create({
        answerBody: answerBody,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/" + questionId);
    });
});

/**
 * Server
 */
app.listen(3333, () => { console.log("App running!"); });
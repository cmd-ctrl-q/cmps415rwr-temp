var express = require("express");
var mongoose = require('mongoose');
var app = express();

// set up mongo connection 
const URL = "mongodb+srv://<username>:<password>@<cluster-name>.mis3d.mongodb.net/cmps415rwr?retryWrites=true&w=majority"
// get default connection 
var db = mongoose.connection; 

// export the connection for reuse
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});
    
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Schemas 
// Define quiz a schema 
var Schema = mongoose.Schema; 

var quizSchema = new Schema({
    title: String, 
    description: String,
    questions: Array
});

// create quiz model
// (collectionName, schemaName)
var Quiz = mongoose.model("quiz", quizSchema); 

// middleware 
app.use(express.json());

// ROUTES  

// Create new quiz 
app.post("/new/", function(req, res) {
 
    // 400 request error
    if(req.body.title === "" || req.body.description === "") {
        res.status(400).json( { msg: "request error" });
        return 
    }

    var newQuiz = new Quiz({ 
        title: req.body.title, 
        description: req.body.description,
        questions: JSON.parse(JSON.stringify(req.body.questions))
     });
    
    // newQuiz is the object name
    newQuiz.save(function(err, quiz) {
        if (err) return console.error(err);
        console.log("quiz inserted succussfully!");
        res.status(200).json({ msg: "Submission submitted successfully", quiz: quiz })
    });
});

// Get all quizzes
app.get("/quizzes", function(req, res) {
 
    // Quiz is the model name
    Quiz.find(function(err, quizzes) {
        if (err) return console.error(err);
        res.status(200).json({ quizzes: quizzes });
    });
});

// listen and serve on port 8080
var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("https");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/recipe/:keyword", function(req, res) {

    let url = '';

    if(req.params.keyword === 'random')
        url = "https://www.themealdb.com/api/json/v1/1/random.php";
    else
        url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+req.params.keyword;

    http.get(url, function(response) {
        console.log(response.statusCode);

        let chunks = [];

        response.on("data", function(data) {
            chunks.push(data);
        })
        response.on("end", function() {
            let data = Buffer.concat(chunks);
            const mealData = JSON.parse(data);
            console.log(mealData);

            if(mealData.meals === null) {
                console.log("keyword not valid... Retry")
            } else {
                let meal = {
                    name: mealData.meals[0].strMeal,
                    image: mealData.meals[0].strMealThumb,
                    cusine: mealData.meals[0].strArea,
                    category: mealData.meals[0].strCategory,
                    link: mealData.meals[0].strYoutube
                }

            res.render("recipe", meal);
            }
            
        })
    })
});


app.post("/search", function(req, res) {
    
    const keyword = req.body.keyword;

    res.redirect('/recipe/' + keyword);
})

app.listen(3000, function() {
    console.log("Server is running...");
})
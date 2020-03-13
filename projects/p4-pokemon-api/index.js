var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    // HINT: 
    var contents = "";
    var num = 1;
    _.each(_DATA, function(i) {
        contents += `<tr><td>${num}</td><td><a href="/pokemon/${num}">${i.name}</a></td></tr>\n`;
        num++;
    });
    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {    
    // HINT : 
    // <tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    var contents = "";
    for (var key in result) {
        contents += `<tr><td>${key}</td><td>${JSON.stringify(result[key])}</td></tr>\n`;
    }
    if (contents != "") {
        var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    } else {
        var html = "Error: Pokemon not found"
    }
    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (_.isEmpty(result)) {
        var html = "Error: Pokemon not found"
    } else {
        var html = `<html>\n<body>\n<img src="${result["img"]}">\n</body>\n</html>`;
    }
    res.send(html)
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var name = req.params.pokemon_name
    var evochain = []
    var result = _.findWhere(_DATA, { name: name })
    if (!(_.isEmpty(result))) {
        evochain.push(name);
        while (result.hasOwnProperty('prev_evolution')) {
            var prev = result['prev_evolution'][0]['name']
            evochain.push(prev);
            result = _.findWhere(_DATA, { name: prev})
        }
        result = _.findWhere(_DATA, { name: name })
        while (result.hasOwnProperty('next_evolution')) {
            var next = result['next_evolution'][0]['name']
            evochain.push(next);
            result = _.findWhere(_DATA, { name: next})
        }
    }
    evochain.sort();
    res.json(evochain);
});

app.get("/api/type/:type", function(req, res) {
    var type = req.params.type;
    var result = []
    _.each(_DATA, function(pokemon) {
        if (pokemon.type.includes(type)) {
            result.push(pokemon.name);
        }
    });
    res.json(result);
});

app.get("/api/type/:type/heaviest", function(req, res) {
    var type = req.params.type
    var heaviest = {}
    _.each(_DATA, function(pokemon) {
        if (pokemon.type.includes(type)) {
            var curr = pokemon.weight.match(/\d+/)
            if (_.isEmpty(heaviest) || heaviest.weight < parseInt(curr[0])) {
                heaviest["name"] = pokemon.name
                heaviest["weight"] = parseInt(curr[0])
            }
        }
    });
    res.json(heaviest);
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    var name = req.params.pokemon_name
    var weakness = req.params.weakness_name
    var result = {}
    _.find(_DATA, function(pokemon) {
        if (pokemon.name == name) {
            if(!pokemon.weaknesses.includes(weakness)) {
                pokemon.weaknesses.push(weakness);
            }
            result = {"name": name, "weaknesses": pokemon.weaknesses}
            return true;
        }
    });
    pokeDataUtil.saveData(_DATA);
    res.json(result);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var name = req.params.pokemon_name
    var weakness = req.params.weakness_name
    var result = {}
    _.find(_DATA, function(pokemon) {
        if (pokemon.name == name) {
            pokemon.weaknesses = _.without(pokemon.weaknesses, weakness)
            result = {"name": name, "weaknesses": pokemon.weaknesses}
            return true;
        }
    });
    pokeDataUtil.saveData(_DATA);
    res.json(result);
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT

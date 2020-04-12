var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
    // poke.json stores the pokemon array under key "pokemon", 
    // so we are recreating the same structure with this object
    var obj = {
        listings: data
    };

    fs.writeFileSync('data.json', JSON.stringify(obj));
}

function getAllType(type, data) {
    var filtered = [];
    for(var i = 0; i < data.length; i++) {
        var item_type = data[i].type;
        if (item_type == type) filtered.push(data[i]);
    }
    return filtered;
}

function getAlphabetical(data) {
    data.sort(function (a, b) {
        return ('' + a.item).localeCompare(b.item);
    })
    return data
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
    getAllType: getAllType,
    getAlphabetical: getAlphabetical
}

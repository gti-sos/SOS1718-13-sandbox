var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var port = (process.env.PORT || 1607);

var MongoClient = require("mongodb").MongoClient;

/////////VARIABLES API:
var motogpchampsApi = require("./motogpchampsApi");

/////////BASES DE DATOS:
var mdbMotoGPChamps = "mongodb://valentino:rossi@ds129939.mlab.com:29939/sos1718-13-motogpchamps";


var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname + "/public")));

app.get("/hello", (req, res) => {
    res.send("Hello World");
});


///////////////////////////////VARIABLES INICIALES:
var initialMotoGPChamps = [
    { "year": 1949, "country": "united_kingdom", "rider": "leslie_graham", "constructor": "ajs", "win": 2 },
    { "year": 1950, "country": "italy", "rider": "umberto_masetti", "constructor": "gilera", "win": 2 }
];



///////////////////////////////INICIALIZAR BASE DE DATOS:
MongoClient.connect(mdbMotoGPChamps, { native_parser: true }, (err, mlabs) => {
    if (err) {
        console.error("Error accesing motogpchamps DB: " + err);
        process.exit(1);
    }
    
    /////////////////////BASE DE DATOS MOTOGPCHAMPS:
    console.log("Connected to motogpchamps DB.");
    var MotoGPChampsdatabase = mlabs.db("sos1718-13-motogpchamps");
    var dbMotoGPChamps = MotoGPChampsdatabase.collection("motogpchamps");

    dbMotoGPChamps.find({}).toArray((err, contacts) => {
        if (err) {
            console.error("Error accesing DB");
            process.exit(1);
        }
        if (contacts.length == 0) {
            console.log("Empty DB");
            dbMotoGPChamps.insert(initialMotoGPChamps);
        }
        else {
            console.log("DB has " + contacts.length + " contacts");
        }
    });
    motogpchampsApi.register(app,dbMotoGPChamps,initialMotoGPChamps);
    ////////////////////////////////////////////////////////////////////////////

    
    app.listen(port, () => {
        console.log("Server ready on port " + port + "!");
    }).on("error", (e) => {
        console.log("Server NOT ready: " + e + "!");
    });
});

console.log("Server OK");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var port = (process.env.PORT || 1607);

var MongoClient = require("mongodb").MongoClient;


/////////VARIABLES API:
var motogpchampsApi = require("./motogpchampsApi");
var fonedriversApi = require("./fonedriversApi");

/////////BASES DE DATOS:
var mdbMotoGPChamps = "mongodb://valentino:rossi@ds129939.mlab.com:29939/sos1718-13-motogpchamps";
var mdbFOneDrivers = "mongodb://alfgutrom:alfgutrom1.@ds231559.mlab.com:31559/sos1718-agr-sandbox";


var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname + "/public")));

app.get("/hello", (req, res) => {
    res.send("Hello World");
});


///////////////////////////////VARIABLES INICIALES:
var initialMotoGPChamps = [
    { "year": 1949, "country": "united_kingdom", "rider": "leslie_graham", "constructor": "ajs", "win": 2 },
    { "year": 1950, "country": "italy", "rider": "umberto_masetti", "constructor": "gilera", "win": 2 },
    { "year": 1951, "country": "united_kingdom", "rider": "geoff_duke", "constructor": "norton", "win": 4 },
    { "year": 1952, "country": "italy", "rider": "umberto_masetti", "constructor": "gilera", "win": 2 },
    { "year": 1953, "country": "united_kingdom", "rider": "geoff_duke", "constructor": "gilera", "win": 4 },
    
];
var initialF_one_drivers = [
{"year": 1950,"driver": "Giuseppe Farina","age": 44,"team": "Alfa Romeo","engine": "Alfa Romeo","win": 3,
"point": 30,"race": "Italian Grand Prix","country": "Italy"}, 

{"year": 1951,"driver": "Juan Manuel Fangio","age": 40,"team": "Alfa Romeo","engine": "Alfa Romeo","win": 3,
"point": 31,"race": "Spanish Grand Prix","country": "Argentina"}, 

{"year": 1952,"driver": "Alberto Ascari","age": 34,"team": "Ferrari","engine": "Ferrari","win": 6,
"point": 36,"race": "German Grand Prix","country": "Italy"}, 

{"year": 1953,"driver": "Alberto Ascari","age": 35,"team": "Ferrari","engine": "Ferrari","win": 5,
"point": 34,"race": "Swiss Grand Prix","country": "Italy"}, 

{"year": 1954,"driver": "Juan Manuel Fangio","age": 43,"team": "Maserati","engine": "Maserati","win": 6,
"point": 42,"race": "Swiss Grand Prix","country": "Argentina"}];
                    
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

    dbMotoGPChamps.find({}).toArray((err, champs) => {
        if (err) {
            console.error("Error accesing DB");
            process.exit(1);
        }
        if (champs.length == 0) {
            console.log("Empty DB Principal");
            //dbMotoGPChamps.insert(initialMotoGPChamps);
        }
        else {
            console.log("MotoGPChampsDB has " + champs.length + " MotoGPChamps.");
        }
    });
    motogpchampsApi.register(app, dbMotoGPChamps, initialMotoGPChamps);
});
    /////////////////////BASE DE DATOS F-ONE-DRIVERS:
        MongoClient.connect(mdbFOneDrivers, { native_parser: true }, (err, mlabs) => {
    if (err) {
        console.error("Error accesing f-one-drivers DB: " + err);
        process.exit(1);
    }
    console.log("Connected to f-one-drivers DB.");
    var fonedriversdatabase = mlabs.db("sos1718-agr-sandbox");
    var dbFOneDrivers = fonedriversdatabase.collection("drivers");

    dbFOneDrivers.find({}).toArray((err, drivers) => {
        if (err) {
            console.error("Error accesing DB");
            //process.exit(1);
        }
        if (drivers.length == 0) {
            console.log("Empty DB Principal");
        }
        else {
            console.log("F-One-Drivers DB has " + drivers.length + " F-One-Drivers.");
        }
    });
    fonedriversApi.register(app, dbFOneDrivers, initialF_one_drivers);});
    ////////////////////////////////////////////////////////////////////////////


    app.listen(port, () => {
        console.log("Server ready on port " + port + "!");
    }).on("error", (e) => {
        console.log("Server NOT ready: " + e + "!");
    });
console.log("Server OK");
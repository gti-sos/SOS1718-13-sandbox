var motogpchampsApi = {};
var BASE_API_PATH = "/api/v1";

module.exports = motogpchampsApi;



motogpchampsApi.register = function(app, db, initialMotoGPChampions) {
    console.log("Registering routes for motogpchampsApi. ");


    app.get(BASE_API_PATH + "/motogpchamps/loadInitialData", (req, res) => {
        db.find({}, (err, motogpchampions) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
            }
            if (motogpchampions.length == 0) {
                console.log("Empty DB");
                db.insert(initialMotoGPChampions);
                res.sendStatus(200);
            }
            else {
                console.log("DB initialized with " + motogpchampions.length + " Moto GP Champions.");
            }
        });
    });

    
    // Hacer un  GET a COLLECTION:
    app.get(BASE_API_PATH + "/motogpchamps", (req, res) => {
        console.log(Date() + " - GET /motogpchamps");

        db.find({}).toArray((err, motogpchamps) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
                return;
            }
            res.send(motogpchamps.map((c)=>{
                delete c._id;
                return c;
            }));
        });
    });
    // Hacer un  POST a COLLECTION
    app.post(BASE_API_PATH + "/motogpchampions", (req, res) => {
        console.log(Date() + " - POST /motogpchampions");
        var champion = req.body;
        initialMotoGPChampions.push(champion);
        res.sendStatus(201);
    });
    //Hacer un PUT a COLLECTION
    app.put(BASE_API_PATH + "/motogpchampions", (req, res) => {
        console.log(Date() + " - PUT /motogpchampions");
        res.sendStatus(405);
    });
    //Hacer un DELETE a COLLECTION
    app.delete(BASE_API_PATH + "/motogpchampions", (req, res) => {
        console.log(Date() + " - DELETE /motogpchampions");
        initialMotoGPChampions = [];

        db.remove({});

        res.sendStatus(200);
    });



    //Hacer un GET a RECURSO CONCRETO
    app.get(BASE_API_PATH + "/motogpchampions/:country", (req, res) => {
        var country = req.params.country;
        console.log(Date() + " - GET /contacts/" + country);

        res.send(initialMotoGPChampions.filter((c) => {
            return (c.country == country);
        })[0]);
    });
    //Hacer un DELETE a RECURSO CONCRETO
    app.delete(BASE_API_PATH + "/motogpchampions/:year", (req, res) => {
        var year = req.params.year;
        console.log(Date() + " - DELETE /motogpchampions/" + year);

        initialMotoGPChampions = initialMotoGPChampions.filter((c) => {
            return (c.year != year);
        });

        res.sendStatus(200);
    });
    //Hacer un POST a RECURSO CONCRETO
    app.post(BASE_API_PATH + "/motogpchampions/:year", (req, res) => {
        var year = req.params.year;
        console.log(Date() + " - POST /motogpchampions/" + year);
        res.sendStatus(405);
    });
    //Hacer un PUT a RECURSO CONCRETO
    app.put(BASE_API_PATH + "/motogpchampions/:year", (req, res) => {
        var year = req.params.year;
        var champion = req.body;

        console.log(Date() + " - PUT /motogpchampions/" + year);

        if (year != champion.year) {
            res.sendStatus(409);
            console.warn(Date() + " - Hacking attempt!");
            return;
        }
        db.update({ "year": champion.year }, champion, (err, numUpdated) => {
            console.log("Update: " + numUpdated);
        });

        res.sendStatus(200);
    });

    


}

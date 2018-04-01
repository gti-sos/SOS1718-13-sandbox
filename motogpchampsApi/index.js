var motogpchampsApi = {};
var BASE_API_PATH = "/api/v1";

module.exports = motogpchampsApi;

motogpchampsApi.register = function(app, db, initialMotoGPChamps) {
    console.log("Registering routes for motogpchampsApi. ");


    app.get(BASE_API_PATH + "/motogpchamps/loadInitialData", (req, res) => {
        db.find({}).toArray((err, motogpchampions) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
                return;
            }
            if (motogpchampions.length == 0) {
                console.log("Empty DB (InitialData)");
                db.insert(initialMotoGPChamps);
                res.sendStatus(200);
            }
            else {
                console.log("DB has " + motogpchampions.length + " Moto GP Champions.");
            }
        });
    });
    //GET a COLECCIÓN:
    app.get(BASE_API_PATH + "/motogpchamps", (req, res) => {
        console.log(Date() + " - GET /motogpchamps");

        db.find({}).toArray((err, motogpchamps) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
                return;
            }
            res.send(motogpchamps.map((c) => {
                delete c._id;
                return c;
            }));
        });
    });
    //POST a COLLECCIÓN:
    app.post(BASE_API_PATH + "/motogpchamps", (req, res) => {
        console.log(Date() + " - POST /motogpchamps");
        var champion = req.body;
        initialMotoGPChampions.push(champion);
        res.sendStatus(201);
    });
    //PUT a COLLECCIÓN:
    app.put(BASE_API_PATH + "/motogpchamps", (req, res) => {
        console.log(Date() + " - PUT /motogpchamps");
        res.sendStatus(405);
    });
    //DELETE a COLLECCIÓN:
    app.delete(BASE_API_PATH + "/motogpchamps", (req, res) => {
        console.log(Date() + " - DELETE /motogpchamps");

        db.find({}).toArray((err, motogpchamps) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
                return;
            }
            if (motogpchamps.length == 0) {
                res.sendStatus(404);
            }
            else {
                db.remove({}, { multi: true });
                res.sendStatus(200);
            }
        });
    });







    //GET a RECURSO CONCRETO:
    app.get(BASE_API_PATH + "/motogpchamps/:rider", (req, res) => {
        var rider = req.params.rider;
        console.log(Date() + " - GET /motogpchamps/" + rider);

        db.find({ "rider": rider }).toArray((err, champs) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
                return;
            }
            res.send(champs.map((c) => {
                delete c._id;
                return c;
            })[0]);
        });
    });

    //DELETE a RECURSO CONCRETO:
    app.delete(BASE_API_PATH + "/motogpchamps/:year", (req, res) => {
        var year = req.params.year;
        console.log(Date() + " - DELETE /motogpchamps/" + year);

        initialMotoGPChampions = initialMotoGPChampions.filter((c) => {
            return (c.year != year);
        });

        res.sendStatus(200);
    });
    //Hacer un POST a RECURSO CONCRETO
    app.post(BASE_API_PATH + "/motogpchamps/:year", (req, res) => {
        var year = req.params.year;
        console.log(Date() + " - POST /motogpchamps/" + year);
        res.sendStatus(405);
    });
    //Hacer un PUT a RECURSO CONCRETO
    app.put(BASE_API_PATH + "/motogpchamps/:year", (req, res) => {
        var year = req.params.year;
        var champion = req.body;

        console.log(Date() + " - PUT /motogpchamps/" + year);

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

var express = require("express");
var bodyParser = require("body-parser");
var DataStore = require("nedb");
var path = require("path"); 

var app = express();
var port = (process.env.PORT || 1607);

var BASE_API_PATH = "/api/v1";
//var BASE_API_PATH_MOTOGPCHAMPIONS = BASE_API_PATH+"/motogpchampions";

//Simulación de base de datos en fichero:
var dbMotoGPChampions = __dirname+"/motogpchampions.db";


app.use(bodyParser.json());
app.use("/",express.static(path.join(__dirname+"/public")));

app.get("/hello",(req,res)=>{
    res.send("Hello World");
});

///////////////////////////////VARIABLES INICIALES:
var initialMotoGPChampions = [
        { "year" : 1949, "country" : "united_kingdom", "rider": "leslie_graham", "constructor": "ajs", "win": 2},
        { "year" : 1950, "country" : "italy", "rider": "umberto_masetti", "constructor": "gilera", "win": 2}
    ];
///////////////////////////////INICIALIZAR BASE DE DATOS:
var dbMotoGPChampions = new DataStore({
    filename: dbMotoGPChampions,
    autoload: true                
});

dbMotoGPChampions.find({},(err,motogpchampions)=>{
    if(err){
    console.error("Error accesing DB");
    process.exit(1);  
    }
    if(motogpchampions.length == 0){
        console.log("Empty DB");
        dbMotoGPChampions.insert(initialMotoGPChampions);
    }else{
        console.log("DB initialized with "+motogpchampions.length+" Moto GP Champions.");
    }
});    
/////////////////////////////////////////////////////////////ACCIONES PARA LA DB MOTOGPCHAMPIONS DE ALEJANDRO:
// Hacer un  GET a COLLECTION:
app.get(BASE_API_PATH+"/motogpchampions",(req,res) => {
    console.log(Date() + " - GET /motogpchampions");
    
    dbMotoGPChampions.find({},(err,motogpchampions)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
            return;
        }
        res.send(motogpchampions);
    });    
});
// Hacer un  POST a COLLECTION
app.post(BASE_API_PATH+"/motogpchampions",(req,res)=>{
    console.log(Date() + " - POST /motogpchampions");
    var champion = req.body;
    initialMotoGPChampions.push(champion);
    res.sendStatus(201);
});
//Hacer un PUT a COLLECTION
app.put(BASE_API_PATH+"/motogpchampions",(req,res)=>{
    console.log(Date() + " - PUT /motogpchampions");
    res.sendStatus(405);
});
//Hacer un DELETE a COLLECTION
app.delete(BASE_API_PATH+"/motogpchampions",(req,res)=>{
    console.log(Date() + " - DELETE /motogpchampions");
    initialMotoGPChampions = [];
    
    dbMotoGPChampions.remove({});
    
    res.sendStatus(200);
});



//Hacer un GET a RECURSO CONCRETO
app.get(BASE_API_PATH+"/motogpchampions/:country",(req,res)=>{
    var country = req.params.country;
    console.log(Date() + " - GET /contacts/"+country);
    
    res.send(initialMotoGPChampions.filter((c)=>{
        return (c.country == country);
    })[0]);
});
//Hacer un DELETE a RECURSO CONCRETO
app.delete(BASE_API_PATH+"/motogpchampions/:year",(req,res)=>{
    var year = req.params.year;
    console.log(Date() + " - DELETE /motogpchampions/"+year);
    
    initialMotoGPChampions = initialMotoGPChampions.filter((c)=>{
        return (c.year !=year);
    });
    
    res.sendStatus(200);
});
//Hacer un POST a RECURSO CONCRETO
app.post(BASE_API_PATH+"/motogpchampions/:year",(req,res)=>{
    var year = req.params.year;
    console.log(Date() + " - POST /motogpchampions/"+year);
    res.sendStatus(405);
});
//Hacer un PUT a RECURSO CONCRETO
app.put(BASE_API_PATH+"/motogpchampions/:year",(req,res)=>{
    var year = req.params.year;
    var champion = req.body;
    
    console.log(Date() + " - PUT /motogpchampions/"+year);
    
    if(year != champion.year){
        res.sendStatus(409);
        console.warn(Date()+" - Hacking attempt!");
        return;
    }
    dbMotoGPChampions.update({"year": champion.year},champion,(err,numUpdated)=>{
        console.log("Update: "+numUpdated);
    });

    res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




















app.listen(port,()=>{
    console.log("Server ready on port "+port+ "!");
}).on("error",(e)=>{
     console.log("Server NOT ready: "+e+"!");   
});

var fonedriversApi = {};
var BASE_API_PATH = "/api/v1";

module.exports = fonedriversApi;

fonedriversApi.register = function(app, db, initialF_one_drivers) {
    console.log("Registering routes for fonedriversApi. ");


    app.get(BASE_API_PATH+"/f-one-drivers/loadInitialData",(req,res)=>{
    console.log(Date() + " - Trying to load 5 drivers");
    
    //find{name: "loquesea"} o {} para todos
db.find({}).toArray((err,f_one_drivers)=>{
    if(err){
        console.error("Error acceso DB");
        res.sendStatus(500);
                return;
        //process.exit(1);//Cierra el servidor
    }
    if(f_one_drivers.length==0){
        console.log("Empty DB");
        db.insert(initialF_one_drivers);
        console.log("DB initialized with " + f_one_drivers.length + " drivers" );
        res.sendStatus(201);
        
    }else{
        console.log("DB already have " + f_one_drivers.length + " drivers" );
    }
    res.redirect(BASE_API_PATH+"/f-one-drivers");
});

});
//GET a ruta base
app.get(BASE_API_PATH+"/f-one-drivers",(req,res)=>{
    console.log(Date() + " - GET / f-one-drivers");
    
    db.find({}).toArray((err,f_one_drivers)=>{
    if(err){
        console.error("Error acceso DB");
        res.sendStatus(500);
        return;
    }
        
    res.send(f_one_drivers.map((c)=>{delete c._id;return c;}));
    });

});

//GET a un recurso
app.get(BASE_API_PATH+"/f-one-drivers/:year",(req,res)=>{
    var year = req.params.year;
    
    console.log(Date() + " - GET / f-one-drivers/" + year);
    db.find({"year" : parseInt(year)}).toArray((err,driver)=>{
    if(err){
        console.error("Error acceso DB");
        res.sendStatus(500);
        return;
    }
    res.send(driver.map((c)=>{delete c._id;return c;}));
    });
    
    /*res.send(f_one_drivers.filter((c)=>{
        return (c.year==year);
        
    })[0]);*/
});

//GET a un recurso con 2 parametros
app.get(BASE_API_PATH+"/f-one-drivers/:driver/:year/",(req,res)=>{
    var year = req.params.year;
    var driver = req.params.driver;
    
    console.log(Date() + " - GET / f-one-drivers/" +driver + "/"+year);
    res.send(year);
});

//POST a ruta base
app.post(BASE_API_PATH+"/f-one-drivers",(req,res)=>{
    console.log(Date() + " - POST / f-one-drivers");
    var driver = req.body;
    db.insert(driver);
    //f_one_drivers.push(driver);
    res.sendStatus(201); //Created
});

//POST a un recurso
app.post(BASE_API_PATH+"/f-one-drivers/:year",(req,res)=>{
    var year = req.params.year;
    
    console.log(Date() + " - POST / f-one-drivers/" + year);
    res.sendStatus(405);//Method Not Allowed
});


//PUT a ruta base
app.put(BASE_API_PATH+"/f-one-drivers",(req,res)=>{
    console.log(Date() + " - PUT / f-one-drivers");
    res.sendStatus(405);//Method Not Allowed
});

//PUT a un recurso
app.put(BASE_API_PATH+"/f-one-drivers/:year",(req,res)=>{
    var year = req.params.year;
    var driver = req.body;
    
    console.log(Date() + " - PUT / f-one-drivers/" + year);
        if(year != driver.year){
        res.sendStatus(409);//Conflict
        console.warn(Date() + " - Hacking attempt!");
        return;
    }
    db.update({"year" : parseInt(driver.year,10)},driver,(err,numUpdate)=>{console.log("Updated: " + numUpdate);});

    /*f_one_drivers = f_one_drivers.map((c)=>{
        if(c.year==driver.year)
            return driver;
            else
            return c;
        
    });*/
    
    res.sendStatus(200);//OK
});

//DELETE a ruta base
app.delete(BASE_API_PATH+"/f-one-drivers",(req,res)=>{
    console.log(Date() + " - DELETE / f-one-drivers");
    //f_one_drivers = [];
    
    db.remove({},{multi:true});
    
    res.sendStatus(200);//OK
});

//DELETE a un recurso
app.delete(BASE_API_PATH+"/f-one-drivers/:year",(req,res)=>{
    var year = req.params.year;
    
    console.log(Date() + " - DELETE / f-one-drivers/" + year);
    db.remove({year : parseInt(year)});
    /*f_one_drivers = f_one_drivers.filter((c)=>{
        return (c.year!=year);
        
    });*/
    res.sendStatus(200);//OK
});


}

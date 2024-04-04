const express = require("express");
const bodyParser = require ("body-parser");
const { find } = require("@mapbox/node-pre-gyp");
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());



class Envelope {
    constructor(numID, budgetInpt, titleInpt){
        this.numericalID = numID;
        this.budget = budgetInpt;
        this.title = titleInpt;
    }
}

let envelopes = []
let totalBudget = [];

const PORT = 3000;



app.get("/",(req,res,next) => {
    res.send("Hello, World.");
})


app.get("/envelopes",(req,res,next) => {
    
    res.send(envelopes);
    
})

app.post("/envelopes/add",(req,res,next) =>{
    console.log("WORKS")
    let newEnvelope = new Envelope(req.body.envelope.numericalID, req.body.envelope.budget, req.body.envelope.title);

    envelopes.push(newEnvelope);
    totalBudget.push(req.body.envelope.budget);
    
    console.log("\n" + totalBudget + "\n"); 
    console.log(envelopes);
    
});

app.get("/envelopes/:id", (req,res,next) => {
    const parameter = req.params.id
    
    const whatToSend = envelopes.find(envelope => envelope.numericalID === parameter);

    if (whatToSend){
        res.send(whatToSend);
    }else{
        res.status(404).send("Not Found!");
    }
    
});

app.post("/envelopes/:id/change", (req,res,next) => {
    const parameter = req.params.id;
    
    const whatToSend = envelopes.find(envelope => envelope.numericalID === parameter);

    if (whatToSend){

        if(req.body.envelope.budget != undefined ){
            whatToSend.budget = req.body.envelope.budget;
        }

        if(req.body.envelope.numericalID != undefined){
            whatToSend.numericalID = req.body.envelope.numericalID;
        }

        if (req.body.envelope.title != undefined){
            whatToSend.title = req.body.envelope.title;
        }

        res.status(302).send("Found: \n" + whatToSend.budget + whatToSend.title + whatToSend.numericalID);
        
    }else{
        
        let newEnvelope = new Envelope();

        if(req.body.envelope.budget != undefined  ){
        newEnvelope.budget = req.body.envelope.budget;

        }
        if(req.body.envelope.numericalID != undefined){
        newEnvelope.numericalID = req.body.envelope.numericalID;

        }
        if (req.body.envelope.title != undefined){
        newEnvelope.title = req.body.envelope.title;
        }
        envelopes.push(newEnvelope);
        console.log(envelopes);
        res.send(newEnvelope);
    }

});

app.delete("/envelopes/:id/delete", (req,res,next) => {
    const parameter = req.params.id;

    const whatToDelete = envelopes.find(envelope => envelope.numericalID === parameter);

    console.log("This needs to log: " + whatToDelete);

    if (whatToDelete){

        const delt1 = envelopes.indexOf(whatToDelete);
        const delt2 = totalBudget.indexOf(whatToDelete.budget);

        console.log(delt1);
        console.log(delt2);

        envelopes.splice(delt1, 1);
        totalBudget.splice(delt2, 1);

        console.log(envelopes);
        console.log(totalBudget);

        res.status(410).send("Deleted!");
    }else{
        res.status(404).send("Not Found!");
    }

});


app.post("/envelopes/:from/transfer/:to", (req,res,next) => {

    const from = req.params.from;
    const to = req.params.to;

    const fromWhatToChange = envelopes.find(envelope => envelope.numericalID === from);
    const toChange = envelopes.find(envelope => envelope.numericalID === to);

    console.log("This is the console.log " + fromWhatToChange.Envelope+ " \n" + toChange.Envelope + "\n");

    toChange.numericalID = fromWhatToChange.numericalID;
    toChange.title = fromWhatToChange.title;
    toChange.budget = fromWhatToChange.budget;

    for (let x = 0 ; x < envelopes.length ; x++){
        console.log(envelopes[x]);
    }
    

    res.send(fromWhatToChange.numericalID + " \n" + toChange.numericalID + "\n");

});


app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}.`)
});




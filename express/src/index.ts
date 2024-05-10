import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on('error', (err)=>{
    console.log('error is ', err);
})

app.post("/submit", async(req, res)=>{
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;

    try{
        console.log("received submission", problemId, code, language);
        await client.lPush("problems", JSON.stringify({code, language, problemId}));

        //store in the database

        res.status(200).send("Submissiob received and stored");
    } catch (error){
        console.log("redis error: ", error);
        res.status(500).send("failed to submit")
    }
});


async function startServer(){
    try{
        await client.connect();
        console.log("connected to redis");

        app.listen(3000, ()=>{
            console.log("server started at port 3000");
        });
    } catch (error){
        console.log("error connecting to redis", error);
    }

}

startServer();
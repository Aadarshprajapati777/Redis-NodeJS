import { createClient } from "redis";

const client = createClient();

async function  programSubmission(submission: string) {
    const { problemId, code, language } = JSON.parse(submission);

    console.log("received submission", problemId, code, language);
    console.log("processing submission...");
    //actual processing logic in a docker container

    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("submission processed");

    //store in the database

}


async function startWorker(){
    try{
        await client.connect();
        console.log("connected to redis");

        while(true){
            try{
                const submission = await client.brPop("problems", 0);
                console.log("received submission", submission);
                // @ts-ignore
                await programSubmission(submission.element);
            } catch
            {
                console.log("error processing submission");
            }
        } 
    }

    catch (error){
        console.log("error connecting to redis", error);
    }

}
startWorker();
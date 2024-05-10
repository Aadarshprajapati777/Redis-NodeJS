"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function programSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        const { problemId, code, language } = JSON.parse(submission);
        console.log("received submission", problemId, code, language);
        console.log("processing submission...");
        //actual processing logic in a docker container
        yield new Promise(resolve => setTimeout(resolve, 3000));
        console.log("submission processed");
        //store in the database
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("connected to redis");
            while (true) {
                try {
                    const submission = yield client.brPop("problems", 0);
                    console.log("received submission", submission);
                    // @ts-ignore
                    yield programSubmission(submission.element);
                }
                catch (_a) {
                    console.log("error processing submission");
                }
            }
        }
        catch (error) {
            console.log("error connecting to redis", error);
        }
    });
}
startWorker();

import Replicate from "replicate";


let replicate: null | Replicate = null;

export function getReplicateClient(){
    if(!replicate){
        replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });
    }
    return replicate
}
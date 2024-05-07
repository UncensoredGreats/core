import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, ugd_backend } from '../../../../../declarations/ugd_backend';

const backend_canister_id = process.env.CANISTER_ID_UGD_BACKEND!;

export const getPrincipal = (client:AuthClient): string => {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal().toString();
    return principal;
}


export const initializeActor = async(client:AuthClient)=>{
    try{
        if(await client.isAuthenticated()){
            const identity = client.getIdentity();
            const agent = new HttpAgent({ identity });
            const actor = createActor( backend_canister_id , { agent });
            return actor;
        }
    }catch(error){
        console.error('Error initializing actor', error);
    }
    return ugd_backend;
}
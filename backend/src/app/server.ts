import express from "express";
import createApp from "./app.ts";
import container,{authModule} from "../config/inversify.config.ts";

const PORT = Number(process.env.PORT) || 3000;

export const startServer = () =>{
    const app = createApp();
    app.listen(PORT,'0.0.0.0',()=>{
        console.log(`server running on port ${PORT}`)
    })

    return app;
}
import 'dotenv'
import 'reflect-metadata'
import { startServer } from './app/server.ts'
import { connectDatabase } from './config/database.ts'
import { connectRedis } from './config/redis.ts'
async function start(){
    try{
        await connectRedis()
        await connectDatabase()
        startServer()
         
    }catch(error){
        console.log("Application startup failed:",error);
        process.exit(1);
    }
  
}

start();
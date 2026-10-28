import {createClient} from "redis"

export const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on("connect",()=>{
    console.log("Redis connected")
})

redisClient.on("error",(err)=>{
    console.error("Redis Error:",err)
})


export async function connectRedis(){
    try{
        await redisClient.connect();
    }catch(error){
        console.error("Faild to connect Redis",error);
        process.exit(1);
    }
}
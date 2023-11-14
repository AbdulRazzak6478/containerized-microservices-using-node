const express = require('express');

const amqplib = require('amqplib');

async function connectQueue()
{
    try {
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue('noti-queue');
             channel.sendToQueue('noti-queue',Buffer.from('once more, once more'));
    } catch (error) {
        console.log('queue error ',error);
    }
}


const {ServerConfig:{PORT},Logger, Queue} = require('./config');
const apiRoutes =require('./routes');
const  CRONS = require('./utils/common/cron-jobs');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api',apiRoutes);
// app.use('/bookingService/api',apiRoutes);


app.listen(PORT,async ()=>{
    console.log(`Successfully started the server on PORT ${PORT} `); 
    Logger.info("Successfully started server"," root ", {});
    CRONS;
    // await connectQueue();
    console.log('queue connected');
});
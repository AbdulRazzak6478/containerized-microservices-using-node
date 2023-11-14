
const amqplib = require('amqplib');
const serverConfig = require('./server-config');

// var channel, connection ;
// async function connectQueue()
// {
//     try {
//         connection = await amqplib.connect('amqp://localhost');
//         channel = await connection.createChannel();

//         await channel.assertQueue('noti-queue');
//     } catch (error) {
//         console.log('queue connect error ',error);
//     }
// }
async function sendData(data)
{
    try {
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue('noti-queue');
        // channel.sendToQueue('noti-queue',Buffer.from('once more, once more'));
        channel.sendToQueue('noti-queue',Buffer.from(JSON.stringify(data)));
        console.log('message is sent into queue');
    } catch (error) {
        console.log('queue send error  ',error);
    }
}

module.exports = {
    // connectQueue,
    sendData
}
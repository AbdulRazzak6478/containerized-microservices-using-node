const cron = require('node-cron');

const {BookingService} = require('../../services')
function scheduleCron()
{
    // '*/5 * * * * *' for 5 sec
    // '*/10 * * * * ' for 10 min
    cron.schedule('*/15 * * * * ',async()=>{
        console.log('Auto Cancelling initiated bookings');
        const response = await BookingService.cancelOldBookings()
    })
}

module.exports = scheduleCron();
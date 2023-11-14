const {StatusCodes} = require('http-status-codes');
const info = (req,res)=>{
    return res.status(StatusCodes.OK).json({
        success:true,
        message:"Flight service in container API is live",
        error:{},
        data:{}
    })
}

module.exports = {
    info
}
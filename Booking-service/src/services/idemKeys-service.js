const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { IdemKeysRepository } = require('../repositories')

const idemKeysRepository = new IdemKeysRepository();

async function createIdemKey(data)
{
    try {
        const idemkeys = await idemKeysRepository.create(data);
        return idemkeys;
    } catch (error) {
        let explanation = [];
        console.log('payment keys error ,',error);
        throw new AppError('Cannot make a payment',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}
async function getIdemkey(data)
{
    try {
        const idemkeys = await idemKeysRepository.getEntryByAttribute(data);
        return idemkeys;
    } catch (error) {
        console.log('idemkeys service get idemkey  error ,',error);
    }
}
module.exports = {
    createIdemKey,
    getIdemkey
}
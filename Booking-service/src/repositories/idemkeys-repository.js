const CrudRepository = require("./crud-repository");
const { idemKeys } = require('../models')
class idemKeysRepository extends CrudRepository{
    constructor(){
        super(idemKeys)
    }
    async getEntryByAttribute(attribute)
    {
        const response = await this.model.findAll({
            where:{
                value : attribute,
            }
        });
        if(!response)
        {
            throw new AppError("Not able to found the resource",StatusCodes.NOT_FOUND)
        }
        return response;
    }
}
module.exports = idemKeysRepository;
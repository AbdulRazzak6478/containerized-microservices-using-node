const CrudRepository = require("./crud-repository");
const { Airport } = require('../models');

class AirportRepository extends CrudRepository {
    constructor()
    {
        super(Airport);
    }

    async getEntryByAttribute(attribute)
    {
        const response = await this.model.findAll({
            where:{
                code : attribute,
            }
        });
        return response;
    }
}

module.exports = AirportRepository;
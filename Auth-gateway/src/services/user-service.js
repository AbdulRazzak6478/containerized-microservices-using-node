const { UserRepository , RoleRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes')
const { Auth, Enums } = require('../utils/common');
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

/*
    POST : /cities
    req-body {email :"abc@def.com",password:"12345"}
*/
async function signUp(data)
{
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER)
        user.addRole(role); 
        return user;
    } catch (error) {
        let explanation = [];
        console.log("user service create error ,",error.message);
        if(error.name == 'TypeError')
        {
            console.log("inside error ",error);
            throw new AppError('Cannot create a new user',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(error.name == 'SequelizeValidationError' || error.name == "SequelizeUniqueConstraintError")
        {
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            console.log("inside service create error ",explanation);
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        } 
        throw new AppError(`Cannot create a new user entry, ${error?.message} `,StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function signIn(data)
{
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user)
        {
            throw new AppError('No user found for the given email',StatusCodes.BAD_REQUEST);
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        console.log('password match ',passwordMatch);
        if(!passwordMatch)
        {
            throw new AppError('Invalid password',StatusCodes.BAD_REQUEST);
        }
        // { input } integrity constraint to get on decrypt
        const jwt  = Auth.createToken({id:user.id, email:user.email}); 
        return jwt;
    } catch (error) {
        // if(error instanceof AppError) throw error;
        console.log('user service signIn error' ,error);
        throw new AppError(`Something went wrong , ${error?.message}`,error?.statusCode ? error.statusCode :StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAuthenticated(token)
{
    try {
        if(!token)
        {
            throw new AppError('x-access-token : bearer-token ,missing jwt token',StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id);
        if(!user)
        {
            throw new AppError('no user found',StatusCodes.BAD_REQUEST);
        }
        return user.id; 
    } catch (error) {
        if(error.name == 'JsonWebTokenError')
        {
            throw new AppError('Invalid jwt token',StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError')
        {
            throw new AppError('jwt token expired',StatusCodes.BAD_REQUEST);
        }
        console.log('user service signin authenticated :',error.message);
        throw new AppError(`Something went wrong , ${error?.message}`,error?.statusCode ? error.statusCode :StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function addRoletoUser(data)
{
    try {
        const user = await userRepository.get(data.id);
        if(!user)
        {
            throw new AppError('No user found for the given id',StatusCodes.BAD_REQUEST);
        }
        const role = await roleRepository.getRoleByName(data.role)
        if(!role)
        {
            throw new AppError('No user found for the given role',StatusCodes.BAD_REQUEST);
        }
        user.addRole(role); 
        return user;
    } catch (error) {
        console.log('add role in user service : ',error);
        throw new AppError(`Something went wrong , ${error?.message}`,error?.statusCode ? error.statusCode :StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAdmin(id)
{
    try {
        const user = await userRepository.get(id);
        if(!user)
        {
            throw new AppError('No user found for the given id',StatusCodes.BAD_REQUEST);
        }
        const adminrole = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN)
        if(!adminrole)
        {
            throw new AppError('No user found for the given role',StatusCodes.BAD_REQUEST);
        }
        console.log('is role : ',adminrole);
        return user.hasRole(adminrole); 
        // return user
    } catch (error) {
        console.log('isAdmin in user service : ',error);
        throw new AppError(`Something went wrong , ${error?.message}`,error?.statusCode ? error.statusCode :StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function get(id)
{
    try {
        const user = await userRepository.get(id);
        return user;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError("The user you requested is not found",error.statusCode);
        }
        throw new AppError('Cannot fetch data of user',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


module.exports = {
    signUp,
    signIn,
    isAuthenticated,
    addRoletoUser,
    isAdmin,
    get
}

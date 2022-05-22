const { nextTick } = require("process")

module.exports = {
    notFound : {
        status: 404,
        message: 'Sauce not found'
    },
    userNameExist : {
        status: 404,
        message: 'User not found'
    }
}

const sauceErrors = require('../errorMessages/sauce');
catch (error){
    next({status: sauceErrors[error.message]?.status, message: sauceErrors[error.message]?.message})
}

const Joi = require('joi')

class Validation {
    static validate(validation, field){
        let Scheme = Joi.object().keys(validation)
        
        let {error} = Scheme.validate(field, {abortEarly: true, allowUnknown: true})
        let allError = []

        if(error){
            for (const errorMsg of error.details) {
                allError.push({
                    text: errorMsg.message,
                    type: 'is-danger'
                })
            }
        }

        return allError
    }
}

module.exports = Validation
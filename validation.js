//VALIDATION

const Joi = require('joi');

// Register Validation
const registerValidation=(data)=>{
    const schema={
        name:Joi.string().required(),
        username:Joi.string().required(),
        master:Joi.boolean(),
        password:Joi.string().required()
    };
    return Joi.validate(data,schema);
};

const loginValidation=(data)=>{
    const schema={
        username:Joi.string().required(),
        password:Joi.string().required()
    };
    return Joi.validate(data,schema);
};

const documentValidation=(data)=>{
    const schema={
        filename:Joi.string().required(),
        source:Joi.string(),
        date:Joi.date(),
        userAttached:Joi.array(),
    };
    return Joi.validate(data,schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.documentValidation = documentValidation;


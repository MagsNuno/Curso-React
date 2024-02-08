const {body} = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name").isString().withMessage("Name is required!").isLength({min: 3}).withMessage("Name needs to have at least 3 characters"),
        body("email").isString().withMessage("Email is required!").isEmail().withMessage("Please enter a valid email address"),
        body("password").isString().withMessage("Password is required!").isLength({min: 5}).withMessage("Password needs to be at least 5 characters"),
        body("confirmPassword").isString().withMessage("Password confirmation is required!").custom((value, {req}) => {
            if(value != req.body.password){
                throw new Error("Passwords do not match!");
            }
            return true;
        }),
    ];
};


const loginValidation = () => {
    return [
        body("email").isString().withMessage("Email is required!").isEmail().withMessage("Please, insert a valid email!"),
        body("password").isString().withMessage("Password is required!")
    ]
};


const userUpdateValidation = () => {

    return [
        body("name").optional().isLength({min: 3}).withMessage("Name needs to be at least 3 characters"),
        body("password").optional().isLength({min: 5}).withMessage("Password needs to be at least 5 characters")
    ]
};



module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
}
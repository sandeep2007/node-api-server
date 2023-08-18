const asyncHandler = require('express-async-handler')
const { body } = require('express-validator')
const validator = require('../utils/validator')

const loginValidation = asyncHandler(validator([
    body('username')
        .exists().withMessage('Username required')
        .notEmpty().withMessage('Username cannot be empty')
    ,
    body('password')
        .exists().withMessage('Password required')
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 chars long')
]))

const registerValidation = asyncHandler(validator([
    body('name').exists().notEmpty(),
    body('lname').exists().notEmpty(),
    body('email').exists().notEmpty(),
    body('phone').exists().notEmpty(),
    body('password').exists().notEmpty(),
]))

module.exports = {
    loginValidation,
    registerValidation
}
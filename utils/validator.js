const { validationResult } = require('express-validator')
const _ = require('lodash')

const validator = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        const formattedErrors = _(errors.array())
            .groupBy('param')
            .mapValues(group => _.map(group, 'msg'))
            .value()

        if (JSON.stringify(formattedErrors) === '{}') {
            return next();
        }
        res.status(400).json({ errors: formattedErrors });
    };
}

module.exports = validator
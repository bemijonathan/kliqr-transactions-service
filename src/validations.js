const { body, checkSchema, validationResult } = require('express-validator');
const { log } = require('./utils');
module.exports.transactionSchema = {
    userId: {
        notEmpty: true,
    },
    amount: {

        custom: {
            options: val => {
                if (typeof +val !== 'number') {
                    throw new Error('amount must be a number');
                }
                if (+val < 0.00) {
                    throw new Error('amount cannot bwe less than 0.00')
                }
                return true
            }
        },
    },
    type: {

        custom: {
            options: val => {
                if (['debit', 'credit'].includes(val)) {
                    return true
                } else {
                    throw new Error('type must be either credit or debit')
                }
            }
        }
    },
    category: {

        custom: {
            options: val => {
                if (['gift', 'food'].includes(val)) {
                    return true
                } else {
                    throw new Error('type must be either credit or debit')
                }
            }
        }
    }

}


module.exports.similaritiesSchema = {
    trend: {
        notEmpty: true,
        custom: {
            options: val => {
                if (val.length === 0) {
                    throw new Error('trend must be at least one')
                }
                return true
            }

        }
    }
}
const { connection, query } = require("../db");
const util = require('util');
const { response, log } = require("../utils");
const { validationResult } = require("express-validator");

class TransactionsService {
    async getUsersTransactions(req, res) {
        try {
            const userId = req.query.user_id
            const data = await query(`SELECT * FROM Transactions WHERE userId = ${userId}`)
            if (data.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            return response(res, 200, true, data, 'success')
        } catch (error) {
            log(error)
            return response(res, 500, false, {}, 'server Error')
        }
    }

    async getOneUserTransaction(req, res) {
        try {
            const id = req.params.id
            const data = await query(`SELECT * FROM Transactions WHERE id = ${id}`)
            if (data.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            return response(res, 200, true, data[0], 'success')
        } catch (error) {
            log(error)
            return response(res, 500, false, {}, 'server Error')
        }
    }

    async createUserTransactions(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, 400, false, errors.array(), "failed validation")
        }
        try {
            const { name, userId, amount, type, category, icon_url, } = req.body;
            const querydata = `
                INSERT INTO Transactions (name ,userId, amount, type, category, icon_url) 
                VALUES ('${name}', ${userId}, ${amount}, '${type}', '${category}', '${icon_url}');
            `
            console.log(querydata)
            const data = await query(querydata)
            return response(res, 200, true, { name, userId, amount, category, icon_url, id: data.insertId }, 'success')
        } catch (err) {
            log(err)
            return response(res, 500, false, {}, 'server Error')
        }
    }

    async updateUserTransactions(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, 400, false, errors.array(), "failed validation")
        }
        try {
            const { name, userId, amount, type, category, icon_url, } = req.body;

            const id = req.params.id
            const getData = await query(`SELECT * FROM Transactions WHERE id = ${id}`)
            if (getData.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            const querydata = `
                UPDATE Transactions 
                SET 
                    name = '${name}', 
                    userId = '${userId}', 
                    amount = '${amount}' , 
                    type = '${type}' , 
                    category = '${category}', 
                    icon_url = '${icon_url}'
                WHERE id = ${id};
            `
            const data = await query(querydata)
            return response(res, 200, true, { name, userId, amount, category, icon_url, id }, 'success')
        } catch (err) {
            log(err)
            return response(res, 500, false, {}, 'server Error')
        }

    }

    async deleteUserTransactions(req, res) {
        try {
            const id = req.params.id
            const getData = await query(`SELECT * FROM Transactions WHERE id = ${id}`)
            if (getData.length === 0) {
                return response(res, 404, false, null, 'not found')
            }
            const querydata = `
                DELETE FROM Transactions 
                WHERE id = ${id};
            `
            await query(querydata)
            return response(res, 200, true, {}, 'success')
        } catch (err) {
            log(err)
            return response(res, 500, false, {}, 'server Error')
        }
    }
}

module.exports = TransactionsService
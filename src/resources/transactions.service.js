const { connection, query } = require("../db");
const util = require("util");
const { response, log } = require("../utils");
const { validationResult } = require("express-validator");

class TransactionsService {
	async getUsersTransactions(req, res) {
		try {
			const userId = req.query.user_id;
			const data = await query(
				`SELECT * FROM Transactions WHERE userId = ${userId}`
			);
			if (data.length === 0) {
				return response(res, 404, false, null, "not found");
			}
			return response(res, 200, true, data, "success");
		} catch (error) {
			log(error);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async getOneUserTransaction(req, res) {
		try {
			const id = req.params.id;
			const data = await query(`SELECT * FROM Transactions WHERE id = ${id}`);
			if (data.length === 0) {
				return response(res, 404, false, null, "not found");
			}
			return response(res, 200, true, data[0], "success");
		} catch (error) {
			log(error);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async createUserTransactions(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return response(res, 400, false, errors.array(), "failed validation");
		}
		try {
			const { name, userId, amount, type, category, icon_url } = req.body;
			const querydata = `
                INSERT INTO Transactions (name ,userId, amount, type, category, icon_url) 
                VALUES ('${name}', ${userId}, ${amount}, '${type}', '${category}', '${icon_url}');
            `;
			console.log(querydata);
			const data = await query(querydata);
			return response(
				res,
				200,
				true,
				{ name, userId, amount, category, icon_url, id: data.insertId },
				"success"
			);
		} catch (err) {
			log(err);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async updateUserTransactions(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return response(res, 400, false, errors.array(), "failed validation");
		}
		try {
			const { name, userId, amount, type, category, icon_url } = req.body;

			const id = req.params.id;
			const getData = await query(
				`SELECT * FROM Transactions WHERE id = ${id}`
			);
			if (getData.length === 0) {
				return response(res, 404, false, null, "not found");
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
            `;
			const data = await query(querydata);
			return response(
				res,
				200,
				true,
				{ name, userId, amount, category, icon_url, id },
				"success"
			);
		} catch (err) {
			log(err);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async deleteUserTransactions(req, res) {
		try {
			const id = req.params.id;
			const getData = await query(
				`SELECT * FROM Transactions WHERE id = ${id}`
			);
			if (getData.length === 0) {
				return response(res, 404, false, null, "not found");
			}
			const querydata = `
                DELETE FROM Transactions 
                WHERE id = ${id};
            `;
			await query(querydata);
			return response(res, 200, true, {}, "success");
		} catch (err) {
			log(err);
			return response(res, 500, false, {}, "server Error");
		}
	}

	async getSimilarUsers(req, res) {
		const id = req.params.id;
		if (!id) {
			return response(res, 400, false, {}, "user id is required");
		}
		if (!req.body.trend) {
			return response(res, 400, false, {}, "trend is required");
		}
		const trends = req.body.trend;
		const details = [];
		const uniquepattern = (id, category) => {
			return `
            SELECT
                count(*) c,
                t.userId,
                t.category,
                u.first_name ,
                u.last_name ,
                u.id,
                u.avatar,
                u.created_at
            from
                Transactions t left join Users u on t.userId = u.id
            WHERE t.category = '${category}' and t.date_time >= DATE_SUB(NOW(),INTERVAL 1 YEAR) and userId  != ${id}
            group by
            t.category ,
            MONTHNAME(t.date_time),
            t.userId
        `;
		};
		// array of user number of transactions and first_name , last_name
		let result = [];

		for (const trend of trends) {
			const q = uniquepattern(id, trend);
			const y = await query(q);
			details.push(y);
		}

		details.forEach((h) => {
			const tttt = Object.values(
				h.reduce((r, e) => {
					let k = `${e.userId}`;
					if (!r[k]) r[k] = { ...e, count: 1 };
					else {
						r[k].count += 1;
						r[k].c += e.c;
					}
					return r;
				}, {})
			);
			log(result);
			//select transactions that occurs more than 5 months
			result.push(tttt.filter((e) => e.count > 5));
			// h.forEach(g => {
			//     let x = result.findIndex(f => {
			//         return f.userId === g.userId
			//     })
			//     if (x > -1) {
			//         result[x] = {
			//             c: +g.c + +result[x].c,
			//             userId: 6,
			//             first_name: result[x].first_name,
			//             last_name: result[x].last_name,
			//         }
			//     }
			// })
		});

		// result = result.flat().filter(e => {
		//     e.id !== id
		// })

		result = Object.values(
			result.flat().reduce((r, e) => {
				let k = `${e.userId}`;
				if (!r[k]) r[k] = { ...e, count: 1 };
				else {
					r[k].count += 1;
					r[k].c += e.c;
				}
				return r;
			}, {})
		);

		//get number transactions of each of the users

		const userIds = result.flat().map((e) => e.id);

		if (userIds.length) {
			const transactions = await query(`select userId, count(id) as count
                from Transactions 
                where userId in (${[...userIds]})
                group by userId 
            `);

			result = result.map((e) => {
				let t = transactions.find((g) => {
					if (g.userId === e.id) {
						return g.count;
					}
				});
				e["transaction_count"] = t.count;
				return e;
			});
		}

		return response(res, 200, true, result.flat(), "success");
	}
}

module.exports = TransactionsService;

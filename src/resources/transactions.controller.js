const TransactionsService = require("./transactions.service");

const _ts = new TransactionsService()

module.exports.getOne = async (req, res) => {
    return _ts.getOneUserTransaction(req, res);
}

module.exports.getAll = async (req, res) => {
    return _ts.getUsersTransactions(req, res);
}

module.exports.createOne = async (req, res) => {
    return _ts.createUserTransactions(req, res);
}

module.exports.deleteOne = async (req, res) => {
    return _ts.deleteUserTransactions(req, res);
}

module.exports.updateOne = async (req, res) => {
    return _ts.updateUserTransactions(req, res);
}
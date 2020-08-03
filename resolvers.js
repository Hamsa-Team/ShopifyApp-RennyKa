const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');

let url = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
let db = null;
let employees = [];

MongoClient.connect(url, function (err, dtb) {
    if (err) throw err;
    db = dtb.db(process.env.DB_NAME)
});

const getEmployees = async () => {
    if (db) {
        employees = await db.collection('employees').find({}).toArray();
        return employees
    }
}
const signup = async ({ user }) => {
    if (db) {
        const checkUser = await db.collection('users').findOne({
            username: user.username
        })
        if (!checkUser) {
            await db.collection('users').insertOne(user);
            return { mess: "Signup successfully!" }
        } else return { mess: "User already existed!" }
    }
}
const login = async ({ user }) => {
    if (db) {
        const checkUser = await db.collection('users').findOne({
            username: user.username
        })
        const checkLogin = bcrypt.compareSync(user.password, checkUser.password);
        if (checkLogin) {
            return { mess: "Login successully!" }
        } else return { mess: "Wrong username or password, please try again!" }
    }
}
const crawlEmployees = async () => {
    if (db) {
        return await fetch('http://dummy.restapiexample.com/api/v1/employees').then(async res => {
            const response = await res.json();
            db.collection('employees').insertMany(response.data);
            return {
                mess: 'Crawl successfully ' + response.data.length + ' employees!',
                crawledEmployees: response.data
            }
        })
    }
}

module.exports = {
    Query: {
        employees: async () => getEmployees(),
    },
    Mutation: {
        login: async (_, { user }) => login({ user }),
        signup: async (_, { user }) => signup({ user }),
        crawl: async () => crawlEmployees()
    }
};
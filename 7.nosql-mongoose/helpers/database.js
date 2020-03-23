const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let db

const monggoConnect = (callback) => {
    MongoClient.connect(process.env.DB_ACCESS, {
        useUnifiedTopology: true
    })
    .then(client => {
        db = client.db()
        callback()
        console.log('Connected to database');
    })
    .catch(err =>{
        console.log(err);
        throw err
    })
}

const getDb = () => {
    if(db){
        return db
    }
    throw 'No database found'
}

exports.monggoConnect = monggoConnect
exports.getDb = getDb
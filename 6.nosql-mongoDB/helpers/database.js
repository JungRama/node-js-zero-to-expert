const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let db

const monggoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://jungrama:gunkrama@restfullapi-iicxn.gcp.mongodb.net/ecommerce?retryWrites=true&w=majority', {
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
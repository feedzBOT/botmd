const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://database-bot-adi:CfR8W2YK2BxMKrXJ@cluster0.ycaop.mongodb.net/databaseBotWea?retryWrites=true&w=majority&ssl=true";

const client = new MongoClient(uri);
client.connect(async (error, client) => {
  if(error) return console.log('Koneksi Gagal')
  console.log('Koneksi Ke Database MongoDB Berhasil')
    const db = client.db('database_bot_md');

    //add data
    exports.adddata = async(data_name, data) => {
      db.collection(data_name).insertOne(data)
    }
    //show data
    exports.showdata = async(data_name, query) => {
      return new Promise(async(resolve,reject) => {
      db.collection(data_name).find(query).toArray((error, result) => {
      if(error) return reply('error')
      resolve(result)
      })
    })
    }
    //delete data
    exports.delete = async(data_name, data) => {
      return new Promise(async(resolve,reject) => {
      db.collection(data_name).deleteOne(data).then((result) => {
      resolve(result)
      })
      .catch((error) => {
        resolve(error)
      })
    })
    }
    exports.update = async(data_name, from, teks) => {
      return new Promise(async(resolve,reject) => {
      db.collection(data_name).updateOne(
    {
      id: from
    },
    {
      $set: {
        teks: teks
      },
    }
    ).then((result) => {
      resolve(result)
      })
      .catch((error) => {
        resolve(error)
      })
    })
    }
    exports.uprefix = async(from, prefix) => {
      return new Promise(async(resolve,reject) => {
      db.collection('prefix').updateOne(
    {
      id: from
    },
    {
      $set: {
        prefix: prefix
      },
    }
    ).then((result) => {
      resolve(result)
      })
      .catch((error) => {
        resolve(error)
      })
    })
    }
    exports.mute = db.collection('mute')
    // Query for a movie that has the title 'Back to the Future'
    const query = { id: 'test' };
    /*const movie = await mute.find().toArray((error, result) => {
      console.log(result)
    })*/
module.exports.client = client
});

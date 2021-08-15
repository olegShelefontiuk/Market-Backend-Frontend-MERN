const config = require( './config/config')
const app = require('./server/express')
const mongoose = require('mongoose')

//
// mongoose["Promise"] = global.Promise
// mongoose.connect(config.mongoUri,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
// mongoose.set('useFindAndModify' ,false )
// mongoose.connection.on('err', () => {
//     throw new Error('ServerError')
// })
//
// app.listen(config.port, (err) => {
//     if (err) {
//         console.log(err)
//     }
//     console.info('Server started on port %s.', config.port)
// })
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})
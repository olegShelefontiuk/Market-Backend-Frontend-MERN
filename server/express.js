const express = require('express')
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const shopRoutes = require('./routes/shop.routes')
const productRoutes = require('./routes/product.routes')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

// app.use(express.json({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', shopRoutes)
app.use('/', productRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use('/',express.static(path.join(__dirname, 'client','build')))

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})
module.exports = app
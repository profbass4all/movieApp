const express = require('express')
const app = express()
const {sequelize} = require('./models/index')
const bodyParser = require('body-parser');
const User = require('./models/user')(sequelize, require('sequelize').DataTypes);
const UserRouter = require('./routes/user.route')
const movieRouter = require('./routes/movie.route')
const showtimeRouter = require('./routes/showtime.route');
const reservationRouter = require('./routes/reservation.route')
const swaggerUI = require('swagger-ui-express')
const swaggerJson = require('./openapi.json')
const swaggerJsdoc = require('swagger-jsdoc')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression');

// Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(UserRouter)
app.use(movieRouter)
app.use(showtimeRouter)
app.use(reservationRouter)

//connect to the database
try {
    const main  = async () => {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
        app.listen(process.env.APP_PORT, ()=>{
        console.log(`Server is running on port ${process.env.APP_PORT}`)
})
    }
    main()
} catch (error) {
    console.error(error)
}
const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'Hello World',
        version: '1.0.0',
        },
    },
  apis: ['./routes/*.route.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

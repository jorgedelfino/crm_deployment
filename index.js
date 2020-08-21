const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({ path: 'variables.env' })

const cors = require('cors')

// conectar mongo
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex:true
})

// Crear el servidor
const app = express()

// habilitar body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Definir un dominio para recibir las peticiones
const whiteList = process.env.FRONTEND_URL
const corsOptions = {
	origin: (origin, callback) => {
		// Revisar si la peticion viene de un servidor que esta en la lista blanca
		const existe = whiteList.indexOf(origin) !== -1
		console.log(`#1 ${whiteList}`) // Me muestra el array de la variable de entorno
		console.log(`#2 ${origin}`) // Retorna undefined
		console.log(`#3 ${existe}`) // Retorna false
		if (!origin || existe) {
			callback(null, true)
		} else {
			callback(new Error('No permitido por CORS'))
		}
	}
}

// Habilitar cors
app.use(cors(corsOptions))

// Rutas de la app
app.use('/', routes())

// Carpeta publica
app.use(express.static('uploads'))

// puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

// Iniciar app
app.listen(port, host, () => {
	console.log(`the server is running in port ${port}`)
})
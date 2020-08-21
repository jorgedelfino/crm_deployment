const Productos = require('../models/Productos')

const multer = require('multer')
const shortid = require('shortid')
const path = require('path')

// Configuracion de multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname + '../../uploads/')
	},
	filename: (req, file, cb) => {
		const extension = file.mimetype.split('/')[1]
		cb(null, `${shortid.generate()}.${extension}`)
	}
})

const fileFilter = (req, file, cb) => {
		const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Formato no válido, solo se soportan los siguientes formatos: " + filetypes);
}

// pasar la configuracion y el campo
const upload = multer({ storage, fileFilter }).single('imagen')

// sube un archivo
exports.subirArchivo = (req, res, next) => {
	upload(req, res, function(error) {
		if (error) {
			res.json({mensaje: error})
		}
		return next()
	})
}

// Agrega nuevos productos
exports.nuevoProducto = async (req, res, next) => {
	const producto = new Productos(req.body)
	try {
		if (!req.file) {
			return false
		}
		if (req.file.filename) {
			producto.imagen = req.file.filename
		}
		await producto.save()
		res.json({mensaje: 'Se agrego un nuevo producto'})
	} catch (error) {
		console.log(error)
		next()
	}
}

// Muestra todos los productos
exports.mostrarProductos = async (req, res, next) => {
	try {
		// obtener todos los productos
		const productos = await Productos.find({})
		res.json(productos)
	} catch (error) {
		console.log(error)
		next()
	}
}

// Muestra un producto en especifico por su ID
exports.mostrarProducto = async (req, res, next) => {
	const producto = await Productos.findById(req.params.idProducto)

	if (!producto) {
		res.json({ mensaje: 'Ese producto no existe' })
		return next()
	}

	// Mostrar Producto
	res.json(producto)
}

// Actualiza producto por ID
exports.actualizarProducto = async (req, res, next) => {
	try {

		// Construir un nuevo producto
		let nuevoProducto = req.body

		// Verificar si hay imagen nueva
		if (req.file) {
			nuevoProducto.imagen = req.file.filename
		} else {
			let productoAnterior = await Productos.findById(req.params.idProducto)
			nuevoProducto.imagen = productoAnterior.imagen
		}

		let producto = await Productos.findOneAndUpdate({_id: req.params.idProducto}, nuevoProducto, {
			new: true
		})

		res.json(producto)
	} catch (error) {
		console.log(error)
		next()
	}

}

// Elimina un producto por ID
exports.eliminarProducto = async (req, res, next) => {
	try {
		await Productos.findByIdAndDelete({_id: req.params.idProducto})
		res.json({ mensaje: 'El producto se ha eliminado' })
	} catch (error) {
		console.log(error)
		next()
	}
}

// Busqueda de productos
exports.buscarProducto = async (req, res, next) => {
	try {
		const { query } = req.params
		const producto = await Productos.find({ nombre: new RegExp(query, 'i')})
		res.json(producto)
	} catch (error) {
		console.log(error)
		next()
	}
}
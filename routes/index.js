const express = require('express')
const router = express.Router()

const clienteController = require('../controllers/clienteController')
const productosController = require('../controllers/productosController')
const pedidosController = require('../controllers/pedidosController')
const usuariosController = require('../controllers/usuariosController')

// middleware para proteger las rutas
const auth = require('../middlewares/auth')

module.exports = function() {

	// ** CLIENTES ** //

	// Agrega nuevos clientes via POST
	router.post('/clientes', auth, clienteController.nuevoCliente)

	// Obtener todos los clientes
	router.get('/clientes', auth, clienteController.mostrarClientes)

	// Muestra un cliente en especifico
	router.get('/clientes/:idCliente', auth, clienteController.mostrarCliente)

	// Actualizar Cliente
	router.put('/clientes/:idCliente', auth, clienteController.actualizarCliente)

	// Eliminar cliente
	router.delete('/clientes/:idCliente', auth, clienteController.eliminarCliente)

	// ** PRODUCTOS ** //

	// Nuevos productos
	router.post('/productos',
		auth,
		productosController.subirArchivo,
		productosController.nuevoProducto
	)

	// Muestra todos los productos
	router.get('/productos', auth, productosController.mostrarProductos)

	// Muestra producto en especifico por su ID
	router.get('/productos/:idProducto', auth, productosController.mostrarProducto)

	// Actualizar productos
	router.put('/productos/:idProducto',
		auth,
		productosController.subirArchivo,
		productosController.actualizarProducto
	)

	// Busqueda de productos
	router.post('/productos/busqueda/:query', auth, productosController.buscarProducto)

	// Eliminar productos
	router.delete('/productos/:idProducto', auth, productosController.eliminarProducto)

	// ** PEDIDOS ** //

	// Agrega nuevos pedidos
	router.post('/pedidos/nuevo/:idUsuario', auth, pedidosController.nuevoPedido)
	
	// Mostrar todos los pedidos
	router.get('/pedidos', auth, pedidosController.mostrarPedidos)

	// Mostrar un pedido por su ID
	router.get('/pedidos/:idPedido', auth, pedidosController.mostrarPedido)

	// Actualizar pedidos
	router.put('/pedidos/:idPedido', auth, pedidosController.actualizarPedido)

	// Eliminar pedidos
	router.delete('/pedidos/:idPedido', auth, pedidosController.eliminarPedido)


	// ** USUARIOS ** //

	// Registrar nueva cuenta
	router.post('/crear-cuenta', usuariosController.registrarUsuario)

	// Iniciar sesión
	router.post('/iniciar-sesion', usuariosController.autenticarUsuario)

	return router
}
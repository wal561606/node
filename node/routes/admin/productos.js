var express = require('express');
var router = express.Router();
var productosModel = require('./../../models/productosModel')

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {
  var productos = await productosModel.getProductos();

  productos = productos.map (producto => {
    if (producto. img_id) {
    const imagen = cloudinary.image( producto. img_id, {
      width: 100, // Tamaño de la imagen resultante
      height: 100,
      crop: 'scale'
    });
    return {
          ...producto,
          imagen
          };
    } else {
      return {
        ...producto,
        imagen: ''
      }
    }
  });
  res.render('admin/productos', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    productos
  });
});


router.get('/agregarProducto', (req, res, next) => {
  res.render('admin/agregarProducto', {
    layout: 'admin/layout'
  });
});

router.post('/agregarProducto', async (req, res, next) => {
  try {
    var img_id ='';

    if(req.files && Object.keys(req.files).length > 0){
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }
    if (req.body.nombre != "" && req.body.descripcion != "" &&
      req.body.precio != "") {
      await productosModel.insertProducto({
        ...req.body,
        img_id
            });

      res.redirect('/admin/productos')
    } else {
      res.render('admin/agregarProducto', {
        layout: 'admin/layout',
        error: true, message: "Todos los campos son requeridos"
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregarProducto', {
      layout: 'admin/layout',
      error: true, message: "No se cargo el producto"
    });
  }
});

//Elimina producto por ID
router.get('/eliminarProducto/:id', async (req, res, next) => {
  var id = req.params.id;

  let producto = await productosModel.getProductoById( id);
  if (producto.img_id) {
    await (destroy(producto.img_id));
  }
  await productosModel.deleteProductoById(id);
  res.redirect('/admin/productos')
});

//Crea el controlador de ruta necesario para imprimir el formulario de modificación
router.get('/modificarProducto/:id', async (req, res, next) => {
  let id = req.params.id;
  let producto = await productosModel.getProductoById(id);
  res.render('admin/modificarProducto', {
    layout: 'admin/layout',
    producto
  });
});

//Controlador encargado de recibir los datos del formulario y pasarlos a la función de model para efectuar la modificación del producto en la BD
router.post('/modificarProducto', async (req, res, next) => {
  try{
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1"){
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0){
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
    }
  }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }
 
    let obj = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      img_id
    }
    await productosModel.modificarProductoById(obj, req.body.id);
    res.redirect('/admin/productos');
  }
  catch (error) {
    console.log(error)
    res.render('admin/modificarProducto', {
      layout: 'admin/layout',
      error: true, message: 'No se modificó el producto'
    })
  }
});


module.exports = router;
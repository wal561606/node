var express = require('express');
var router = express.Router();
var recetasModel = require('./../../models/recetasModel')

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {
  var recetas = await recetasModel.getRecetas();
  recetas = recetas.map (receta => {
    if (receta. img_id) {
    const imagen = cloudinary.image( receta. img_id, {
    width: 100,
    height: 100,
    crop: 'scale'
    });
    return {
          ...receta,
          imagen
          };
    } else {
      return {
        ...receta,
        imagen: ''
      }
    }
  });
  
res.render('admin/recetas', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    recetas
  });
});


router.get('/agregarReceta', (req, res, next) => {
  res.render('admin/agregarReceta', {
    layout: 'admin/layout'
  });
});

router.post('/agregarReceta', async (req, res, next) => {
  try {
    var img_id ='';

    if(req.files && Object.keys(req.files).length > 0){
      imagen = req.files.imagen;
      img_id = (await uploader (imagen.tempFilePath)).public_id;
    }
    if (req.body.nombre != "" && 
      req.body.descripcion != "" &&
      req.body.ingredientes != "" &&
      req.body.instrucciones != "" &&
      req.body.imagen != "") {
      await recetasModel.insertReceta({
        ...req.body, // los tres puntos significan que vamos a traer los elmentos de recetas, nombre, descripcion, etc y debajo vamos a traer la imagen en caso que exista 
        img_id
            });
      res.redirect('/admin/recetas')
    } else {
      res.render('admin/agregarReceta', {
        layout: 'admin/layout',
        error: true, 
        message: "Todos los campos son requeridos"
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregarReceta', {
      layout: 'admin/layout',
      error: true, message: "No se cargo la receta"
    });
  }
});

//Eliminar receta por ID
router.get('/eliminarReceta/:id', async (req, res, next) => {
  var id = req.params.id;
  // Esta parte elimina la imagen de Cloudinary
  let receta = await recetasModel.getRecetaById(id);
  if (receta.img_id) {
    await (destroy(receta.img_id));
  }

  await recetasModel.deleteRecetaById(id);
  res.redirect('/admin/recetas')
});

//Crea el controlador de ruta necesario para imprimir el formulario de modificación
router.get('/modificarReceta/:id', async (req, res, next) => {
  let id = req.params.id;
  let receta = await recetasModel.getRecetaById(id);
  res.render('admin/modificarReceta', {
    layout: 'admin/layout',
    receta
  });
});

//Controlador encargado de recibir los datos del formulario y pasarlos a la función de model para efectuar la modificación dla receta en la BD
router.post('/modificarReceta', async (req, res, next) => {
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
      ingredientes: req.body.ingredientes,
      instrucciones: req.body.instrucciones,
      img_id
      
    }
    await recetasModel.modificarRecetaById(obj, req.body.id);
    res.redirect('/admin/recetas');
  }
  catch (error) {
    console.log(error)
    res.render('admin/modificarReceta', {
      layout: 'admin/layout',
      error: true, message: 'No se modificó la receta'
    })
  }
});


module.exports = router;
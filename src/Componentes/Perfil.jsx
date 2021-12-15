import React, { useState, useEffect } from 'react';
// Imagenes
import sinFoto from '../usuario-sin-foto.png';
// Iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
// Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


const axios = require('axios').default;

const Perfil = (props) => {

  const imagenState = props.usuarioActivo.fotoUsuario;

  // STATE DONDE SE ALMACENARÁ LA IMAGEN ELEGIDA PARA CAMBIAR
  const [imagenElegida, setImagenElegida] = useState(null);

  // STATE PARA MOSTRAR LA IMAGEN SELECCIONADA
  const [preview, setPreview] = useState(sinFoto);

  // TRIGGER PARA MENSAJES DE ERROR DE IMAGEN
  const [malInput, setMalInput] = useState(false);

  // STATE PARA CONTROLAR EL PROGRESO DE SUBIDA DE FOTO A WEB
  const [subiendoImagen, setSubiendoImagen] = useState(0);
   
  const manejoBotonVolver = async (e) => {
    e.preventDefault();
   
    if (imagenElegida !== null) {  /* Entra con/sin img - Sale con nueva img */
      const formData = new FormData();
      formData.append('file', imagenElegida);
      formData.append('upload_preset', 'ar1mfxjp');
  
      const linkImg = await subirImagen(formData);
      await imagenABase(linkImg);
      const nuevoUser = await reinstanciarUsuario();
  
      await props.setUsuarioActivo(nuevoUser);

      setSubiendoImagen(0);

      await props.cambioRuta('notas');
        
    } else if (preview === sinFoto) { /* Entra con/sin img - Sale sin img */
      await borrarImg();
      const nuevoUser = await reinstanciarUsuario();

      await props.setUsuarioActivo(nuevoUser);
      await props.cambioRuta('notas');
    }
    else { /* Entra con img  - Sale con misma img */ // /* Entra sin img  - Sale con misma img (ninguna) */
      await props.cambioRuta('notas');
    }
  }

  const manejoBotonCancelar = () => {
    props.cambioRuta('notas');
  }

  const manejoCambioImagen = async (event) => {
    try {
      const foto = event.target.files[0] /*|| event.dataTransfer.files[0];*/ // En este caso con un solo input, se toma el primer elemento del array

      if (foto.type.substr(0, 5) === 'image') { // (foto.type === 'image/jpeg' || foto.type === 'image/png') 
        setMalInput(false);
        setImagenElegida(foto);
      }
      else {
        setMalInput(true);
      }
    } catch (err) {   // Esto ataja la tecla "esc" que cierra la ventana de exploracion de archivos
      setImagenElegida(imagenElegida);
    } 
  }

  // Si hay foto de perfil borra esa foto a la gris, si hay preview Y foto de perfil debe volver a la foto de perfil  
  const borrarFoto = () => {
    setImagenElegida(null);
    setPreview(sinFoto);
  }

  const cargarPreview = async () => {
    // FALLA CUANDO HAY IMAGEN DE PERFIL Y PREVIEW CARGADA. AL ELIMINAR PREVIEW BORRA FOTO CARGADA
    if (imagenElegida !== null) { /* Aca entra solo cuando se realizan cambios */
      const reader = new FileReader();
      reader.onloadend = () => { 
        setPreview(reader.result);
      }
      reader.readAsDataURL(imagenElegida);
    } else {  /* Aca entra cuando se renderiza por primera vez */
      setPreview(sinFoto);
    }
  }
  
  const subirImagen = async (formData) => {    
    /* Subir a Cloudinary */
    console.log('subiendo a cloudinary');

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ronokoc/image/upload", 
        formData,
        { onUploadProgress: progressEvent => {  /* Para palcular porcentaje de subida */
            setSubiendoImagen( parseInt(
              Math.round( (progressEvent.loaded * 100) / progressEvent.total)
            ));
          }
        }
      );
      console.log('listo cloudinary');
      const link = res.data.secure_url;
      return link;

    } catch (err) {
      console.log('Error J al subir a cloud', err);
    }
  }

  /* Guarda link de la foto en BD */
  const imagenABase = async (linkImg) => {
    try {
      await axios.post(
        'http://localhost:3030/usuario/cambiar-foto', 
        {
          link: linkImg,
          ID_usuario: props.usuarioActivo.ID_usuario
        });
    } catch (err) {
      console.log('Error front J al cargar img en DB', err);
    }
  }

  /* Pone en null el campo imagenUsuario de BD */
  const borrarImg = async () => {
    try {
      await axios.post(
        'http://localhost:3030/usuario/borrar-foto', { ID_usuario: props.usuarioActivo.ID_usuario }
      );
    } catch (err) {
      console.log('Error front J al cargar img en DB', err);
    }
  }

  /* Trae de nuevo el usuario para mostrar su foto */
  const reinstanciarUsuario = async () => {
    try {
      const usuarioConFoto = await axios.post(
        'http://localhost:3030/usuario/buscar', { ID_usuario: props.usuarioActivo.ID_usuario }
      );
      return usuarioConFoto.data[0];
    } catch (err) {
      console.log('Error front J al traer usuario con nueva foto', err);
    }
  }


  // CARGA LA VISTA PREVIA DE LA IMAGEN SELECCIONADA
  useEffect( () => { 
    cargarPreview();
  }, [imagenElegida] );

  useEffect( () => { 
    if (imagenState !== null) {
      setPreview(imagenState);
    }
  }, [] );
 
  return (
    <div className="perfil">
      {/* Solo visible cuando este subiendo foto a la web */}
      { subiendoImagen > 0 && 
        <Backdrop className="backdrop" open={true}>
          <CircularProgress size="5rem" style={{color: "#f0b000"}} />
        </Backdrop>
      } 
      <h2 className={subiendoImagen ? "no seleccionable" : ""}>{props.usuarioActivo.nombreUsuario}</h2> 
      <h3>Activo desde: {props.usuarioActivo.fechaRegistro}</h3>
      
    
      <img 
        className='foto-usuario no-seleccionable' 
        src={preview} 
        alt="Foto de perfil" 
      />

      <form>
        <input 
          type="file" 
          onChange={manejoCambioImagen}
          accept="image/*" 
          name="input-foto" 
          id="input-foto" 
        />
      </form>
      
      <div className="botones-foto">
        <div className="tooltip">
          <label className="label-foto" htmlFor="input-foto">
            <FontAwesomeIcon icon={faUpload} />
          </label>
          <p className="texto-tooltip">Buscar</p>
        </div>

        {/* Cruz para borrar imagen cargada. Solo visible cuando haya foto cargada */}
        <div className="tooltip">
          {preview !== sinFoto && <FontAwesomeIcon className="borrar-imagen" icon={faTimes} onClick={borrarFoto} />}
          <p className="texto-tooltip">Eliminar</p>
        </div>
      </div>  

      {/* Mje poco comun por si se sube voluntariamente algo que no sea una imagen */}
      {malInput && <p className="incorrecto">Solo se aceptan imágenes PNG o JPG</p>}
      
      <div className="botones-perfil">
        <button className="boton-con-texto" onClick={manejoBotonVolver}>Guardar y volver</button>
        <button className="boton-con-texto" onClick={manejoBotonCancelar}>Cancelar</button>
      </div>

      <div className="separador" />

      <div className="datos-generales">
        <h3>Cantidad de usuarios registrados: {props.datosGenerales.datosUsuarios}</h3>
        <h3>Notas en uso actualmente: {props.datosGenerales.datosNotas}</h3>
      </div> 
    </div>
  );
}
 
export default Perfil;
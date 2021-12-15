import React, { useState } from 'react';
import InputFormulario from './InputFormulario';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios').default;

const Registro = (props) => {
  const registroDefault = {
    usuario: '',
    email: '',
    password: '',
  };

  // RECIBE EL STATE DEL INPUT INDIVIDUAL, LO ALMACENA Y LO MANDA AL SERVER
  const [registro, setRegistro] = useState(registroDefault);

  const cambioRegistro = (name, value) => {
    setRegistro( registroPrevio => {
      return {
        ...registroPrevio,
        [name]: value,  /* Name va entre [] para que sepa que debe tomar el argumento de la funcion */
      }
    });
  }
    
  const manejoClickRegistro = async () => {
    try {
      if( props.buscarPropiedadVacia(registro) ) {

        const resultado = await axios.post('http://localhost:3030/register', {
          nombreUsuario: registro.usuario.trim(),
          mailUsuario: registro.email.trim(),
          passUsuario: registro.password.trim(),
        });

        if(resultado.data === 'existente')
          await props.setInputIncorrecto(1); /* Hubo coincidencias con otro usuario */
        else {
          await props.setUsuarioActivo(resultado.data);
          await setRegistro(registroDefault); /* Vuelve los campos a cero */
          await props.setInputIncorrecto(0);

          await editarDatoUsuarios();

          await props.cambioRuta('notas');
        }
      } else 
        await props.setInputIncorrecto(2); /* Hubo campos vacios */
    }
    catch(error) {
      console.log('error J al registrar', error);
    }
  }

  // SUMA 1 A LA CANTIDAD DE USUARIOS REGISTRADOS
  const editarDatoUsuarios = async () => {
    try {
      await axios.post('http://localhost:3030/datos/editarUsuarios');
      await props.traerDatosGenerales();

    } catch (err) {
      console.log('error J al editar dato general', err);
    }
  }

  return (
    <>
      <h1>Registro de cuenta</h1>
      <form action="post">
        <InputFormulario 
          tipo="text" 
          nombre="usuario" 
          textoLabel="Usuario" 
          alCambiarInput={cambioRegistro}
          manejoEnter={manejoClickRegistro}
        />
        <InputFormulario 
          tipo="email" 
          nombre="email" 
          textoLabel="Mail ficticio" 
          alCambiarInput={cambioRegistro}
          manejoEnter={manejoClickRegistro}
        />
        <InputFormulario 
          tipo="password" 
          nombre="password" 
          textoLabel="Contraseña" 
          alCambiarInput={cambioRegistro}
          manejoEnter={manejoClickRegistro}
        />
      </form>

      {props.inputIncorrecto === 1 && 
        <div className="error-input">
          <FontAwesomeIcon className="icono-error-input" icon={faExclamationCircle} />
          <p className="incorrecto">El usuario o correo ya fue utilizado</p>
        </div>
      }
      {props.inputIncorrecto === 2 &&       
        <div className="error-input">
          <FontAwesomeIcon className="icono-error-input" icon={faExclamationCircle} />
          <p className="incorrecto">No se aceptan campos vacios</p>
        </div>
      }

      <button className="boton-con-texto btn-ingreso" onClick={manejoClickRegistro}>Registrarse</button>

      <p className="registroEInicio">Ya tienes una cuenta?
        <a onClick={(evento) => props.alCambiarRuta(evento, 'login')} href="./login">Inicia sesión!</a>
      </p>        
    </>
  )
}

export default Registro;
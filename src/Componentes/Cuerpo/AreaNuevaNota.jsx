import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios').default;

const AreaNuevaNota = (props) => {
  
  const inputDefault = {
    titulo: '',
    contenido: '',
  }

  //State de los input ingresados ne la nueva nota
  const [input, setInput] = useState(inputDefault);

  const manejoCambioInput = evento => {
    const {name, value} = evento.target;
    
    setInput( valorPrevio => {
      return {
        ...valorPrevio,
        [name]: value,  // Name va entre [] para que sepa que debe tomar el argumento de la funcion
      }
    });
  }
  
  // Usado para agregar una nueva nota
  const manejoClickNuevo = async (event) => {
    try {
      event.preventDefault();
      
      const nuevaNota = { 
        tituloNota: input.titulo,
        cuerpoNota: input.contenido,
        ID_usuario: props.usuarioActivo.ID_usuario
      }
      await axios.post('http://localhost:3030/notas/nueva', nuevaNota);

      await props.buscarNotasEnDB();

      setInput(inputDefault);

      await props.editarDatoNota('suma');
      /* falta validar inputs vacias (mas adelante con dependencias) */
    }
    catch (error) {
      console.log('error J al crear nota', error);
    }
  }
   
  return ( 
    <div className="contenedor-nueva-nota">
      <form className="crear-nota">
        <input 
          onChange={manejoCambioInput}
          value={input.titulo}
          className="tituloNuevaNota" 
          name="titulo" 
          placeholder="Título"
          autoComplete="off"
        />
        <textarea 
          onChange={manejoCambioInput}
          value={input.contenido}
          name="contenido" 
          placeholder="Escriba una nota..." 
          rows="3"
          autoComplete="off"
        />
        <button className="btn-agregar no-seleccionable" type="submit" onClick={manejoClickNuevo}>
          <FontAwesomeIcon className="btn-agregar" icon={faPlus} />
        </button>
      </form>
    </div>
  );
}
 
export default AreaNuevaNota;
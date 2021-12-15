import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios').default;

const Nota = (props) => {
  
  const manejoBotonBorrar = async () => {
    try {
      const idBorrar = await props.id;
      await axios.post('http://localhost:3030/notas/borrar', {ID_nota: idBorrar});
      await props.editarDatoNota('resta');
      
      await props.buscarNotasEnDB();
    } catch(error) {
      console.log('Error J al borrar', error)
    }
  }

  const manejoBotonEditar = () => {
    const notaVieja = {
      tituloNota: props.titulo,
      cuerpoNota: props.contenido,
      ID_nota: props.id,
    };
    props.setNotaParaEditar(notaVieja);
    props.toggleModoEdicion();
  }

  return (
    <div className="nota">
      <h1>{props.titulo}</h1>
      <p>{props.contenido}</p>
      <div className="tooltip" >
        <button onClick={manejoBotonBorrar} >
          <FontAwesomeIcon className="btn-nota btn-borrar" icon={faTrash} />
        <p className="texto-tooltip">Borrar</p>
        </button>
      </div> 
                
        <div className="tooltip">
          <button onClick={manejoBotonEditar}>
            <FontAwesomeIcon className="btn-nota btn-editar" icon={faEdit} />
          <p className="texto-tooltip">Editar</p>
          </button>
        </div>
    </div>
  );
}

export default Nota;    
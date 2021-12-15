import React, { useEffect } from 'react';
import Nota from '../Nota';

const AreaNotas = (props) => {
    
  useEffect( () => {
    props.buscarNotasEnDB();
  }, []);

  return ( 
    <>
      {props.listaNotas.length === 0 
      ? <div className="div-sin-notas no-seleccionable">No hay notas que mostrar</div> 
      : <div className="lista-notas">
          <ul>
            {props.listaNotas.map( notita => {
              return <Nota 
                key={notita.ID_nota}
                id={notita.ID_nota}
                titulo={notita.tituloNota}
                contenido={notita.cuerpoNota}
                setListaNotas={props.setListaNotas}
                buscarNotasEnDB={props.buscarNotasEnDB}
                toggleModoEdicion={props.toggleModoEdicion}
                setNotaParaEditar={props.setNotaParaEditar}
                editarDatoNota={props.editarDatoNota}
              />
            })}
          </ul>
        </div> 
      }
    </>
   );
}
 
export default AreaNotas;
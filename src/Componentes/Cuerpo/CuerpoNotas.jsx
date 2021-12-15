import React, { useState } from 'react'; 
import AreaNuevaNota from './AreaNuevaNota';
import AreaNotas from './AreaNotas';
import Modal from '../Modal';

const axios = require('axios').default;

const CuerpoNotas = (props) => {

  // STATE DEL 'MODO EDICION'
  const [modoEdicion, setModoEdicion] = useState(false);

  const toggleModoEdicion = () => {
    setModoEdicion(!modoEdicion);
  }

  // STATE DEL "NOTA A MODIFICAR" (solo pora mostrar el texto para editarlo)
  const [notaParaEditar, setNotaParaEditar] = useState({});

  const buscarNotasEnDB = async () => {
    const idUsuario = await props.usuarioActivo.ID_usuario;
    try {  
      const resultado = await axios.post('http://localhost:3030/notas/mostrar', { 
        ID_usuario: idUsuario
      });
      await props.setListaNotas(resultado.data)
    } 
    catch (error) {
      console.log('error J al buscar notas', error);
    } 
  }

  // SUMA O RESTA 1 A LA CANTIDAD GLOBAL DE NOTAS DEPENDIENDO DESDE DONDE SE LLAME LA FUNCION
  const editarDatoNota = async (operacion) => {
    let op;
    if (operacion === 'suma')
      op = '+ 1';
    else 
      op = '- 1';
    
    try {
      await axios.post('http://localhost:3030/datos/editarNotas', {operacion: op});
      await props.traerDatosGenerales();

    } catch (err) {
      console.log('error J al editar dato general', err);
    }
  }

  // Evita el desplazamiento vertical de la app (de fondo) durante el 'modo edicion'
  if(modoEdicion) 
    document.body.classList.add('sin-scroll')
  else 
    document.body.classList.remove('sin-scroll')

  return ( 
    <div className="contenedor-notas">
      <AreaNuevaNota 
        setListaNotas={props.setListaNotas}
        usuarioActivo={props.usuarioActivo} 
        listaNotas={props.listaNotas} 
        buscarNotasEnDB={buscarNotasEnDB}
        editarDatoNota={editarDatoNota}
      />       
      <AreaNotas 
        listaNotas={props.listaNotas} 
        setListaNotas={props.setListaNotas} 
        usuarioActivo={props.usuarioActivo}
        buscarNotasEnDB={buscarNotasEnDB}

        setNotaParaEditar={setNotaParaEditar}
        toggleModoEdicion={toggleModoEdicion}
        modoEdicion={modoEdicion}
        traerDatosGenerales={props.traerDatosGenerales}
        editarDatoNota={editarDatoNota}
      /> 
      {modoEdicion &&
        <Modal 
          toggleModoEdicion={toggleModoEdicion}
          notaParaEditar={notaParaEditar}
          
          setListaNotas={props.setListaNotas}
          usuarioActivo={props.usuarioActivo}
          listaNotas={props.listaNotas}
          buscarNotasEnDB={buscarNotasEnDB}
        />
      }
    </div>
  );
}
 
export default CuerpoNotas;
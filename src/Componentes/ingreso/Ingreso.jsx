import React, { useEffect, useState } from 'react';
import Login from './Login';
import Registro from './Registro';

const Ingreso = (props) => {
  // STATE ENVIADO A HIJOS PARA MANEJAR UN INGRESO INVALIDO
  const [inputIncorrecto, setInputIncorrecto] = useState(0);

  const alCambiarRuta = (evento, nuevaRuta) => {
    evento.preventDefault();
    setInputIncorrecto(0);
    props.cambioRuta(nuevaRuta);
  }

  const buscarPropiedadVacia = objeto => {
    for (const propiedad in objeto) {
      if(objeto[propiedad] === '')
        return false;
    }
    return true;
  };

  // const fetchDatos = async () => {
  //   await props.traerDatosGenerales();
  // }


  // useEffect( () => {
  //   fetchDatos();
  // } , [] );

  return (  
    <div className="contenedor-ingreso">
      { props.ruta === 'login' 
        ? <Login 
            ruta={props.ruta} 
            cambioRuta={props.cambioRuta}
            alCambiarRuta={alCambiarRuta} 
            usuarioActivo={props.usuarioActivo}
            setUsuarioActivo={props.setUsuarioActivo}
            inputIncorrecto={inputIncorrecto}
            setInputIncorrecto={setInputIncorrecto}
            buscarPropiedadVacia={buscarPropiedadVacia}
          /> 
        : props.ruta === 'registro' && 
          <Registro 
            ruta={props.ruta} 
            cambioRuta={props.cambioRuta} 
            alCambiarRuta={alCambiarRuta} 
            setUsuarioActivo={props.setUsuarioActivo}
            inputIncorrecto={inputIncorrecto}
            setInputIncorrecto={setInputIncorrecto}
            buscarPropiedadVacia={buscarPropiedadVacia}
            traerDatosGenerales={props.traerDatosGenerales}
          />
      }
    </div>
  );
}
 
export default Ingreso;
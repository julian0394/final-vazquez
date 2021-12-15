import React, {useState} from 'react';

import Header from './Header';
import Ingreso from './ingreso/Ingreso';
import CuerpoNotas from './Cuerpo/CuerpoNotas';
import Perfil from './Perfil';

import '../Estilos/App.scss'

const axios = require('axios').default;

const App = () => {

  //STATE DE LISTA DE NOTAS QUE SE MUESTRAN
  const [listaNotas, setListaNotas] = useState([]);

  //STATE DE RUTA PARA INICIO DE SESIÓN, REGISTRO Y USO
  const [ruta, setRuta] = useState('login'); // Se manejaran 3 estados: login, signup y notas.

  const cambioRuta = nuevaRuta => setRuta(nuevaRuta);

  //STATE DE USUARIO ACTIVO PARA BUSCAR SUS NOTAS
  const [usuarioActivo, setUsuarioActivo] = useState({});

  //STATE DE DATOS GENERALES
  const [datosGenerales, setDatosGenerales] = useState({});
  
  const traerDatosGenerales = async () => {
    try {
      const datos = await axios.get('http://localhost:3030/datos/traer');
      setDatosGenerales(datos.data);
    } catch (err) {
      console.log('Error J al traer datos generales', err);
    }
  }
 
  return (
    <>
      <Header
        ruta={ruta}
        cambioRuta={cambioRuta}
        usuarioActivo={usuarioActivo}
        setUsuarioActivo={setUsuarioActivo}
        setListaNotas={setListaNotas}
      /> 
      <div className="div-body"> 
        {ruta === 'perfil' 
          ?
            <Perfil 
              cambioRuta={cambioRuta}
              usuarioActivo={usuarioActivo}
              setUsuarioActivo={setUsuarioActivo}
              datosGenerales={datosGenerales}
            />
          :
            (ruta === 'login' || ruta === 'registro')
              ?
                <Ingreso 
                  ruta={ruta} 
                  cambioRuta={cambioRuta}
                  usuarioActivo={usuarioActivo}
                  setUsuarioActivo={setUsuarioActivo}
                  traerDatosGenerales={traerDatosGenerales}
                  setDatosGenerales={setDatosGenerales}
                />
              :
                <CuerpoNotas 
                  usuarioActivo={usuarioActivo}
                  listaNotas={listaNotas} 
                  setListaNotas={setListaNotas}
                  traerDatosGenerales={traerDatosGenerales} 
                />
        } 
      </div>  
    </>
  );
}

export default App;
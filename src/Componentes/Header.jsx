import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import sinFoto from '../usuario-sin-foto.png';
import dogeIcon from '../doge-icon.png';
import dogeImg from '../doge-img.png';
// Material UI
import Backdrop from '@material-ui/core/Backdrop';

const Header = (props) => {

  // const [easterEgg, setEasterEgg] = useState(false);
  const [cuentaEG, setCuentaEG] = useState(0);
  
  const menejoEasterEgg = () => {
    if (cuentaEG < 5) {
      setCuentaEG(cuentaEG + 1); 
    } else {
      resetEasterEgg();
    }
  }

  const resetEasterEgg = () => {
    setCuentaEG(0); 
  }

  // const triggerEasterEgg = () => {
  //   setEasterEgg(!easterEgg);
  // }
    
  const manejoCierreSesion = evento => {
    evento.preventDefault();
    props.setUsuarioActivo({});
    props.setListaNotas([]);
    props.cambioRuta('login');
  }

  const manejoBotonPerfil = () => {
    props.cambioRuta('perfil');
  }

  return (
    <>
      <div className="zona-header">
        <header>
          {/* <h1 className="no-seleccionable"> <FontAwesomeIcon className="logo" icon={faLightbulb} /> Doge Notes </h1> */}
          <div className="zona-titulo">
            <img className="logoo" src={dogeIcon} alt="Doge" onClick={menejoEasterEgg} title="Y esto..? Easter egg?!" />
            <h1 className="no-seleccionable">Doge Notes</h1>
          </div>
          { (props.ruta === 'notas' || props.ruta === 'perfil') && 
            <div className="usuario-header menu">
              
              <div className="tooltip">
                <img 
                  className="foto-usuario no-seleccionable"
                  onClick={manejoBotonPerfil}
                  src={props.usuarioActivo.fotoUsuario === null ? sinFoto : props.usuarioActivo.fotoUsuario}
                  alt="Foto gris generica" 
                />
                <p className="texto-tooltip">Perfil</p>
              </div>
                
              <div className="tooltip">
                <FontAwesomeIcon 
                  className="item" 
                  icon={faInfoCircle} 
                  onClick={ () => alert('Desarrollado por Juli Pérez - Github: julian0394') } 
                />
                <p className="texto-tooltip">Info</p>
              </div>
              
              <div className="tooltip">
                <FontAwesomeIcon className="item" icon={faSignOutAlt} onClick={manejoCierreSesion} />
                <p className="texto-tooltip">Salir</p>
              </div>
            
            </div>   
          }        
        </header>
      </div>
      { cuentaEG >= 5 &&
        <Backdrop className="easter-egg backdrop" open={true}>
          <img className="easter-egg" src={dogeImg} alt="Imagen del perro mas lindo" />
        </Backdrop>
      }
    </>
  );
}

export default Header;
 
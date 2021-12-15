import React, {useState} from 'react';

const InputFormulario = (props) => {
  // ALMACENA EL STATE DEL INPUT INDIVIDUAL Y LO MANDA A SU PADRE PARA ACTUALIZAR SU STATE
  const [input, setInput] = useState('');

  const alCambiar = evento => {
    const {name, value} = evento.target;
    setInput(value);    // Para que se lea su valor
    props.alCambiarInput(name, value);
  }

  const manejoEnterPresionado = (event) => {
    if(event.key === 'Enter'){
      props.manejoEnter();
    }
  }

  return (  
    <div className="input-form">
      <input 
        required 
        type={props.tipo} 
        name={props.nombre}
        value={input} 
        placeholder=" " /* Placeholder vacio sirve para activar la animacion*/
        onChange={alCambiar}
        onKeyPress={manejoEnterPresionado}
        autoComplete="off"
      />
      <label className="no-seleccionable">{props.textoLabel}</label>
    </div>
  );
}
 
export default InputFormulario;
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Calculator = () => {
  const [vista, setVista] = useState('0');

  const [resultado, setResultado] = useState(null);
  const buttons = [
    ['AC', 'DEL', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];
  const handlePress = (valorBtn) => {
    if (valorBtn === '=') {
      calcularResutlado();
      return;
    }
    
    if (valorBtn === 'AC') {
      setVista('0');
      setResultado(null);
      return;
    }
    if (valorBtn === 'DEL') {
      setVista(prev => prev.length === 1 ? '0' : prev.slice(0, -1));
      setResultado(null);
      return;
    }
    let nuevaVista = vista;
    if (vista === '0' && isFinite(valorBtn)) {
        nuevaVista = valorBtn;
    } else {
        nuevaVista += valorBtn;
    }
    const ultimoCaracter = nuevaVista.slice(-2, -1);
    const isOperator = (char) => ['+', '-', '×', '÷', '%'].includes(char);

    if (isOperator(ultimoCaracter) && isOperator(valorBtn)) {
        nuevaVista = nuevaVista.slice(0, -2) + valorBtn;
    } else if (valorBtn === '.' && ultimoCaracter === '.') {
        nuevaVista = nuevaVista.slice(0, -1);
    }

    setVista(nuevaVista);
    setResultado(null); 
  };

  const calcularResutlado = () => {
    const expression = vista
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    try {
      let resultadoFinal = eval(expression);

      if (resultadoFinal === Infinity || resultadoFinal === -Infinity || isNaN(resultadoFinal)) {
        setResultado('Error');
      } else {
        setResultado(resultadoFinal.toString());
      }
      setVista(resultadoFinal.toString());

    } catch (e) {
      setResultado('Error');
      setVista('0');
    }
  };


  const renderButton = (value) => {
    const operadores = ['+', '-', '×', '÷'].includes(value);
    const utilidades = ['AC', 'DEL'].includes(value);
    const igual = value === '=';

    let style = styles.btn;
    if (operadores) style = styles.btnoperador;
    if (utilidades) style = styles.btnutilidades;
    if (igual) style = styles.btnigual;

    return (
      <TouchableOpacity
        key={value}
        style={style}
        onPress={() => handlePress(value)}
      >
        <Text style={styles.btnTexto}>{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_vista}>
        {resultado !== null && resultado !== vista && <Text style={styles.texto_vista}>{vista}</Text>}
        <Text style={styles.texto_display}>{resultado === null ? vista : resultado}</Text>
      </View>

      <View style={styles.btn_container}>
        {buttons.map((row, index) => (
          <View key={index} style={styles.fila}>
            {row.map(renderButton)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  container_vista: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#1c1c1c',
  },
  texto_vista: {
    fontSize: 24,
    color: '#a0a0a0',
  },
  texto_display: {
    fontSize: 72,
    color: '#fff',
    fontWeight: '300',
  },
  btn_container: {
    flex: 3,
    padding: 5,
  },
  fila: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  btn: {
    flex: 1,
    margin: 5,
    backgroundColor: '#505050',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnoperador: {
    flex: 1,
    margin: 5,
    backgroundColor: '#ff9500',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnutilidades: {
    flex: 1,
    margin: 5,
    backgroundColor: '#d4d4d2',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnigual: {
    flex: 2.25, 
    margin: 5,
    backgroundColor: '#ff9500',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTexto: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Calculator;
import { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {auth} from '../firebase';

export default function Cadastro({navigation}) {
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [  createUserWithEmailAndPassword, user, error ] = 
  useCreateUserWithEmailAndPassword(auth); 

  function cadastro() {
    createUserWithEmailAndPassword(email,senha);

    if(user) {
      return navigation.navigate('Chat');
  }

    if(error){
      return <View>os dados estão incorretos</View>
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Acesso ao Chat</Text>
      <TextInput
        style={styles.TextoInput}
        placeholder="Digite o Email"
        onChangeText={(email) => setEmail(email)}
        value={email}
      />
      <TextInput
        style={styles.TextoInput}
        placeholder="Digite o Senha"
        onChangeText={(senha) => setSenha(senha)}
        value={senha}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={()=>{
          cadastro();}}
      >
        <Text style={styles.botaotexto}>Logar</Text>
      </TouchableOpacity>
      <Text style={{marginTop: 25, flexDirection: "row", alignItems: "center", alignSelf: "center",}}>Já possui uma conta?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login', {cadastro:cadastro})}>
        <Text style={{fontWeight: 'bold', color: '#0000CD', fontSize: 15}}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    TextoInput:{
        width:300,
        backgroundColor: '#E0E0E0',
        color: '#000',
        fontSize: 25,
        marginTop: 20,
        borderRadius:10
    },
    titulo:{
        fontSize:40
    },
    botao:{
        width:250,
        backgroundColor: '#0000CD',
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        borderRadius:150,
        color: '#fff',
    },
    botaotexto:{
        color:'#fff',
        fontSize:30
    }
  });
import { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import { auth, database } from '../firebase'; // Importe o módulo de autenticação e o banco de dados

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');

  const confirmar = () => {
    if (senha !== senha2) {
      alert("Senhas não coincidem");
    } else if (senha === "" || senha2 === "" || email === "") {
      alert("Preencha todos os campos");
    } else {
      cadastro();
    }
  }

  const cadastro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await addDoc(collection(database, 'users'), {
        uid: user.uid,
        email: email,
      });

      alert("Conta criada com sucesso");
      navigation.navigate("Login");
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
      console.log(errorMessage);
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

      <TextInput
        style={styles.TextoInput}
        placeholder="Digite o Senha"
        onChangeText={(senha2) => setSenha2(senha2)}
        value={senha2}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={confirmar}
      >
        <Text style={styles.botaotexto}>Cadastrar</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 25, flexDirection: "row", alignItems: "center", alignSelf: "center", }}>Já possui uma conta?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ fontWeight: 'bold', color: '#0000CD', fontSize: 15 }}>Entrar</Text>
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
  TextoInput: {
    width: 300,
    backgroundColor: '#E0E0E0',
    color: '#000',
    fontSize: 25,
    marginTop: 20,
    borderRadius: 10
  },
  titulo: {
    fontSize: 40
  },
  botao: {
    width: 250,
    backgroundColor: '#0000CD',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    borderRadius: 150,
    color: '#fff',
  },
  botaotexto: {
    color: '#fff',
    fontSize: 30
  }
});

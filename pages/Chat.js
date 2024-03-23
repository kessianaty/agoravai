import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { collection, addDoc,onSnapshot, query,orderBy } from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import { database } from "../firebase";

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const {login} = route.params;

  useEffect(()=>{
    async function getMessages(){
      const values = query(collection(database, 'chats'), orderBy('createAdt','desc'));
      onSnapshot(values, (snapshot)=> setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createAdt: doc.data().createAdt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        })) 
      ));
    }
    getMessages();
  },[]);

  const mensagemEnviada = useCallback ((messages = [])=>{
    setMessages((previousMessagens)=> GiftedChat.append(previousMessagens,messages));

  const {_id, createAdt, text, user} = messages[0];
  addDoc(collection(database, 'chats'),{
    _id,
    createAdt,
    text,
    user,
  });
},[]);

  return (
    <GiftedChat
      messages={messages}
      onSend={msg => mensagemEnviada(msg)}
      user={{
        _id: login,
      }}
    />
  );
}
import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import { database } from "../firebase";

export default function Chat() {
  
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const { email } = route.params;
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    async function getMessages() {
      setLoadingMessages(true);
      const q = query(collection(database, 'chats'), orderBy('createAdt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          _id: doc.id,
          createAdt: doc.data().createAdt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }));
        setMessages(data);
      });
  
      return () => {
        unsubscribe();
      };
    }
  
    getMessages();
  }, [email]);  

  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      createAdt: createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
    messages={messages}
    onSend={onSend}
    user={{
      _id: email, 
      name: 'Nome do usuário', // Adicione uma propriedade 'name' 
      avatar: 'URL do avatar', // Adicione uma propriedade 'avatar' 
    }}
  />
);
}
import { useEffect, useState } from "react";
import { Text } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation } from '@react-navigation/native';
import { database } from "../firebase";

const styles = {
  userEmail: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
};

export default function Chat({ route }) {
  const { email, otherUserEmail, user } = route.params;
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const generateConversationId = () => {
      const emails = [email, otherUserEmail].sort();
      return emails.join('_');
    };
    setConversationId(generateConversationId());
  }, [email, otherUserEmail]);


  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(database, `conversas/${conversationId}/mensagens`),
      orderBy('createAdt', 'desc') // Ordenar por data em ordem descendente
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const message = doc.data();
        return {
          _id: doc.id,
          createdAt: message.createAdt.toDate(),
          text: message.text,
          user: {
            _id: message.user.email,
            name: message.user.name,
            avatar: message.user.avatar
          }
        };
      });
      setMessages(data);
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  const onSend = async (newMessages = []) => {
    try {
      const newMessage = newMessages[0];
      const { text, createdAt } = newMessage;
      const messageData = {
        text,
        createAdt: createdAt,
        user: {
          remetente: user,
          destinatario: email,  
        }
      };
      await addDoc(
        collection(database, `conversas/${conversationId}/mensagens`),
        messageData
      );
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          remetente: user,
          destinatario: email,
        }}
      />
    </>
  );
}
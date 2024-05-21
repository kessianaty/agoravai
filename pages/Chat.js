import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, writeBatch, where } from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import { database } from "../firebase";

export default function Chat({ route }) {
  const { email, otherUserEmail, user } = route.params;
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAppPress = (app) => {
    let appUrl = '';
    if (app === 'Uber') {
      appUrl = 'uber://';
    } else if (app === '99') {
      appUrl = 'https://m.99app.com/';
    }

    Linking.canOpenURL(appUrl).then((supported) => {
      if (supported) {
        Linking.openURL(appUrl);
      } else {
        console.log('Cannot open ' + app + '.');
      }
    });
  };

  useEffect(() => {
    const generateConversationId = async () => {
      const emails = [email, user].sort();
      const generatedId = emails.join('_');

      const q = query(collection(database, "conversas"), where("id", "==", generatedId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setConversationId(generatedId);
      } else {
        await addDoc(collection(database, "conversas"), { id: generatedId });
        setConversationId(generatedId);
      }
    };

    
    generateConversationId();
  }, [email, user]);

  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(database, `conversas/${conversationId}/mensagens`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const message = doc.data();
        return {
          _id: doc.id,
          createdAt: message.createdAt.toDate(),
          text: message.text,
          user: {
            _id: message.user.remetente,
            name: message.user.remetente,
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
        text: text || '',
        createdAt: createdAt || new Date(),
        user: {
          remetente: user || 'unknown',
          destinatario: email || 'unknown',
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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const bloquearUsuario = () => {
    console.log("Usuário bloqueado");
  };

  const excluir = () => {
    console.log("excluir");
  };

  const denunciarUsuario = () => {
    console.log("Usuário denunciado");
  };

  const sos = () => {
    console.log("SOS acionado");
  };

  async function apagarConversa(conversationId) {
    try {
      const q = query(
        collection(database, `conversas/${conversationId}/mensagens`)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(database);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      Alert.alert("As mensagens foram deletadas com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar mensagens:", error);
    }
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user,
        }}
      />
      <View style={styles.appButtonContainer}>
        <TouchableOpacity style={styles.appButton} onPress={openMenu}>
          <Text style={styles.appButtonText}>App</Text>
        </TouchableOpacity>

        {isMenuOpen && (
          <View style={styles.app}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleAppPress('Uber')}>
              <Text style={styles.menuItemText}>Uber</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleAppPress('99')}>
              <Text style={styles.menuItemText}>99</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuCloseButton} onPress={closeMenu}>
              <Text style={styles.menuCloseButtonText}> ▼</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={bloquearUsuario}>
            <Text>Bloquear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={denunciarUsuario}>
            <Text>Denunciar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { apagarConversa(conversationId) }}>
            <Text>Apagar Conversa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={sos}>
            <Text>SOS</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuButton: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "transparent",
    zIndex: 8,
  },
  menuButtonText: {
    fontSize: 24,
  },
  menu: {
    position: "absolute",
    bottom: 500,
    right: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  menuItem: {
    position: 'relative',
    top: 40,
    paddingVertical: 5,
  },
  uberButton: {
    position: "absolute",
    top: 10,
    bottom: 20,
    left: 20,
    backgroundColor: "#0000CD",
    padding: 15,
    borderRadius: 30,
  },
  uberButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  appButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  appButton: {
    backgroundColor: "#0000CD",
    padding: 10,
    borderRadius: 30,
  },
  appButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuItemText: {
    fontSize: 16,
  },
  menuCloseButton: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  menuCloseButtonText: {
    fontSize: 16,
    color: "#0000CD",
    textAlign: "center",
  },
});

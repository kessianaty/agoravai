import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { database } from '../firebase';

async function searchUsersByEmail(email) {
  try {
    const q = query(collection(database, 'users'));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs
      .map(doc => doc.data().email.toLowerCase())
      .filter(emailItem => emailItem.includes(email.toLowerCase()))
      .map(emailItem => ({ email: emailItem }));
    return results;
  } catch (error) {
    console.error('erro ao buscar usuario:', error);
    return [];
  }
}

function ChatScreen({ navigation, route }) {
  const { user } = route.params;

  return (
    <Chat otherUserEmail={user} />
  );
}

const Stack = createStackNavigator();

export default function BuscaChat({ route }) {
  const { email, otherUserEmail, user } = route.params; 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    searchUsersByEmail(searchQuery)
      .then(results => {
        setSearchResults(results);
        setLoading(false);
      })
      .catch(error => {
        console.error('erro ao buscar usuario:', error);
        setLoading(false);
      });
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      setSearchResults([]);
      setLoading(true);
      searchUsersByEmail(searchQuery)
        .then(results => {
          setSearchResults(results);
          setLoading(false);
        })
        .catch(error => {
          console.error('erro ao buscar usuario:', error);
          setLoading(false);
        });
    }
  };
  
  const handleChatPress = (email, otherUserEmail) => {
    navigation.navigate('Chat', { email, otherUserEmail, user}); // Passa o usuário logado
  };

  return (
   
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          placeholder="Pesquise o usuario pelo email"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={{ flex: 1, marginRight: 10, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 }}
        />
        <Button title="busca" onPress={handleSearch} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleChatPress(item.email)}>
              <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text>Email: {item.email}</Text>
                {/* Renderizar outros detalhes do usuário conforme necessário */}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>
              {searchQuery.trim() !== '' ? 'Nenhum resultado encontrado' : 'Aperte em busca para pesquisar'}
            </Text>
          )}
        />
      )}
     
    </View>
  );
}

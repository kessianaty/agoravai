import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { database } from '../firebase';


async function searchUsers(startChar) {
  try {
    const q = query(collection(database, 'chats'),
                    where('user._id', '>=', startChar));
    const querySnapshot = await getDocs(q);
    const resultsMap = new Map(); // Usaremos um mapa para armazenar os resultados únicos por nome
    querySnapshot.forEach((doc) => {
      const user = doc.data().user;
      // Verificar se o nome do usuário já foi adicionado ao mapa
      if (!resultsMap.has(user._id.toLowerCase())) {
        resultsMap.set(user._id.toLowerCase(), { id: doc.id, ...user });
      }
    });
    // Converter o mapa de resultados em um array
    const results = Array.from(resultsMap.values());
    return results;
  } catch (error) {
    console.error('Error searching for users:', error);
    return [];
  }
}


export default function UserSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    if (searchQuery !== '') {
      searchUsers(searchQuery.toLowerCase()).then(results => {
        setSearchResults(results);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);


  const handleSearch = async () => {
    const startChar = searchQuery.toLowerCase();
    const results = await searchUsers(startChar);
    console.log('Search results:', results); // Verifique os resultados no console
    setSearchResults(results);
  };
 


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search for users by name"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 }}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id} // Use o ID único de cada usuário como chave
        renderItem={({ item }) => (
          <View key={item.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{item._id}</Text>
            {/* Renderizar outros detalhes do usuário conforme necessário */}
          </View>
        )}
      />
    </View>
  );
}

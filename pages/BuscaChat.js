import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
    console.error('Error searching for users:', error);
    return [];
  }
}

export default function BuscaChat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
        console.error('Error searching for users:', error);
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
          console.error('Error searching for users:', error);
          setLoading(false);
        });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          placeholder="Search for users by email"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={{ flex: 1, marginRight: 10, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 }}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text>Email: {item.email}</Text>
              {/* Renderizar outros detalhes do usuário conforme necessário */}
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>
              {searchQuery.trim() !== '' ? 'No results found' : 'Enter a search query'}
            </Text>
          )}
        />
      )}
    </View>
  );
}

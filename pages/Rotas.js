import { createStackNavigator } from "@react-navigation/stack";

import Login from './Login';
import Cadastro from './Cadastro';
import Chat from './Chat';
import BuscaChat from './BuscaChat';

const Stack = createStackNavigator();

export default function Rotas(){
    return(
    <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Cadastro" component={Cadastro}/>
        <Stack.Screen name="Chat" component={Chat}/>
        <Stack.Screen name="BuscaChat" component={BuscaChat}/>
    </Stack.Navigator>
    );
}
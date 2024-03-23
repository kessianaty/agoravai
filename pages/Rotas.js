import { createStackNavigator } from "@react-navigation/stack";

import Login from './Login';
import Chat from './Chat';
import Cadastro from './Cadastro';

const Stack = createStackNavigator();

export default function Rotas(){
    return(
    <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Chat" component={Chat}/>
        <Stack.Screen name="Cadastro" component={Cadastro}/>
    </Stack.Navigator>
    );
}
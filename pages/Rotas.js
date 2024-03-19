import { createStackNavigator } from "@react-navigation/stack";

// import Login from './Login';
import Chat from './Chat';

const Stack = createStackNavigator();

export default function Rotas(){
    return(
    <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={Login}/> */}
        <Stack.Screen name="Chat" component={Chat}/>
    </Stack.Navigator>
    );
}
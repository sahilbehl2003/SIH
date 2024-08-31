import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';

const Stack = createStackNavigator();

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      {/* baaki screens idhar aaigi agar koi aur add karni hain toh*/}
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;

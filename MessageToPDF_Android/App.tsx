

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';


const App: React.FC = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  return (
    <div>
      <h1>My App</h1>
      <TouchableOpacity onPress={handleClick}>
        <Text>Button</Text>
      </TouchableOpacity>
    </div>
  );
};

export default App;



import React, {Component} from 'react';
import SQLite from 'react-native-sqlite-storage';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class App extends Component{
    constructor(props){
        super(props);
        SQLite.enablePromise(true);
        SQLite.openDatabase({
            name: 'mmssms.db',
            createFromLocation: 1,
        },
        () => {console.log("Location Found")},
        error => console.log(error)
        );
    }

    render() {

    handleButtonClick = () => {
        let sql = "select * from sms;";
        db.transaction((tx) => {
            tx.executeSql(sql, [], (tx, result) => {
                for (let i = 0; i < result.rows.length; i++) {
                    console.log("Hello");
                }
            }, (error) => {
                console.log("PRAGMA error", error);
            });
        });
    }

    styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        titleSection: {
          backgroundColor: 'blue',
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          overflow: 'hidden', // Clip the child components to the border
          padding: 20,
          width: '100%',
          height: '20%', // 2/5 of the screen height
        },
        titleContainer: {
          position: 'relative',
        },
        titleRectangle: {
          backgroundColor: 'black',
          height: 75, // Adjust based on your design
          width: 200, // Let the content determine the width
          borderRadius: 10,
          zIndex: 1,
        //  padding: 10,
        //  marginBottom: 10,
         // position: 'absolute',
          top: '15%', // Center vertically
        //  left: '-12%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        title: {
          fontSize: 25,
          color: 'white',
          textAlign: 'center',
          fontFamily: 'Oswald-Bold',
          zIndex: 2, 
          justifyContent: 'center',
          alignItems: 'center',
          top: '-35%',
        },
        buttonContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        button: {
          backgroundColor: 'lightblue',
          padding: 10,
          borderRadius: 10,
        },
        buttonText: {
          color: 'white',
          fontSize: 16,
          textAlign: 'center',
        },
    });
        return (
            <View style={styles.container}>
            <View style={styles.titleSection}>
                <View style={styles.titleContainer}>
                <View style={styles.titleRectangle} />
                <Text style={styles.title}>TEXTIDENCE</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={handleButtonClick}
                >
                <Text style={styles.buttonText}>Press me</Text>
                </TouchableOpacity>
            </View>
            </View>
        );
    }
}

    
export default App;

import React, {useEffect, useCallback, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList, Alert, PermissionsAndroid} from 'react-native';
import { getDBConnection} from './dService';
import { Dropdown } from 'react-native-element-dropdown';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from "react-native-file-viewer";


const App: React.FC = (): JSX.Element => {

  const [jsonContent, setJsonContent] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const db = await getDBConnection();

        const smsEntries: any[] = [];

        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM sms',
            [],
            (tx, results) => {
              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                smsEntries.push(row);
              }
              //const jsonContent = JSON.stringify(smsEntries, null, 2);
              setJsonContent(smsEntries);
              
            },
            error => {
              console.log('Error selecting addresses:', error);
            }
          );
        });
      } catch (error) {
        console.error(error);
      }
    };

    // Call the load function when the component mounts
    load();
  }, []); 

  const generatePDF = async () => {
    // Filter data based on the selected address
    const filteredData = jsonContent.filter(entry => entry.address === selectedValue);

    // Create HTML content dynamically
    const htmlContent = `
      <html>
        <body>
          <h1>PDF Report for Number: ${selectedValue}</h1>
          ${filteredData.map(entry => `
            <div>
              <p><strong>_id:</strong> ${entry._id}</p>
              <p><strong>Phone Numebr:</strong> ${entry.address}</p>
              <p><strong>body:</strong> ${entry.body}</p>
              <p><strong>Seen:</strong> ${entry.seen}</p>
              <p><strong>Thread Id:</strong> ${entry.thread_id}</p>
              <p><strong>Date Sent:</strong> ${entry.data_sent}</p>
              <!-- Add other fields as needed -->
            </div>
          `).join('')}
        </body>
      </html>
    `;

    let fileName = `report_${selectedValue}`;

    var options = {
      html: htmlContent,
      fileName: fileName,
      directory: 'Download'
    };

    const file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath); // This will give you the path to the generated PDF file
    if(file.filePath){
      Alert.alert("Successfully Exported", "Path:" + file.filePath, [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open', onPress: () => openPDF(file.filePath)}
      ], {cancelable: true});
    }
  };

  const openPDF = (filepath: any) =>{
    const path = filepath
    FileViewer.open(path) // absolute-path-to-my-local-file.
    .then(() => {
      console.log("PDF Showing");
    })
    .catch((error) => {
      console.log(error);
    });
  }


  const dropdownData = jsonContent.map(entry => ({
    label: entry.address,
    value: entry.address,
  }));


  const handleButtonClick = () => {
    console.log("Start");
    console.log("End");
    console.log("JSON:", jsonContent);
    console.log(selectedValue);
    generatePDF();
  };

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
          <Text style={styles.buttonText}>Generate PDF</Text>
        </TouchableOpacity>
      </View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data = {dropdownData}
        search
        labelField="label"
        valueField="value"
        placeholder="Select a Number"
        searchPlaceholder="Enter Number..."
        value = {selectedValue}
        onChange={item => {
          item.value,
          setSelectedValue(item.value)
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // justifyContent: 'center',
   // alignItems: 'center',
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
    marginTop: 50
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  dropdown: {
    margin: 110,
    height: 10,
    width: 200,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    zIndex: 10,
    padding: 20,
    position: 'absolute',
    top: "20%"
    
  },
  placeholderStyle: {
    fontSize: 16,
    marginBottom: 30,
    marginLeft: 25,
    position: 'absolute'
  },
  selectedTextStyle: {
    fontSize: 16,
    marginBottom: 30,
    marginLeft: 25,
    position: 'absolute'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default App;


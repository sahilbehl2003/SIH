import React, { useState } from "react";
import { Alert, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import * as AppGeneral from "../socialcalc/index.js";
import { File, Local } from "../Storage/LocalStorage";
import { DATA } from "../../app-data.js";
import AntDesign from 'react-native-vector-icons/AntDesign'; // Adjusted import

const NewFile: React.FC<{
  file: string;
  updateSelectedFile: Function;
  store: Local;
  billType: number;
}> = (props) => {
  const [showAlertNewFileCreated, setShowAlertNewFileCreated] = useState(false);

  const newFile = () => {
    if (props.file !== "default") {
      const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
      const data = props.store._getFile(props.file);
      const file = new File(
        (data as any).created,
        new Date().toString(),
        content,
        props.file,
        props.billType
      );
      props.store._saveFile(file);
      props.updateSelectedFile(props.file);
    }
    const msc = DATA["home"][AppGeneral.getDeviceType()]["msc"];
    AppGeneral.viewFile("default", JSON.stringify(msc));
    props.updateSelectedFile("default");
    setShowAlertNewFileCreated(true);
  };

  // Use an effect to show the alert when state changes
  React.useEffect(() => {
    if (showAlertNewFileCreated) {
      Alert.alert(
        "Alert Message",
        "New file created!",
        [{ text: "Ok", onPress: () => setShowAlertNewFileCreated(false) }],
        { cancelable: false }
      );
    }
  }, [showAlertNewFileCreated]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => {
        newFile();
        // console.log("New file clicked");
      }}>
        <AntDesign name="pluscircleo" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
});

export default NewFile;

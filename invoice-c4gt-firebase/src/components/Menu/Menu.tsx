import React, { useState } from "react";
import { Modal, View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import Toast from 'react-native-toast-message';
import { APP_NAME } from "../../app-data.js";
import * as AppGeneral from "../socialcalc/index.js";
import { Local, File } from "../Storage/LocalStorage";

const Menu: React.FC<{
  showM: boolean;
  setM: Function;
  file: string;
  updateSelectedFile: Function;
  store: Local;
  bT: number;
}> = (props) => {
  const [showAlert, setShowAlert] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState("");

  /* Utility functions */
  const _validateName = async (filename: string) => {
    filename = filename.trim();
    if (filename === "default" || filename === "Untitled") {
      showToast("Cannot update default file!");
      return false;
    } else if (filename === "" || !filename) {
      showToast("Filename cannot be empty");
      return false;
    } else if (filename.length > 30) {
      showToast("Filename too long");
      return false;
    } else if (/^[a-zA-Z0-9- ]*$/.test(filename) === false) {
      showToast("Special Characters cannot be used");
      return false;
    } else if (await props.store._checkKey(filename)) {
      showToast("Filename already exists");
      return false;
    }
    return true;
  };

  const getCurrentFileName = () => {
    return props.file;
  };

  const showToast = (message: string) => {
    Toast.show({
      type: 'error',  // or 'success' based on the type of message
      position: 'bottom',
      text1: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const doPrint = () => {
    Alert.alert("Print", "Printing functionality is not implemented.");
  };

  const doSave = () => {
    if (props.file === "default") {
      setShowAlert("Cannot update default file!");
      return;
    }
    const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
    const data = props.store._getFile(props.file);
    const file = new File(
      (data as any).created,
      new Date().toString(),
      content,
      props.file,
      props.bT
    );
    props.store._saveFile(file);
    props.updateSelectedFile(props.file);
    setShowAlert("File updated successfully");
  };

  const doSaveAs = async () => {
    if (await _validateName(newFilename)) {
      const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
      const file = new File(
        new Date().toString(),
        new Date().toString(),
        content,
        newFilename,
        props.bT
      );
      props.store._saveFile(file);
      props.updateSelectedFile(newFilename);
      setShowAlert("File saved successfully");
    } else {
      showToast("Invalid filename");
    }
  };

  const sendEmail = () => {
    Alert.alert("Email", "Email functionality is not implemented.");
  };

  return (
    <View>
      <Modal visible={props.showM} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Button title="Save" onPress={doSave} />
          <Button title="Save As" onPress={() => setShowAlert("Enter new filename")} />
          <Button title="Print" onPress={doPrint} />
          <Button title="Email" onPress={sendEmail} />
          <Button title="Close" onPress={() => props.setM(false)} />
        </View>
      </Modal>

      <Modal visible={!!showAlert} transparent={true} animationType="slide">
        <View style={styles.alertContainer}>
          <Text>{showAlert}</Text>
          <Button title="Ok" onPress={() => setShowAlert(null)} />
        </View>
      </Modal>

      <Modal visible={!!newFilename} transparent={true} animationType="slide">
        <View style={styles.alertContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter filename"
            value={newFilename}
            onChangeText={setNewFilename}
          />
          <Button title="Save" onPress={doSaveAs} />
          <Button title="Cancel" onPress={() => setNewFilename("")} />
        </View>
      </Modal>

      {/* Toast component for showing messages */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default Menu;

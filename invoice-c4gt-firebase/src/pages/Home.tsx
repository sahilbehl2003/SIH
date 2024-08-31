import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  FlatList,
  Platform,
  Button as RNButton,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { initFirebase } from '../firebase/index';
import Login from '../components/Login/Login';
import Files from '../components/Files/Files';
import NewFile from '../components/NewFile/NewFile';
import * as AppGeneral from '../components/socialcalc/index.js';
import { Local } from '../components/Storage/LocalStorage';
import { DATA } from '../app-data';

const Home: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFile, updateSelectedFile] = useState('default');
  const [billType, updateBillType] = useState(1);
  const [showPopover, setShowPopover] = useState(false);
  const [device] = useState('default');

  const store = new Local();

  useEffect(() => {
    initFirebase();
    const data = DATA['home'][device]['msc'];
    AppGeneral.initializeApp(JSON.stringify(data));
  }, []);

  useEffect(() => {
    AppGeneral.activateFooterButton(billType);
  }, [billType]);

  const footers = DATA['home'][device]['footers'];

  const handleFooterPress = (index: number) => {
    updateBillType(index);
    AppGeneral.activateFooterButton(index);
    setShowPopover(false);
  };

  const handleMenuPress = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>APP_NAME</Text>
        <TouchableOpacity onPress={() => setShowPopover(true)}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Login />

      <Files
        filesFrom="Local"
        store={store}
        file={selectedFile}
        updateSelectedFile={updateSelectedFile}
        updateBillType={updateBillType}
      />
      <Files
        filesFrom="Cloud"
        store={store}
        file={selectedFile}
        updateSelectedFile={updateSelectedFile}
        updateBillType={updateBillType}
      />

      <NewFile
        file={selectedFile}
        updateSelectedFile={updateSelectedFile}
        store={store}
        billType={billType}
      />

      {showPopover && (
        <Modal
          transparent
          visible={showPopover}
          animationType="slide"
          onRequestClose={() => setShowPopover(false)}
        >
          <View style={styles.popoverContainer}>
            <FlatList
              data={footers}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleFooterPress(item.index)}
                >
                  <Text style={styles.buttonText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.index.toString()}
            />
          </View>
        </Modal>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Editing: {selectedFile}</Text>
      </View>

      {Platform.OS === 'ios' && (
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={handleMenuPress}>
            <Icon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {showMenu && (
        <Modal
          transparent
          visible={showMenu}
          animationType="slide"
          onRequestClose={handleCloseMenu}
        >
          <View style={styles.menuContainer}>
            {/* idhar menur component aaega*/}
          </View>
        </Modal>
      )}

      <View style={styles.webContent}>
        <View style={styles.control}></View>
        <View style={styles.editor}></View>
        <View style={styles.msg}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3f51b5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  popoverContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fab: {
    backgroundColor: '#3f51b5',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  webContent: {
    flex: 1,
    padding: 20,
  },
  control: {
    height: 100,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  editor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  msg: {
    height: 50,
    backgroundColor: '#f5f5f5',
  },
});

export default Home;

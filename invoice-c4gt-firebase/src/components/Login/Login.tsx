import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoginFormComponent from "./LoginFormComponent";
import {
  logOut,
  signUpWithEmailAndPassword,
  loginWithEmailPassword
} from "../../firebase/auth";
import useUser from "../../hooks/useUser";

const Login = () => {
  const { user, isLoading } = useUser();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const doSignIn = async (email: string, password: string) => {
    try {
      await loginWithEmailPassword(email, password);
      closeLoginModal();
    } catch {
      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const doSignUp = async (email: string, password: string) => {
    try {
      await signUpWithEmailAndPassword(email, password);
      closeLoginModal();
    } catch {
      Alert.alert("Error", "Something Went Wrong");
    }
  };

  const closeLoginModal = () => setOpenLoginModal(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (!user) setOpenLoginModal(true);
          else {
            try {
              await logOut();
            } catch {
              Alert.alert("Error", "Something Went Wrong");
            }
          }
        }}
      >
        <Icon name={user ? "log-out" : "person"} size={30} color="#000" />
        <Text style={styles.buttonText}>{user ? "Logout" : "Login"}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={openLoginModal}
        animationType="slide"
        onRequestClose={closeLoginModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <LoginFormComponent handleSignUp={doSignUp} handleLogin={doSignIn} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
});

export default Login;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import { DATA } from "../../app-data.js";
import * as AppGeneral from "../socialcalc/index.js";
import { Local } from "../Storage/LocalStorage";
import Icon from "react-native-vector-icons/Ionicons";
import useUser from "../../hooks/useUser";
import {
  getFilesKeysFromFirestore,
  uploadFileToCloud,
  downloadFileFromFirebase,
  deleteFileFromFirebase,
} from "../../firebase/firestore";

interface Props {
  store: Local;
  file: string;
  updateSelectedFile: (file: string) => void;
  updateBillType: (billType: number) => void; 
  filesFrom: "Local" | "Cloud";
}


const Files: React.FC<Props> = ({
  store,
  file,
  updateSelectedFile,
  updateBillType,
  filesFrom,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState<{ key: string; date: Date }[]>([]);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const { user, isLoading } = useUser();

  const editFile = (key: string) => {
    store._getFile(key).then((data) => {
      AppGeneral.viewFile(key, decodeURIComponent((data as any).content));
      updateSelectedFile(key);
      updateBillType((data as any).billType);
    });
  };

  const moveFileToCloud = (key: string) => {
    store._getFile(key).then((fileData) => {
      if (user) {
        uploadFileToCloud(user, fileData, () => {
          Alert.alert("Success", "File Uploaded to Cloud");
          setModalVisible(false);
        });
      } else {
        Alert.alert("Error", "Login to Continue");
        setModalVisible(false);
      }
    });
  };

  const deleteFile = (key: string) => {
    Alert.alert(
      "Delete file",
      `Do you want to delete the ${key} file?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            if (filesFrom === "Local") {
              store._deleteFile(key);
              loadDefault();
            } else {
              deleteFileFromFirebase(user.uid, key, () => {
                setModalVisible(false);
                loadDefault();
              });
            }
            setCurrentKey(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const loadDefault = () => {
    const msc = DATA["home"][AppGeneral.getDeviceType()]["msc"];
    AppGeneral.viewFile("default", JSON.stringify(msc));
    updateSelectedFile("default");
  };

  const _formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const temp = async () => {
    let files;
    if (filesFrom === "Local") {
      files = await store._getAllFiles();
    } else if (filesFrom === "Cloud") {
      if (isLoading) return;
      if (!user) {
        Alert.alert("Error", "Login to Continue");
      } else {
        files = await getFilesKeysFromFirestore(user.uid);
      }
    }
    setFiles(Object.keys(files).map((key) => ({ key, date: files[key] })));
  };

  useEffect(() => {
    temp();
  }, [modalVisible]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.iconButton}
      >
        <Icon
          name={filesFrom === "Local" ? "file-tray-full" : "cloud-download"}
          size={30}
          color="#000"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={files}
            renderItem={({ item }) => (
              <View style={styles.fileItem}>
                <Text>{item.key}</Text>
                <Text style={styles.fileDate}>{_formatDate(item.date)}</Text>
                {filesFrom === "Local" && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      editFile(item.key);
                    }}
                  >
                    <Icon name="create" size={25} color="orange" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    if (filesFrom === "Local") moveFileToCloud(item.key);
                    else
                      downloadFileFromFirebase(user.uid, item.key, () =>
                        setModalVisible(false)
                      );
                  }}
                >
                  <Icon
                    name={filesFrom === "Local" ? "cloud-upload" : "cloud-download"}
                    size={25}
                    color="blue"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    deleteFile(item.key);
                  }}
                >
                  <Icon name="trash" size={25} color="red" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.key}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  fileDate: {
    fontSize: 12,
    color: "#9b4dca",
    marginRight: 20,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#6c757d",
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Files;

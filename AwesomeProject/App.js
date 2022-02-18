import {useState, useEffect, useRef} from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import * as Sharing from 'expo-sharing'; 
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import logo from './assets/logo.png'

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [hasPermission, setHasPermission] = useState(null);
  const [camera,setCamera] = useState(null)
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null)

  // let camera: Camera



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

 const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null);
      //console.log(data.uri)
      setImage(data.uri)
    }
  }
 

  let chooseImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
 
    if (permissionResult.granted === false) {
    alert("Permission to access camera roll is required!");
    return;
  }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri })
 }

 let shareImage = async () => {
  if (Platform.OS === 'web') {
    alert(`Uh oh, sharing isn't available on your platform`);
    return;
  }

  await Sharing.shareAsync(selectedImage.localUri);
}; 

 if (selectedImage !== null) {
  return (
    <View style={styles.container}>
      
      <Image
        source={{ uri: selectedImage.localUri }}
        style={styles.thumbnail}
      />
              <TouchableOpacity onPress={shareImage} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
        
    </View>
  );
}

 


  return (
    <View style={styles.container}>
      
        <Camera ref={ref => setCamera(ref)} style={styles.camera} type={type} ratio={'1:1'} />
        <Button
        style={styles.button}
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
        
      </Button>
      <Button title="Take Picture" onPress={() => takePicture()} />
      {<Image source={{uri: image}}  />}
      


      <Text style={styles.instructions}>Tap the button below to share images</Text>
      <Image source={logo} style={styles.logo}></Image>

      <TouchableOpacity
        onPress={chooseImage}
        style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
  }, 
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  }, 
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "cover"
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
});


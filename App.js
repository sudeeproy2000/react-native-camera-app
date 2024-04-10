import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  Dimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let submitPhoto = async () => {
      try {
        // Save the photo to AsyncStorage or submit to your database
        // For example:
        // await AsyncStorage.setItem('photo', photo.base64);
        // Or submit to your database
        // const response = await fetch('YOUR_API_ENDPOINT', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     photo: photo.base64,
        //   }),
        // });
        // if (response.ok) {
        //   setPhoto(undefined);
        // } else {
        //   console.error('Failed to submit photo');
        // }
        console.log("Photo submitted/saved.");
        setPhoto(undefined);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        {hasMediaLibraryPermission ? (
          <Button title="Submit" onPress={submitPhoto} />
        ) : undefined}
        <Button title="Retake" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={cameraRef}
        type={Camera.Constants.Type.back}
      />
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    aspectRatio: 1,
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  preview: {
    aspectRatio: 1,
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 30,
  },
});

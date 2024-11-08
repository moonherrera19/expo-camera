import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import Button from './src/components/button';
export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);



  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  }


  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('picture save!')
        setImage(null);
      } catch (e) {
        console.log(e)
      }
    }
  }


  if (hasCameraPermission === false) {
    return <Text>no tienes acceso a la camra </Text>
  }

  return (
    <View style={styles.container}>
      {!image ?
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30,
          }}>
            <Button icon={'retweet'} onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back)
            }} />
            <Button icon={'flash'}
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
              onPress={() => {
                setFlash(flash === Camera.Constants.FlashMode.torch
                  ? Camera.Constants.FlashMode.off
                  : Camera.Constants.FlashMode.torch
                )
              }} />
          </View>
        </Camera>
        :
        <Image source={{ uri: image }} style={styles.camera} />
      }
      <View>
        {image ?
          <View Style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50
          }}>
            <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} />
            <Button title={"save"} icon="check" onPress={saveImage} />
          </View>
          :
          <Button title={'take  a picture'} icon="camera" onPress={takePicture} />
        }
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  }
});






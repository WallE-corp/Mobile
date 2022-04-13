import { StatusBar } from 'expo-status-bar';
import {React, useState, SetState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, DeviceEventEmitter} from 'react-native';
import Modal from "react-native-modal";

import io from "socket.io-client";

import direction from "../wall-e/assets/right-arrow.png";
import directionLight from "../wall-e/assets/right-arrow-light.png";
import wallE from "../wall-e/assets/title.png";

export default function App() {

  const [isModalVisible, setIsModalVisible] = useState(true);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const[alternateImage, setAlternateImage] = useState(true);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const changeImage = () => {
    setAlternateImage(alternateImage => !alternateImage);
  }

  const click = () => {
    console.log("weshhh");
  }

  socket = io("http://212.25.136.164:8080");

  const combined = () => {
    //handleModal
    console.log("ici");
    socket.emit('message', JSON.stringify(
      { type:4, data:
        {'movement' : 'left', 'action' : 'start'}
      }
    )
  )
  socket.on('message', function (data) {
    console.log(data)
  })
}

  socket.connect();

  useEffect(() => {
    const callback = data => {
        console.log('received: ',data);
        setArrivalMessage({
            data
        })
    }

    socket.on('message', callback);
    console.log('arrival msg: ',arrivalMessage);

    // ADD THIS
    return () => {
      socket.off(event, callback)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage, socket]);
 
  socket.on('message', function (data) {
    console.log(data)
  })

  return (
    <View style={styles.container}>
      <Image source={wallE} style={{ width: 200, height: 50 }}></Image>
      <View style={styles.SquareShapeView}>

      </View>
      <Modal isVisible={isModalVisible} style = {{}}>
        <View style={styles.container}>
        <Text style={styles.Writing}>You have to first map the area by </Text>
        <Text style={styles.Writing}>pressing the button</Text>
          <TouchableOpacity title="Hide modal" onPress={combined} style={{position: 'absolute', width: '70%', left:'15%',  height: '5%',  top: '60%',  borderColor: 'white', borderRadius: 20, borderWidth: 2}}>
           <Text style={styles.ButtonWriting}>Start mapping</Text>
          </TouchableOpacity>
        </View>
      </Modal>
        <TouchableOpacity
            onPress={changeImage}
            style={styles.ButtonGros}
          >
            {alternateImage && <Text style={styles.ButtonWriting}>End control wall-e</Text>}
            {!alternateImage && <Text style={styles.ButtonWriting}>Take control wall-e</Text>}
          
        </TouchableOpacity>

        <TouchableOpacity style={{borderRadius: 100, height: 40, width: 40}} onPress={click}>
          {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg'}]}}/>}
          {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg'}]}}/>}
        </TouchableOpacity>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity style={{borderRadius: 100, height: 40, width: 40}} onPress={click}>
            {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", left: -60, width: 32, height: 32,  transform: [{ rotate: '180deg'}]}}/>}
            {!alternateImage && <Image source={directionLight} style={{top: '100%',  position: "absolute", left: -60, width: 32, height: 32, transform: [{ rotate: '180deg'}]}}/>}
          </TouchableOpacity>
          <TouchableOpacity style={{borderRadius: 100, height: 40, width: 40}} onPress={click}>
            {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", left: 60, width: 32, height: 32,  transform: [{ rotate: '0deg'}]}}/>}
            {!alternateImage && <Image source={directionLight} style={{top: '100%',  position: "absolute", left: 60, width: 32, height: 32, transform: [{ rotate: '0deg'}]}}/>}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{borderRadius: 100, height: 40, width: 40}} onPress={click}>
          {alternateImage && <Image source={direction} style={{top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '90deg'}]}}/>}
          {!alternateImage && <Image source={directionLight} style={{top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '90deg'}]}}/>}
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // width: '100%',
    backgroundColor: '#A9A9A9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
  },
  title : {

  },
  SquareShapeView: {
   // flexShrink: 1,
   alignContent: 'flex-start',
    width: '80%',
    height: '60%',
  //  left: '10%',
    marginBottom: '7%',
    backgroundColor: '#DCDCDC',
    borderColor: '#000000', 
    borderRadius: 20,
    borderWidth: 2,
  },
  ButtonGros: {
    position: 'absolute',
    width: '70%',
    height: '5%',
    top: '75%',


    borderColor: '#000000',
    borderRadius: 20,
    borderWidth: 2,
  },
  ButtonWriting: {
    position: 'absolute',
    width: '100%',
    height: 25,
    top: '10%',
    textAlign: "center",

    fontWeight: '400',
    fontSize: 18,
    lineHeight: 21,

    color: '#000000',
  },
  Writing: {
    width: '80%',
    height: 25,
    textAlign: "center",

    fontWeight: '400',
    fontSize: 18,
    lineHeight: 21,

    color: '#000000',
  }
});

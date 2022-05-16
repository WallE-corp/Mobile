import { StatusBar } from 'expo-status-bar';
import { React, useState, SetState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import Modal from "react-native-modal";

import io from "socket.io-client";

import direction from "./assets/right-arrow.png";
import directionLight from "./assets/right-arrow-light.png";
import wallE from "./assets/title.png";

export default function App() {

  const [isModalVisible, setIsModalVisible] = useState(true);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [alternateImage, setAlternateImage] = useState(true);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [leftState, setleftState] = useState(false);
  const [rightState, setrightState] = useState(false);
  const [forwardState, setforwardState] = useState(false);
  const [backwardState, setbackwardState] = useState(false);

  /* Move entire socket logic to a separate file */
  // ==========================================================
  // Only set socket once then reuse the same instance
  const socketRef = useRef(io("http://13.49.136.160:3000"));
  const socket = socketRef.current;

  // This runs once when component mounts
  useEffect(() => {
    // Attach event listener to socket 
    socket.on('message', (data) => {
      console.log('received: ', data);
      setArrivalMessage(data);
    });

    socket.on('connect', () => {
      // Register as remote controller of walle
      const data = {
        type: 6,
        data: {
          role: "remote",
        },
      };
      socket.emit('message', JSON.stringify(data));
    });

    // Connect 
    socket.connect();

    // When component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const startMappingPressed = () => {

    const data = {
      type: 5, // Type 5 = start calibration
      data: {
        "mapId": "ASDydASd7AGb9sD", // not needed, just test data
      }
    }
    socket.emit('message', JSON.stringify(data));
  }

  const remote = () => {
    const data = {
      "type": 6,
      "data": {
        "role": "remote"
      }
    }
    socket.emit('message', JSON.stringify(data));
  }

  const Right = () => {
    if (rightState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "right",
          "action": "start"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setrightState(rightState => !rightState);
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "right",
          "action": "stop"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setrightState(rightState => !rightState);
    }
    
  }

  const Left = () => {
    if (leftState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "left",
          "action": "start"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setleftState(leftState => !leftState);
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "left",
          "action": "stop"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setleftState(leftState => !leftState);
    }
  }

  const Forward = () => {

    if (forwardState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "forward",
          "action": "start"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setforwardState(forwardState => !forwardState);
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "forward",
          "action": "stop"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setforwardState(forwardState => !forwardState);
    }
  }

  const Backward = () => {

   if (backwardState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "backward",
          "action": "start"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setbackwardState(backwardState => !backwardState);
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "backward",
          "action": "stop"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setbackwardState(backwardState => !backwardState);
    }
  }

  const BackwardStop = () => {

    const data = {
      "type": 4,
      "data": {
        "movement": "backward",
        "action": "stop"
      }
    }
    socket.emit('message', JSON.stringify(data));
  }

  const changeImage = () => {
    setAlternateImage(alternateImage => !alternateImage);
  }

  const getMap= () => {
    console.log("weshhh");
    fetch("http://13.49.136.160:3000/map/", {
      "method": "GET",
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const getPathpoints = () => {
    console.log("weshhh");
    fetch("http://13.49.136.160:3000/pathpoints/", {
      "method": "GET",
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const getObstacle = () => {
    console.log("weshhh");
    fetch("http://13.49.136.160:3000/obstacle/", {
      "method": "GET",
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const click = () => {
    console.log("weshhh");
    fetch("http://13.49.136.160:3000/map/", {
      "method": "GET",
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <View style={styles.container}>
      <Image source={wallE} style={{ width: 200, height: 50 }}></Image>
      <View style={styles.SquareShapeView}>

      </View>
      <Modal isVisible={isModalVisible} style={{}}>
        <View style={styles.container}>
          <Text style={styles.Writing}>You have to first map the area by {arrivalMessage}</Text>
          <Text style={styles.Writing}>pressing the button</Text>
          <TouchableOpacity title="Hide modal" onPress={startMappingPressed} style={{ position: 'absolute', width: '70%', left: '15%', height: '5%', top: '60%', borderColor: 'white', borderRadius: 20, borderWidth: 2 }}>
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

      <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={click}>
        {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg' }] }} />}
        {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg' }] }} />}
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={click}>
          {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", left: -60, width: 32, height: 32, transform: [{ rotate: '180deg' }] }} />}
          {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", left: -60, width: 32, height: 32, transform: [{ rotate: '180deg' }] }} />}
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={click}>
          {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", left: 60, width: 32, height: 32, transform: [{ rotate: '0deg' }] }} />}
          {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", left: 60, width: 32, height: 32, transform: [{ rotate: '0deg' }] }} />}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={click}>
        {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '90deg' }] }} />}
        {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '90deg' }] }} />}
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
  title: {

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

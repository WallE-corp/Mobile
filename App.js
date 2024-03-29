import { StatusBar } from 'expo-status-bar';
import { React, useState, SetState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import Modal from "react-native-modal";

import io from "socket.io-client";

import direction from "./assets/right-arrow.png";
import directionLight from "./assets/right-arrow-light.png";
import cross from "./assets/close.png"
import wallE from "./assets/title.png";
import arrObstacle from "./test.json"

import jsonTest from "./test.json";
import Svg, { Line, Circle } from 'react-native-svg';

let mappyObj = [];

export default function App() {

  const [mappy, setMappy] = useState([]);
  //const [mappyObj, setMappyObj] = useState([]);


  const [isModalVisible, setIsModalVisible] = useState(true);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [alternateImage, setAlternateImage] = useState(true);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [leftState, setleftState] = useState(false);
  const [rightState, setrightState] = useState(false);
  const [forwardState, setforwardState] = useState(false);
  const [backwardState, setbackwardState] = useState(false);
  const [autoState, setautoState] = useState(false);

  const socketRef = useRef(io("http://13.49.136.160:3000"));
  const socket = socketRef.current;

  const [datas, setData] = useState([]);
  const [datasObj, setDataObj] = useState([]);

  useEffect(() => {
    setInterval(() => { getPathpoints() }, 5000);

    socket.on('message', (data) => {
      const dataJson = JSON.parse(data);
      if (autoState == true && dataJson.type == 11) {
      } else if (dataJson.type == 9) {
        let list = [];
        list.push([dataJson.data.x, dataJson.data.y, dataJson.data.label]);
        mappyObj = list;
        createMap(datas, list)
      }
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
      clearTimeout(timer);
    };
  }, []);


  const startMappingPressed = () => {
    handleModal()
    const data = {
      type: 5, // Type 5 = start calibration
      data: {
        "mapId": "ASDydASd7AGb9sD", // not needed, just test data
      }
    }
    socket.emit('message', JSON.stringify(data));
  }

  const remote = () => {
    if (autoState == false) {
      const data = {
        "type": 10,
        "data": {
          "movement": "auto",
          "action": "start"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setautoState(autoState => !autoState);
    } else {
      const data = {
        "type": 10,
        "data": {
          "movement": "auto",
          "action": "stop"
        }
      }
      socket.emit('message', JSON.stringify(data));
      setautoState(autoState => !autoState);
    }
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
    ;
    if (forwardState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "forward",
          "action": "start"
        }
      }
      socket.emit('message', JSON.stringify(data));
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "forward",
          "action": "stop"
        }
      }
      socket.emit('message', JSON.stringify(data));

    }
    setforwardState(forwardState => !forwardState);
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

  const getPathpoints = () => {
    fetch("http://13.49.136.160:3000/pathpoints/", {
      "method": "GET",
    })
      .then(response => response.json())
      .then(response => {
        let list = [];
        response.map(item => {
          list.push(item.coordinates);
        })
        setData(list);
        createMap(list, datasObj);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const changeImage = () => {
    setAlternateImage(alternateImage => !alternateImage);
    remote();
  }

  const createMap = (arr, arrObstacle) => {
    //let arrObstacle =[[3, 5], [7, 8]]
    let tempLowX = 0;
    let tempHightX = 0;
    let tempLowY = 0;
    let tempHightY = 0;
    let sizeMaxX = 0;
    let sizeMaxY = 0;
    let makePosX = 0;
    let makePosY = 0;
    let size1pX = 0;
    let size1pY = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let temp = [];

    arr.forEach((element, index) => {
      if (element.x > tempHightX)
        tempHightX = element.x
      if (element.x < tempLowX) {
        tempLowX = element.x
      }
      if (element.y > tempHightY)
        tempHightY = element.y
      if (element.y < tempLowY) {
        tempLowY = element.y
      }
    });

    if (tempLowX < 0)
      makePosX += (-1) * tempLowX
    if (tempLowY < 0)
      makePosY += (-1) * tempLowY

    sizeMaxX = (tempHightX) - (tempLowX)
    sizeMaxY = (tempHightY) - (tempLowY)
    size1pX = sizeMaxX / 300;
    size1pY = sizeMaxY / 400;

    arr.forEach((element, index) => {
      x2 = ((element.x + makePosX) / size1pX);
      y2 = ((element.y + makePosY) / size1pY);
      temp.push(<Line x1={x1} y1={y1.toString()} x2={x2.toString()} y2={y2.toString()} stroke="red" strokeWidth="2" />);
      x1 = x2;
      y1 = y2;
    });

    let temp1 = [];
    if (mappyObj !== undefined) {
      mappyObj.forEach((element) => {
        cx = (element[0] + makePosX) / size1pX
        cy = (element[1] + makePosY) / size1pY
        temp1.push(<Circle cx={cx.toString()} cy={cy.toString()} r="5" stroke="black" strokeWidth="2" />);
      });
    }

    temp.push(temp1)
   
    setMappy(temp)
  }

  return (
    <View style={styles.container}>
      <Image source={wallE} style={{ width: 200, height: 50 }}></Image>
      <View style={styles.SquareShapeView}>
        <Svg height="400" width="300">
          {mappy}
        </Svg>
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

      <TouchableOpacity style={{ borderRadius: 10, height: 32, width: 32, marginBottom: 10 }} onPress={Forward}>
        {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg' }] }} />}
        {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg' }] }} />}
      </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <TouchableOpacity style={{ borderRadius: 10, height: 40, width: 40, marginRight: 80 }} onPress={Left}>
          {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '180deg' }] }} />}
          {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '180deg' }] }} />}
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 10, height: 40, width: 40 }} onPress={Right}>
          {alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '0deg' }] }} />}
          {!alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '0deg' }] }} />}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ borderRadius: 10, height: 32, width: 32 }} onPress={Backward}>
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

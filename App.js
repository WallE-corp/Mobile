import { StatusBar } from 'expo-status-bar';
import { React, useState, SetState, useEffect, Component, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import Modal from "react-native-modal";

import io from "socket.io-client";

import direction from "./assets/right-arrow.png";
import directionLight from "./assets/right-arrow-light.png";
import wallE from "./assets/title.png";
import { PixelRatio } from 'react-native-web';
import jsonTest from "./test.json"
import Socket from './Socket';

export default class App extends Component {
  state = {
    isModalVisible: true,
    alternateImage: true,
    mappy: [],
    arrivalMessage: null,
    leftState: false,
    rightState: false,
    forwardState: false,
    backwardState: false,
    autoState: false,
  }
  handleModal = () => setIsModalVisible(() => !this.isModalVisible);
  socketRef = useRef(io("http://13.49.136.160:3000"));
  socket = socketRef.current;

  componentDidMount() {
    
    this.socket.on('connect', () => {
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
    this.socket.connect();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  changeImage = () => {
    console.log("ici")
    const changeState = !this.alternateImage;
    this.setState({ alternateImage: changeState });
    this.remote();
  };

  click = () => {
    console.log("weshhh");
  };


  createMap = () => {
    tempLowX = 0;
    tempHightX = 0;
    tempLowY = 0;
    tempHightY = 0;
    sizeMaxX = 0;
    sizeMaxY = 0;
    makePosX = 0;
    makePosY = 0;
    size1pX = 0;
    size1pY = 0;

    console.log(jsonTest);
    jsonTest.mapCoor.map(mapCoor => {
      if (mapCoor.x > tempHightX)
        tempHightX = mapCoor.x
      if (mapCoor.x < tempLowX)
        tempLowX = mapCoor.x
      if (mapCoor.y > tempHightY)
        tempHightY = mapCoor.y
      if (mapCoor.y < tempLowY)
        tempLowY = mapCoor.y
    })
    if (tempLowX < 0)
      makePosX = tempLowX
    if (tempLowY < 0)
      makePosY = tempLowY
    sizeMaxX = (tempHightX + makePosX) - (tempLowX + makePosX)
    sizeMaxY = (tempHightY + makePosY) - (tempLowY + makePosY)
    size1pX = sizeMaxX / 300;
    size1pY = sizeMaxY / 400;

    jsonTest.mapCoor.map(mapCoor => {
      this.state.x2 = mapCoor.x / size1pX;
      this.state.y2 = mapCoor.y / size1pY;
      this.state.mappy.push(<Line x1={this.state.x1} y1={this.state.y1.toString()} x2={this.state.x2.toString()} y2={this.state.y2.toString()} stroke="red" strokeWidth="2" />);
      temp = this.state.mappy;
      this.state.x1 = this.state.x2;
      this.state.y1 = this.state.y2;
    })
    this.setState({ mappy: temp });
  }

  startMappingPressed = () => {

    const data = {
      type: 5, // Type 5 = start calibration
      data: {
        "mapId": "ASDydASd7AGb9sD", // not needed, just test data
      }
    }
    socket.emit('message', JSON.stringify(data));
  }

  remote = () => {
    if (this.autoState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "auto",
          "action": "start"
        }
      }
      console.log("auto start");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({autoState: true});
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "auto",
          "action": "stop"
        }
      }
      console.log("auto stop");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({autoState: false});
    }
  }

  Right = () => {
    if (this.rightState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "right",
          "action": "start"
        }
      }
      console.log("right start");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({rightState: true});
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "right",
          "action": "stop"
        }
      }
      console.log("right stop");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({rightState: false});
    }

  }

  Left = () => {
    if (this.leftState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "left",
          "action": "start"
        }
      }
      console.log("left start");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({leftState: true});
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "left",
          "action": "stop"
        }
      }
      console.log("left stop");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({leftState: false});
    }
  }

  Forward = () => {
    if (forwardState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "forward",
          "action": "start"
        }
      }
      console.log("forward start");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({forwardState: true});
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "forward",
          "action": "stop"
        }
      }
      console.log("forward stop");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({forwardState: false});
    }
  }

  Backward = () => {

    if (backwardState == false) {
      const data = {
        "type": 4,
        "data": {
          "movement": "backward",
          "action": "start"
        }
      }
      console.log("backward start");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({backwardState: true});
    } else {
      const data = {
        "type": 4,
        "data": {
          "movement": "backward",
          "action": "stop"
        }
      }
      console.log("backward stop");
      this.socket.emit('message', JSON.stringify(data));
      this.setState({rightState: false});
    }
  }

  getMap = () => {
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

  getPathpoints = () => {
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

  getObstacle = () => {
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

  combined = () => {
    console.log("la");
    this.handleModal();
    this.createMap();
  };


  render() {


    return (
      <View style={styles.container}>
        <Image source={wallE} style={{ width: 200, height: 50 }}></Image>
        <View style={styles.SquareShapeView}>
          <Svg height="400" width="300">
            {console.log(this.state.x2)}
            {this.state.mappy}
          </Svg>
        </View>
        <Modal isVisible={this.isModalVisible} style={{}}>
          <View style={styles.container}>
            <Text style={styles.Writing}>You have to first map the area by </Text>
            <Text style={styles.Writing}>pressing the button</Text>
            <TouchableOpacity title="Hide modal" onPress={this.combined} style={{ position: 'absolute', width: '70%', left: '15%', height: '5%', top: '60%', borderColor: 'white', borderRadius: 20, borderWidth: 2 }}>
              <Text style={styles.ButtonWriting}>Start mapping</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={this.changeImage()}
          style={styles.ButtonGros}
        >
          {this.state.alternateImage && <Text style={styles.ButtonWriting}>End control wall-e</Text>}
          {!this.state.alternateImage && <Text style={styles.ButtonWriting}>Take control wall-e</Text>}

        </TouchableOpacity>

        <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={this.Forward()}>
          {this.state.alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg' }] }} />}
          {!this.state.alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '-90deg' }] }} />}
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={this.Left()}>
            {this.state.alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", left: -60, width: 32, height: 32, transform: [{ rotate: '180deg' }] }} />}
            {!this.state.alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", left: -60, width: 32, height: 32, transform: [{ rotate: '180deg' }] }} />}
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={this.Right()}>
            {this.state.alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", left: 60, width: 32, height: 32, transform: [{ rotate: '0deg' }] }} />}
            {!this.state.alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", left: 60, width: 32, height: 32, transform: [{ rotate: '0deg' }] }} />}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ borderRadius: 100, height: 40, width: 40 }} onPress={this.Backward()}>
          {this.state.alternateImage && <Image source={direction} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '90deg' }] }} />}
          {!this.state.alternateImage && <Image source={directionLight} style={{ top: '100%', position: "absolute", width: 32, height: 32, transform: [{ rotate: '90deg' }] }} />}
        </TouchableOpacity>
      </View>
    );
  }
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

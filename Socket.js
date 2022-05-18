import { React, useState, SetState, useEffect, useRef } from 'react';
import io from "socket.io-client";


export default function Socket() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const [alternateImage, setAlternateImage] = useState(true);

    const [arrivalMessage, setArrivalMessage] = useState(null);

    const [leftState, setleftState] = useState(false);
    const [rightState, setrightState] = useState(false);
    const [forwardState, setforwardState] = useState(false);
    const [backwardState, setbackwardState] = useState(false);
    const [autoState, setautoState] = useState(false);
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
        if (autoState == false) {
            const data = {
                "type": 4,
                "data": {
                    "movement": "auto",
                    "action": "start"
                }
            }
            console.log("auto start");
            socket.emit('message', JSON.stringify(data));
            setautoState(autoState => !autoState);
        } else {
            const data = {
                "type": 4,
                "data": {
                    "movement": "auto",
                    "action": "stop"
                }
            }
            console.log("auto stop");
            socket.emit('message', JSON.stringify(data));
            setrightState(autoState => !autoState);
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
            console.log("right start");
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
            console.log("right stop");
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
            console.log("left start");
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
            console.log("left stop");
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
            console.log("forward start");
            socket.emit('message', JSON.stringify(data));
        } else {
            const data = {
                "type": 4,
                "data": {
                    "movement": "forward",
                    "action": "stop"
                }
            }
            console.log("forward stop");
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
            console.log("backward start");
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
            console.log("backward stop");
            socket.emit('message', JSON.stringify(data));
            setbackwardState(backwardState => !backwardState);
        }
    }

    const changeImage = () => {
        setAlternateImage(alternateImage => !alternateImage);
        remote();
    }

    const getMap = () => {
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
}
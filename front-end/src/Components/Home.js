import { useEffect, useState } from "react";
import prepForCall from "../webrtcUtilities/prepForCall";
import socketConnection from "../webrtcUtilities/socketConnection";
import clientSocketListeners from "../webrtcUtilities/clientSocketListeners";
import createPeerConnection from "../webrtcUtilities/createPeerConn";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Home.css"; // Import the CSS file

const Home = ({
    callStatus,
    updateCallStatus,
    setLocalStream,
    setRemoteStream,
    remoteStream,
    peerConnection,
    setPeerConnection,
    localStream,
    userName,
    setUserName,
    offerData,
    setOfferData,
}) => {
    const [typeOfCall, setTypeOfCall] = useState();
    const [joined, setJoined] = useState(false);
    const [availableCalls, setAvailableCalls] = useState([]);
    const navigate = useNavigate();

    // Called on "Call" or "Answer"
    const initCall = async (typeOfCall) => {
        // Set localStream and GUM
        await prepForCall(callStatus, updateCallStatus, setLocalStream);
        setTypeOfCall(typeOfCall); // Offer or answer
    };

    // Nothing happens until the user clicks join
    useEffect(() => {
        if (joined) {
            const userName = prompt("Enter username");
            setUserName(userName);
            const setCalls = (data) => {
                setAvailableCalls(data);
                console.log(data);
            };
            const socket = socketConnection(userName);
            socket.on("availableOffers", setCalls);
            socket.on("newOfferWaiting", setCalls);
        }
    }, [joined]);

    // We have media via GUM. Set up the peerConnection with listeners
    useEffect(() => {
        if (callStatus.haveMedia && !peerConnection) {
            const { peerConnection, remoteStream } = createPeerConnection(userName, typeOfCall);
            setPeerConnection(peerConnection);
            setRemoteStream(remoteStream);
        }
    }, [callStatus.haveMedia]);

    // Add socket listeners once the type of call and peerConnection are set
    useEffect(() => {
        if (typeOfCall && peerConnection) {
            const socket = socketConnection(userName);
            clientSocketListeners(socket, typeOfCall, callStatus, updateCallStatus, peerConnection);
        }
    }, [typeOfCall, peerConnection]);

    // Navigate to the call page once remoteStream and peerConnection are ready
    useEffect(() => {
        if (remoteStream && peerConnection) {
            navigate(`/${typeOfCall}?token=${Math.random()}`);
        }
    }, [remoteStream, peerConnection]);

    const call = async () => {
        initCall("offer");
    };

    const answer = (callData) => {
        initCall("answer");
        setOfferData(callData);
    };

    if (!joined) {
        return (
            <div className="home-container">
                <div className="join-screen">
                    <h1>Welcome to VideoCall</h1>
                    <button onClick={() => setJoined(true)} className="join-button">
                        Join
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="username">{userName}</h1>
                <div className="call-options">
                    <div className="call-section">
                        <h2>Make a Call</h2>
                        <button onClick={call} className="call-button">
                            Start Call
                        </button>
                    </div>
                    <div className="answer-section">
                        <h2>Available Calls</h2>
                        {availableCalls.map((callData, i) => (
                            <div key={i} className="call-card">
                                <button onClick={() => answer(callData)} className="answer-button">
                                    Answer Call From {callData.offererUserName}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
import { useEffect, useRef, useState } from "react";
import "./VideoPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";

const CallerVideo = ({
    remoteStream,
    localStream,
    peerConnection,
    callStatus,
    updateCallStatus,
    userName,
}) => {
    const remoteFeedEl = useRef(null); // React ref for remote video element
    const localFeedEl = useRef(null); // React ref for local video element
    const navigate = useNavigate();
    const [videoMessage, setVideoMessage] = useState("Please enable video to start!");
    const [offerCreated, setOfferCreated] = useState(false);

    // Redirect to home if no localStream
    useEffect(() => {
        if (!localStream) {
            navigate(`/`);
        } else {
            // Set video tags
            remoteFeedEl.current.srcObject = remoteStream;
            localFeedEl.current.srcObject = localStream;
        }
    }, [localStream, navigate, remoteStream]);

    // Disable video message if tracks are available
    useEffect(() => {
        if (peerConnection) {
            peerConnection.ontrack = (e) => {
                if (e?.streams?.length) {
                    setVideoMessage("");
                } else {
                    setVideoMessage("Disconnected...");
                }
            };
        }
    }, [peerConnection]);

    // Create offer if video is enabled
    useEffect(() => {
        const shareVideoAsync = async () => {
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            // Emit the offer to the server
            const socket = socketConnection(userName);
            socket.emit("newOffer", offer);
            setOfferCreated(true); // Prevent creating another offer
            setVideoMessage("Awaiting answer..."); // Update video message
            console.log("Created offer, setLocalDesc, emitted offer, updated videoMessage");
        };

        if (!offerCreated && callStatus.videoEnabled) {
            console.log("We have video and no offer... making offer");
            shareVideoAsync();
        }
    }, [callStatus.videoEnabled, offerCreated, peerConnection, userName]);

    // Add answer to peer connection
    useEffect(() => {
        const addAnswerAsync = async () => {
            await peerConnection.setRemoteDescription(callStatus.answer);
            console.log("Answer added!!");
        };

        if (callStatus.answer) {
            addAnswerAsync();
        }
    }, [callStatus, peerConnection]);

    return (
        <div className="video-call-container">
            <div className="videos">
                <VideoMessageBox message={videoMessage} />
                <video id="remote-feed" ref={remoteFeedEl} autoPlay controls playsInline></video>
                <video id="local-feed" ref={localFeedEl} autoPlay controls playsInline></video>
            </div>
            <ActionButtons
                localFeedEl={localFeedEl}
                remoteFeedEl={remoteFeedEl}
                callStatus={callStatus}
                localStream={localStream}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
            />
        </div>
    );
};

export default CallerVideo;
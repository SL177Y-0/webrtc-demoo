import { useEffect, useRef, useState } from "react";
import "./VideoPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";

const AnswerVideo = ({
    remoteStream,
    localStream,
    peerConnection,
    callStatus,
    updateCallStatus,
    offerData,
    userName,
}) => {
    const remoteFeedEl = useRef(null); // React ref for remote video element
    const localFeedEl = useRef(null); // React ref for local video element
    const navigate = useNavigate();
    const [videoMessage, setVideoMessage] = useState("Please enable video to start!");
    const [answerCreated, setAnswerCreated] = useState(false);

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

    // Create answer if video is enabled
    useEffect(() => {
        const addOfferAndCreateAnswerAsync = async () => {
            // Add the offer
            await peerConnection.setRemoteDescription(offerData.offer);
            console.log(peerConnection.signalingState); // have remote-offer
            // Create the answer
            console.log("Creating answer...");
            const answer = await peerConnection.createAnswer();
            peerConnection.setLocalDescription(answer);
            const copyOfferData = { ...offerData };
            copyOfferData.answer = answer;
            copyOfferData.answerUserName = userName;
            const socket = socketConnection(userName);
            const offerIceCandidates = await socket.emitWithAck("newAnswer", copyOfferData);
            offerIceCandidates.forEach((c) => {
                peerConnection.addIceCandidate(c);
                console.log("==Added ice candidate from offerer==");
            });
        };

        if (!answerCreated && callStatus.videoEnabled) {
            addOfferAndCreateAnswerAsync();
        }
    }, [callStatus.videoEnabled, answerCreated, offerData, peerConnection, userName]);

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

export default AnswerVideo;
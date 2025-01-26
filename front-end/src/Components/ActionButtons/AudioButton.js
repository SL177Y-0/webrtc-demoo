import { useState, useEffect } from "react";

const AudioButton = ({ callStatus, setCallStatus, localStream, peerConnection }) => {
    let micText;
    if (callStatus.audio === "off") {
        micText = "Join Audio";
    } else if (callStatus.audio === "enabled") {
        micText = "Mute";
    } else {
        micText = "Unmute";
    }

    const startStopAudio = () => {
        const copyCallStatus = { ...callStatus };
        // First, check if the audio is enabled, if so disable it
        if (callStatus.audioEnabled === true) {
            // Update callStatus
            copyCallStatus.audioEnabled = false;
            setCallStatus(copyCallStatus);
            // Disable the audio tracks
            const tracks = localStream.getAudioTracks();
            tracks.forEach((t) => (t.enabled = false));
        } else if (callStatus.audioEnabled === false) {
            // Second, check if the audio is disabled, if so enable it
            // Update callStatus
            copyCallStatus.audioEnabled = true;
            setCallStatus(copyCallStatus);
            // Enable the audio tracks
            const tracks = localStream.getAudioTracks();
            tracks.forEach((t) => (t.enabled = true));
        } else {
            // Audio is "off" – add the tracks to the peer connection
            localStream.getAudioTracks().forEach((t) => {
                peerConnection.addTrack(t, localStream);
            });
        }
    };

    return (
        <div className="button-wrapper d-inline-block">
            <i className="fa fa-caret-up choose-audio"></i>
            <div className="button-3d mic" onClick={startStopAudio}>
                <i className="fa fa-microphone"></i>
                <div className="btn-text">{micText}</div>
            </div>
        </div>
    );
};

export default AudioButton;
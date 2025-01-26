const VideoButton = ({ localFeedEl, callStatus, localStream, updateCallStatus, peerConnection }) => {
    // Handle user clicking on video button
    const startStopVideo = () => {
        const copyCallStatus = { ...callStatus };
        // Use cases:
        if (copyCallStatus.videoEnabled) {
            // 1. Video is enabled, so we need to disable
            copyCallStatus.videoEnabled = false;
            updateCallStatus(copyCallStatus);
            const tracks = localStream.getVideoTracks();
            tracks.forEach((track) => (track.enabled = false));
        } else if (copyCallStatus.videoEnabled === false) {
            // 2. Video is disabled, so we need to enable
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus);
            const tracks = localStream.getVideoTracks();
            tracks.forEach((track) => (track.enabled = true));
        } else if (copyCallStatus.videoEnabled === null) {
            // 3. Video is null, so we need to initialize
            console.log("Init video!");
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus);
            // Add tracks to the peer connection
            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            });
        }
    };

    return (
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button-3d camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    );
};

export default VideoButton;
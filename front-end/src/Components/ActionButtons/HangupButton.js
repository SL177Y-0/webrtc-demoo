const HangupButton = ({ remoteFeedEl, localFeedEl, peerConnection, callStatus, setCallStatus }) => {
    const hangupCall = () => {
        if (peerConnection) {
            const copyCallStatus = { ...callStatus };
            copyCallStatus.current = 'complete';
            setCallStatus(copyCallStatus);

            // Close the peer connection and remove listeners
            peerConnection.close();
            peerConnection.onicecandidate = null;
            peerConnection.onaddstream = null;
            peerConnection = null;

            // Clear the video feeds
            localFeedEl.current.srcObject = null;
            remoteFeedEl.current.srcObject = null;
        }
    };

    if (callStatus.current === "complete") {
        return <></>;
    }

    return (
        <div className="button-3d hangup" onClick={hangupCall}>
            <i className="fa fa-phone"></i>
            <div className="btn-text">Hang Up</div>
        </div>
    );
};

export default HangupButton;
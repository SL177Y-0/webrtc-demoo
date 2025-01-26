import "./VideoMessage.css"; // Import the CSS file

const VideoMessage = ({ message }) => {
    if (message) {
        return (
            <div className="video-message">
                <h1>{message}</h1>
            </div>
        );
    } else {
        return <></>;
    }
};

export default VideoMessage;
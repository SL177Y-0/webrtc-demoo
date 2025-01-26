import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import CallerVideo from './Components/CallerVideo';
import AnswerVideo from './Components/AnswerVideo';
import Home from './Components/Home';

function App() {
  // State for managing call status, streams, and user data
  const [callStatus, updateCallStatus] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [userName, setUserName] = useState('');
  const [offerData, setOfferData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            VideoCall App
          </Link>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/offer" className="navbar-link">
                Caller
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/answer" className="navbar-link">
                Answer
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading-spinner">
          <div className="loader"></div>
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              userName={userName}
              setUserName={setUserName}
              offerData={offerData}
              setOfferData={setOfferData}
              setIsLoading={setIsLoading} // Pass loading state to Home
            />
          }
        />
        <Route
          exact
          path="/offer"
          element={
            <CallerVideo
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              userName={userName}
              setUserName={setUserName}
              setIsLoading={setIsLoading} // Pass loading state to CallerVideo
            />
          }
        />
        <Route
          exact
          path="/answer"
          element={
            <AnswerVideo
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              userName={userName}
              setUserName={setUserName}
              offerData={offerData}
              setIsLoading={setIsLoading} // Pass loading state to AnswerVideo
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
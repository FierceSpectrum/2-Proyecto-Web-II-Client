import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import User from "../User/User";
import ReactPlayer from "react-player";

function Home() {
  const navigate = useNavigate();

  const [showVideo, setShowVideo] = useState(false);

  const [playlist, setPlaylist] = useState();
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);

  const account = JSON.parse(localStorage.getItem("Account"));

  const openVideo = (video) => {
    setVideo(video);
    setShowVideo(true);
  };
  const closeVideo = (video) => {
    setVideo([]);
    setShowVideo(false);
  };

  useEffect(() => {
    if (!account) {
      navigate("/Profiles");
    }
  }, [account, navigate]);

  useEffect(() => {
    Validar();
  }, []);

  const urllogin = `http://localhost:3001/api/playlists?iduser=${account.user}`;

  const Validar = async () => {
    await fetch(urllogin, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const allVideos = data.reduce((acc, playlist) => {
          return [...acc, ...playlist.playlist];
        }, []);
        data.forEach((playlist) => {
          const data = {
            id: playlist._id,
            videos: allVideos,
            user: playlist.user,
          };
          setPlaylist(data);
          setVideos(allVideos);
          return;
        });
      })
      .catch((err) => {
        console.log("error: " + err);
      });
  };

  return (
    <>
      <div className="boddys">
        <User className="user"></User>
        <div className="videos-container">
          {videos.map((video, index) => (
            <>
              <div key={index} className="video-container">
                <ReactPlayer
                  className="video"
                  url={video.url}
                  controls
                  showRelated={false}
                  autoPlay
                  loop
                  rel={0}
                />
                <h2>{video.name}</h2>
                <div className="overlay" onClick={() => openVideo(video)}></div>
              </div>
            </>
          ))}
          {showVideo && (
            <div className="popup">
              <div className="popup-header">
                <button className="close-button" onClick={closeVideo}>
                  X
                </button>
              </div>
              <div className="video-container-r">
                <h2>{video.name}</h2>
                <ReactPlayer
                  className="video-r"
                  url={video.url}
                  playing={true}
                  controls
                  showRelated={false}
                  autoPlay
                  loop
                  rel={0}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;

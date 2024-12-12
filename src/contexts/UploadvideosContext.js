import { createContext, useState } from "react";

export const UploadedVideosContext = createContext();

export const UploadedVideosProvider = ({ children }) => {
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const addUploadedVideo = (video) => {
    setUploadedVideos((prevVideos) => [...prevVideos, video]);
  };

  return (
    <UploadedVideosContext.Provider
      value={{ uploadedVideos, addUploadedVideo }}
    >
      {children}
    </UploadedVideosContext.Provider>
  );
};

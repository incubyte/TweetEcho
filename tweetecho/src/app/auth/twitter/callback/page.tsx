"use client";

import axios from "axios";
import React from "react";

const CallbackPage = () => {
  const handleCodeSave = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    axios.post("/api/auth/twitter/authorize", { code }).then((res) => {
      console.log("res: ", res);
    });
  };

  const postTweet = async () => {
    axios
      .post("/api/auth/twitter/post-tweet", { message: "Hello World, I'm testing something!" })
      .then((res) => {
        console.log("res: ", res);
      });
  };

  return (
    <div>
      <button onClick={handleCodeSave}>Generate & Save AccessToken</button>
      <button onClick={postTweet}>Post Tweet</button>
    </div>
  );
};
export default CallbackPage;

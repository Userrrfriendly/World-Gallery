import React from "react";
import stonehenge from "../../assets/stonehenge111.mp4";

export default function Video({ src }) {
  return (
    <video width="100%" autoPlay={true} loop={true}>
      <source src={stonehenge} type="video/mp4" />
      Your browser does not support HTML5 video.
    </video>
  );
}

import React from "react";

const LightBoxViewRenderer = props => {
  /** By default react-images carousel requests/loads all images that are passed to it
   * this custom viewRenderer changes that behaviour and requests each image one by one when it's about to render it
   * more on the issue:-->  https://github.com/jossmac/react-images/issues/300 */
  const overScanCount = 1;
  const { data, getStyles, index, currentIndex } = props;
  const { alt, src } = data;

  return Math.abs(currentIndex - index) <= overScanCount ? (
    <div style={getStyles("view", props)}>
      <img
        alt={alt || `Image ${index}`}
        src={src}
        style={{
          height: "auto",
          maxHeight: "100vh",
          maxWidth: "100%",
          userSelect: "none"
        }}
      />
    </div>
  ) : null;
};

export default LightBoxViewRenderer;

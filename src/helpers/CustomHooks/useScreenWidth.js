import useMediaQuery from "@material-ui/core/useMediaQuery";

/**
 * useMediaQuery returns true if the screen width is >= 900px ,and false if it is <900
 */
export const useScreenWidth = () => {
  const matches = useMediaQuery("(min-width:900px)");
  return matches;
};

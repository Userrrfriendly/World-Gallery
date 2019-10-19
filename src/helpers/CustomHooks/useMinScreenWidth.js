import useMediaQuery from "@material-ui/core/useMediaQuery";

export const useMinScreenWidth = width => {
  const width450 = useMediaQuery("(min-width:450px)");
  const width900 = useMediaQuery("(min-width:900px)");
  const width1200 = useMediaQuery("(min-width:1200px)");

  switch (width) {
    case 450:
      return width450;
    case 900:
      return width900;
    case 1200:
      return width1200;
    default:
      break;
  }
};

import useMediaQuery from "@material-ui/core/useMediaQuery";

export const useMinScreenWidth = width => {
  const width400 = useMediaQuery("(min-width:400px)");
  const width900 = useMediaQuery("(min-width:900px)");
  const width1200 = useMediaQuery("(min-width:1200px)");

  switch (width) {
    case 400:
      return width400;
    case 900:
      return width900;
    case 1200:
      return width1200;
    default:
      break;
  }
};

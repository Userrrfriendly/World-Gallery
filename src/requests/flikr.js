export const getPhotosByTitle = searchParams => {
  /* This will ask flicker to fetch all photos (that have geolocation)
    that contain the markers location title in any way (tag, image name, album name etc)
    the photos returned will be within a 31km radius from the markers position
    the func returns an array of photos details (id,farm,server etc)
  */
  let url = new URLSearchParams();
  url.append("method", "flickr.photos.search");
  url.append("api_key", "f6536bb373bca1fcd14d4da1281f2839");
  // url.append('tags', marker.title); //text produces broader results than tags
  if (searchParams.search) url.append("text", searchParams.search);
  if (searchParams.type === "boundingBox") {
    // const { south, west, north, east } = searchParams.bounds.toJSON();
    const { south, west, north, east } = searchParams;
    url.append("bbox", `${west},${south},${east},${north}`);
  }
  console.log(searchParams);
  if (searchParams.type === "marker") {
    url.append("lat", searchParams.lat);
    url.append("lon", searchParams.lng);
  }
  url.append("has_geo", "1");
  url.append("radius", "1"); //1 to 31 km?
  url.append("radius_units", "km");
  url.append("per_page", "50");
  url.append("format", "json");
  url.append("nojsoncallback", "1");
  url.append("extras", "url_m,url_c,url_l,url_h,url_o");

  let arrayOfPhotos = fetch("https://api.flickr.com/services/rest/?" + url)
    .then(res => {
      console.log(url);
      return res.json().then(json => {
        console.log(json);
        const test = json.photos.photo.map(img => {
          return {
            ...img,
            width_c: parseInt(img.width_c),
            width_h: parseInt(img.width_h),
            width_l: parseInt(img.width_l),
            width_m: parseInt(img.width_m),
            height_c: parseInt(img.height_c),
            height_h: parseInt(img.height_h),
            height_l: parseInt(img.height_l),
            height_m: parseInt(img.height_m),
            src: img.url_m, //flickr doesn't guarantee all sizes but medium will always be there
            height: parseInt(img.height_m),
            width: parseInt(img.width_m),
            title: img.title,
            alt: img.title,
            key: img.id,
            srcSet: [
              `${img.url_m} ${img.width_m}w`,
              `${img.url_c} ${img.width_c}w`,
              `${img.url_l} ${img.width_l}w`,
              `${img.url_h} ${img.width_h}w`
            ],
            sizes: "(min-width: 480px) 50vw, (min-width: 1024px) 33.3vw, 100vw"
          };
        });
        console.log(test);
        return json.photos.photo.map(img => {
          return {
            // ...img,
            photoId: img.id,
            width_c: img.width_c ? parseInt(img.width_c) : "",
            width_h: img.width_h ? parseInt(img.width_h) : "",
            width_l: img.width_l ? parseInt(img.width_l) : "",
            width_m: img.width_m ? parseInt(img.width_m) : "",
            height_c: img.height_c ? parseInt(img.height_c) : "",
            height_h: img.height_h ? parseInt(img.height_h) : "",
            height_l: img.height_l ? parseInt(img.height_l) : "",
            height_m: img.height_m ? parseInt(img.height_m) : "",
            height: img.height_m ? parseInt(img.height_m) : "",
            width: img.width_m ? parseInt(img.width_m) : "",
            src: img.url_l ? img.url_l : img.url_m,
            title: img.title,
            alt: img.title,
            key: img.id,
            srcSet: [
              img.url_m ? `${img.url_m} ${img.width_m}w` : "",
              img.url_c ? `${img.url_c} ${img.width_c}w` : "",
              img.url_l ? `${img.url_l} ${img.width_l}w` : "",
              img.url_h ? `${img.url_h} ${img.width_h}w` : ""
            ],
            sizes: "(min-width: 480px) 50vw, (min-width: 1024px) 33.3vw, 100vw"
          };
        });
      });
    })
    .catch(err => {
      console.log(err);
      return ["error"];
    });

  return arrayOfPhotos;
};

export const flickrUrlConstructor = array => {
  /*This takes the array of photo information from the getPhotosByTitle() and transforms each photo to a straightforward url*/

  let urlArr = {
    default: [],
    thumbNail: [], //t
    medium: [], //c
    large: [], //b
    title: []
  };
  if (array[0] !== "error") {
    for (let i = 0; i < array.length; i++) {
      urlArr.default.push([
        `https://farm${array[i].farm}.staticflickr.com/${array[i].server}/${array[i].id}_${array[i].secret}.jpg`,
        array[i].id,
        [array[i].title][0],
        array[i].owner
      ]);
      urlArr.thumbNail.push([
        `https://farm${array[i].farm}.staticflickr.com/${array[i].server}/${array[i].id}_${array[i].secret}_t.jpg`,
        array[i].id,
        [array[i].title][0]
      ]);
      urlArr.medium.push([
        `https://farm${array[i].farm}.staticflickr.com/${array[i].server}/${array[i].id}_${array[i].secret}_c.jpg`,
        array[i].id,
        [array[i].title][0]
      ]);
      urlArr.large.push([
        `https://farm${array[i].farm}.staticflickr.com/${array[i].server}/${array[i].id}_${array[i].secret}_b.jpg`,
        array[i].id,
        [array[i].title][0]
      ]);
      urlArr.title.push([array[i].title]);
    }
  } else {
    urlArr = {
      error: true,
      default: ["no-preview128px.png"],
      thumbNail: ["no-preview128px.png"], //t
      medium: ["no-preview128px.png"], //c
      large: ["no-preview128px.png"] //b
    };
  }
  return urlArr;
};

export const getPhotoGeoLocation = photo_id => {
  /* This flicker api call returns a set of coordinates for a given photo
    (Since there are no means to get the coordinates of a batch of photos)
    this method must be called EACH TIME a new photograph marker is to be plotted on the map
  */
  let url = new URLSearchParams();
  url.append("method", "flickr.photos.geo.getLocation");
  url.append("api_key", "f6536bb373bca1fcd14d4da1281f2839");
  url.append("format", "json");
  url.append("nojsoncallback", "1");
  url.append("photo_id", photo_id);

  let result = fetch("https://api.flickr.com/services/rest?" + url)
    .then(res => {
      return res.json().then(json => {
        let position = {
          lat: parseFloat(json.photo.location.latitude),
          lng: parseFloat(json.photo.location.longitude)
        };
        return position;
      });
    })
    .catch(err => {
      console.log(err);
      return ["error"];
    });

  return result;
};

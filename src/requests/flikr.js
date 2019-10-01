/** *Flickrs API has got a bug -> even if you set radius units to km the geo-search is performed in miles
 * Since the UI is in km before each api call the radius is transformed from km to miles
 */
const kmToMiles = km => km / 1.609;

export const getPhotosByTitle = searchParams => {
  /* This will ask flicker to fetch all photos (that have geolocation)
    that contain the markers location title in any way (tag, image name, album name etc)
    the photos returned will be within a 31km radius from the markers position
    the func returns an array of photos details (id,farm,server etc)
  */

  console.log(searchParams);
  //will be appended to response
  let query;

  let url = new URLSearchParams();
  url.append("method", "flickr.photos.search");
  url.append("api_key", "f6536bb373bca1fcd14d4da1281f2839");
  // url.append('tags', marker.title); //text produces broader results than tags leave it for now may implement later
  if (searchParams.searchText) url.append("text", searchParams.searchText);
  if (searchParams.sortMethod) url.append("sort", searchParams.sortMethod);
  if (searchParams.searchMethod === "EXTENTS") {
    const { south, west, north, east } = searchParams.bounds;
    query = {
      searchMethod: searchParams.searchMethod,
      bounds: searchParams.bounds
      // south,
      // west,
      // north,
      // east
    };
    url.append("bbox", `${west},${south},${east},${north}`);
  }
  if (searchParams.searchMethod === "CIRCLE") {
    url.append("lat", searchParams.lat);
    url.append("lon", searchParams.lng);
    url.append("radius", kmToMiles(searchParams.radius)); //1 to 32 km
    url.append("radius_units", "km");
    query = {
      searchMethod: "CIRCLE",
      lat: searchParams.lat,
      lng: searchParams.lng,
      radius: searchParams.radius
    };
  }

  url.append("has_geo", "1");
  url.append(
    "per_page",
    searchParams.resultsPerPage ? searchParams.resultsPerPage : "50"
  ); //250max for photos with geolocation
  url.append("format", "json");
  url.append("nojsoncallback", "1");
  url.append(
    "extras",
    "url_t,url_m,url_c,url_l,url_h,url_o,geo, date_upload, date_taken, owner_name"
  );
  if (searchParams.page) url.append("page", searchParams.page);

  let arrayOfPhotos = fetch("https://api.flickr.com/services/rest/?" + url)
    .then(res => {
      console.log(url);
      return res.json().then(json => {
        console.log(json);
        // const test = {
        //   ...json.photos,
        //   photo: json.photos.photo.map(img => {
        //     return {
        //       ...img,
        //       width_c: parseInt(img.width_c),
        //       width_h: parseInt(img.width_h),
        //       width_l: parseInt(img.width_l),
        //       width_m: parseInt(img.width_m),
        //       height_c: parseInt(img.height_c),
        //       height_h: parseInt(img.height_h),
        //       height_l: parseInt(img.height_l),
        //       height_m: parseInt(img.height_m),
        //       src: img.url_m, //flickr doesn't guarantee all sizes but medium will always be there
        //       height: parseInt(img.height_m),
        //       width: parseInt(img.width_m),
        //       title: img.title,
        //       alt: img.title,
        //       key: img.id,
        //       srcSet: [
        //         `${img.url_m} ${img.width_m}w`,
        //         `${img.url_c} ${img.width_c}w`,
        //         `${img.url_l} ${img.width_l}w`,
        //         `${img.url_h} ${img.width_h}w`
        //       ],
        //       sizes:
        //         "(min-width: 480px) 50vw, (min-width: 1024px) 33.3vw, 100vw"
        //     };
        //   })
        // };
        // console.log(test);
        return {
          ...query,
          currentPage: json.photos.page,
          totalPages: json.photos.pages,
          totalPhotos: json.photos.total,
          perPage: json.photos.perpage,
          photos: json.photos.photo.map(img => {
            return {
              // ...img,
              dateupload: img.dateupload,
              datetaken: img.datetaken,
              ownername: img.ownername,
              geolocation: {
                lat: parseFloat(img.latitude),
                lng: parseFloat(img.longitude)
              },
              photoId: img.id,
              width_t: img.width_t ? parseInt(img.width_t) : "",
              width_c: img.width_c ? parseInt(img.width_c) : "",
              width_h: img.width_h ? parseInt(img.width_h) : "",
              width_l: img.width_l ? parseInt(img.width_l) : "",
              width_m: img.width_m ? parseInt(img.width_m) : "",
              width_o: img.width_o ? parseInt(img.width_o) : "",
              height_c: img.height_c ? parseInt(img.height_c) : "",
              height_h: img.height_h ? parseInt(img.height_h) : "",
              height_l: img.height_l ? parseInt(img.height_l) : "",
              height_m: img.height_m ? parseInt(img.height_m) : "",
              height_o: img.height_o ? parseInt(img.height_o) : "",
              /* since you cant predict in what size will the photo be availiable:
              if medium size is availiable use it if not get the original size
              as fallback give the image 100px width and height */
              height: img.height_m
                ? parseInt(img.height_m)
                : img.height_o
                ? parseInt(img.height_o)
                : 100,
              width: img.width_m
                ? parseInt(img.width_m)
                : img.width_o
                ? parseInt(img.width_o)
                : 100,
              src: img.url_l ? img.url_l : img.url_m ? img.url_m : img.url_o,
              title: img.title,
              alt: img.title,
              key: img.id,
              owner: img.owner,
              thumb: img.url_t,
              srcSet: [
                img.url_m ? `${img.url_m} ${img.width_m}w` : "",
                img.url_c ? `${img.url_c} ${img.width_c}w` : "",
                img.url_l ? `${img.url_l} ${img.width_l}w` : "",
                img.url_h ? `${img.url_h} ${img.width_h}w` : "",
                img.url_o ? `${img.url_o} ${img.width_o}w` : ""
              ],
              sizes:
                "(min-width: 480px) 50vw, (min-width: 1024px) 33.3vw, 100vw"
            };
          })
        };
      });
    })
    .catch(err => {
      console.log(err);
      return ["error"];
    });

  return arrayOfPhotos;
};

export const flickrUrlConstructor = array => {
  /* This takes the array of photo information from the getPhotosByTitle() 
  and transforms each photo to a straightforward url*/

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
        console.log(json);
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

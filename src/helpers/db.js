import Dexie from "dexie";

const db = new Dexie("worldGalleryDB");
db.version(1).stores({ favorites: "photoId" });

export const addToFavorites = args => {
  //addToFavorites SHOULD TRIGGER ONLY IF THE GIVEN ENTRY IS NOT already IN indexedDB
  db.transaction("rw", db.favorites, async () => {
    await db.favorites
      .get({ photoId: args.photoId })
      .then(res => {
        if (!res) {
          return (
            db.favorites
              .add({
                ...args
              })
              // .then(entry => {
              //   console.log("added:" + JSON.stringify(entry));
              // })
              .catch(function(e) {
                alert("Error: " + (e.stack || e));
              })
          );
        }
      })
      .catch(function(e) {
        alert("Error: " + (e.stack || e));
      });
  });
};

export const deleteFromFavorites = args => {
  return db.favorites
    .where("photoId")
    .equals(args.photoId)
    .delete()
    .catch(function(e) {
      alert("Error: " + (e.stack || e));
    });
};

/**
 * the store needs to be updated with a dispatch action
 * the function that holds the dispatch is stored (callback) is IDB() in App.js
 */
export const populateStoreFromDb = callBack => {
  db.transaction("rw", db.favorites, async () => {
    await db.favorites.each(item => callBack(item));
  });
};

export default db;

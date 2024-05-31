import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import app from "../config/firebase.js";

const storage = getStorage(app);

export async function uploadImageToFirebaseStorage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "Image file is required." });
    }

    const dateTime = giveCurrentDateTime();
    const storageRef = ref(
      storage,
      `refUsers/${req.file.originalname + "  " + dateTime}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File successfully uploaded");

    return downloadURL;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while uploading the file.");
  }
}

export async function deleteImageFromFirebaseStorage(imageUrl) {
  try {
    const storageRef = ref(storage, imageUrl);

    await deleteObject(storageRef);

    console.log("Image deleted from Firebase Storage");
  } catch (error) {
    console.error("Error deleting the image from Firebase Storage:", error);
    throw new Error("An error occurred while deleting the image.");
  }
}

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export async function uploadUserImageToFirebaseStorage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "Image file is required." });
    }

    const dateTime = giveCurrentDateTime();
    const storageRef = ref(
      storage,
      `users/${req.file.originalname + "  " + dateTime}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File successfully uploaded");

    return downloadURL;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while uploading the file.");
  }
}

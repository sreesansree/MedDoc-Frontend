// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "docmed-81c9d.firebaseapp.com",
  projectId: "docmed-81c9d",
  storageBucket: "docmed-81c9d.appspot.com",
  messagingSenderId: "1020934450445",
  appId: "1:1020934450445:web:b58932a15ad22a82335444",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFileToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `chat/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle upload progress (optional)
      },
      (error) => {
        reject(error);
      },
      () => {
        // Handle successful uploads
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
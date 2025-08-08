// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE_XPzgYlwnfM7IWooBLcFvRvXGUstU78",
  authDomain: "dionysus-180b6.firebaseapp.com",
  projectId: "dionysus-180b6",
  storageBucket: "dionysus-180b6.firebasestorage.app",
  messagingSenderId: "899443528457",
  appId: "1:899443528457:web:a945d53a1ab2a3159d39d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file: File, setProgress: (progress: number) => void): Promise<string> {
  const fileRef = ref(storage, file.name);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot: import("firebase/storage").UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error: any) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        }).catch((error) => {
          reject(error);
        });
      }
    );
  });
}





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAhgtJPtc1GrZ9rYBgVzNemJsmXhxb2VZ8",
//   authDomain: "gitsumm-a8edd.firebaseapp.com",
//   projectId: "gitsumm-a8edd",
//   storageBucket: "gitsumm-a8edd.firebasestorage.app",
//   messagingSenderId: "252305872308",
//   appId: "1:252305872308:web:6bda4af79e349cb13c0ee1"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
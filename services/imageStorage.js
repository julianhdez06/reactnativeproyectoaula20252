// services/imageStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { firebaseApp } from '../config/firebaseConfig'; // Asegúrate de que esta ruta es correcta

const storage = getStorage(firebaseApp);

// 🔹 Comprime la imagen antes de subirla
async function compressImage(uri) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

// 🔹 Sube la imagen al Storage y devuelve la URL pública
export async function uploadImage(uri, path = 'imagenes_inventario') {
  try {
    const compressedUri = await compressImage(uri);

    const response = await fetch(compressedUri);
    const blob = await response.blob();

    const fileName = `${Date.now()}.jpg`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;

  } catch (error) {
    console.error("Error subiendo imagen:", error);
    throw error;
  }
}

// 🔹 Elimina una imagen del Storage usando su URL
export async function deleteImage(url) {
  try {
    if (!url) return;

    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const path = decodedUrl.substring(startIndex, endIndex);

    const imgRef = ref(storage, path);
    await deleteObject(imgRef);
  } catch (error) {
    console.error("Error eliminando imagen:", error);
  }
}

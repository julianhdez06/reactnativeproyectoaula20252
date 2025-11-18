import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

/**
 * Guarda una imagen localmente en el almacenamiento de Expo.
 * Devuelve la ruta final (file://...) para mostrarla más tarde.
 */
export async function saveLocalImage(uriOriginal, codigo) {
  try {
    if (!uriOriginal) return null;

    // 1️⃣ Comprimir imagen
    const result = await ImageManipulator.manipulateAsync(
      uriOriginal,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 2️⃣ Crear nombre único basado en el código del producto
    const fileName = `prod_${codigo}_${Date.now()}.jpg`;
    const newPath = `${FileSystem.documentDirectory}${fileName}`;

    // 3️⃣ Guardar archivo comprimido en una ruta permanente
    await FileSystem.copyAsync({
      from: result.uri,
      to: newPath,
    });

    console.log("📸 Imagen guardada en:", newPath);

    return newPath; // Ruta local final
  } catch (e) {
    console.log("❌ Error guardando foto:", e);
    return null;
  }
}

/**
 * Elimina una foto del almacenamiento local
 */
export async function deleteLocalImage(uri) {
  try {
    if (!uri) return;

    await FileSystem.deleteAsync(uri, { idempotent: true });
    console.log("🗑 Imagen eliminada:", uri);

  } catch (e) {
    console.log("❌ Error eliminando foto:", e);
  }
}

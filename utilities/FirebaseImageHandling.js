import { admin } from "../config/firebase-config.js";
import path from "node:path";

// change if temp image location changes
// relies on server being run from root directory of project
export function getThumbnailImageLocalFilePathFromRecipeId(recipeId) {
  const { sep } = path;
  return `${process.cwd()}${sep}${tempImages}${sep}thumbnail-${recipeId}`;
}

export function getThumbnailImageFirebaseFilePathFromRecipeId(recipeId) {
  return `thumbnail-images/${recipeId}`;
}

// uploads an image from server filesystem to firebase bucket
export async function uploadFileToStorage(filePath, destinationPath) {
  // TODO: implement image type conversion
  const bucket = admin.storage().bucket();
  await bucket.upload(filePath, {
    destination: destinationPath,
    // You can specify metadata like content type, cache control, etc.
  });
  console.log("Image uploaded successfully");
}

// returns a buffer containing image data
export async function downloadFileFromStorage(cloudFilePath) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);
  const data = await file.download();
  return data[0];
}

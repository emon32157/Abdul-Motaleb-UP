export const IMGBB_API_KEY = "99815c3ffa136abacd724ec8487a4de8";
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

export interface ImgBBUploadResult {
  url: string;
  displayUrl: string;
  thumbUrl?: string;
  deleteUrl?: string;
  title: string;
  size: number;
  width?: number;
  height?: number;
}

/**
 * Upload an image file or base64 string directly to ImgBB
 */
export async function uploadToImgBB(
  fileOrBase64: File | string,
  customName?: string
): Promise<ImgBBUploadResult> {
  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);

  if (typeof fileOrBase64 === "string") {
    // If it's a data URL, remove the header if present
    const base64Data = fileOrBase64.includes(",")
      ? fileOrBase64.split(",")[1]
      : fileOrBase64;
    formData.append("image", base64Data);
  } else {
    formData.append("image", fileOrBase64);
  }

  if (customName) {
    formData.append("name", customName);
  }

  const response = await fetch(IMGBB_API_URL, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result?.error?.message || "Failed to upload image to ImgBB. Please try again."
    );
  }

  return {
    url: result.data.url,
    displayUrl: result.data.display_url || result.data.url,
    thumbUrl: result.data.thumb?.url || result.data.medium?.url || result.data.url,
    deleteUrl: result.data.delete_url,
    title: result.data.title || customName || "Uploaded Image",
    size: result.data.size || 0,
    width: result.data.width,
    height: result.data.height,
  };
}

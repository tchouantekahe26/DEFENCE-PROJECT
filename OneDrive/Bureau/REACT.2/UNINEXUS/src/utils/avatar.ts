import type { User } from "../types";

export const DEFAULT_AVATARS = {
  admin: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  teacher: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  student: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80",
};

/**
 * Returns the user's uploaded avatar if available, otherwise returns the uniform
 * role-specific default avatar so that all UI components render identically.
 */
export const getUserAvatar = (user?: Partial<User> | null, roleFallback?: string): string => {
  if (user?.avatar && typeof user.avatar === "string" && user.avatar.trim().length > 0) {
    return user.avatar;
  }
  const role = user?.role || roleFallback || "teacher";
  if (role === "admin") return DEFAULT_AVATARS.admin;
  if (role === "teacher") return DEFAULT_AVATARS.teacher;
  return DEFAULT_AVATARS.student;
};

/**
 * Resizes and converts any uploaded Image File to a persistent Base64 Data URL.
 * Ensures images persist permanently in localStorage, database, and across all pages.
 */
export const processAvatarUpload = (
  file: File,
  maxDimension = 256,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload a valid image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

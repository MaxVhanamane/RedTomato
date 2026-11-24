export const DEFAULT_FOOD_IMAGE = '/default-food-image.jpg';

/**
 * Checks whether an image URL is from Firebase or empty/invalid.
 */
export function isFirebaseImage(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.startsWith('firebase') ||
    lower.startsWith('https://firebase') ||
    lower.startsWith('http://firebase') ||
    lower.includes('firebasestorage.googleapis.com') ||
    lower.includes('firebasestorage') ||
    lower.includes('firebase')
  );
}

/**
 * Returns the sanitized food image URL. If the URL starts with firebase or
 * points to Firebase Storage (or is missing/empty), returns the default food image
 * from the public folder.
 */
export function getFoodImage(img, fallback = DEFAULT_FOOD_IMAGE) {
  if (!img || typeof img !== 'string') {
    return fallback || DEFAULT_FOOD_IMAGE;
  }
  const trimmed = img.trim();
  if (trimmed.length === 0 || isFirebaseImage(trimmed)) {
    return DEFAULT_FOOD_IMAGE;
  }
  return trimmed;
}

/**
 * Image onError event handler that replaces broken image with the default food image.
 */
export function handleImageError(e, fallback = DEFAULT_FOOD_IMAGE) {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback || DEFAULT_FOOD_IMAGE;
  }
}

export default getFoodImage;

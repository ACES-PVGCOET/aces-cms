/**
 * mediaUtils.js
 * Comprehensive media detection and format processing utilities for images and videos.
 */

export function isVideoMedia(urlOrData) {
  if (!urlOrData || typeof urlOrData !== 'string') return false;
  if (urlOrData.startsWith('data:video/')) return true;
  const clean = urlOrData.toLowerCase().split('?')[0].split('#')[0];
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv', '.avi'];
  return videoExtensions.some((ext) => clean.endsWith(ext));
}

export function isImageMedia(urlOrData) {
  if (!urlOrData || typeof urlOrData !== 'string') return false;
  if (urlOrData.startsWith('data:image/')) return true;
  const clean = urlOrData.toLowerCase().split('?')[0].split('#')[0];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp', '.ico'];
  return imageExtensions.some((ext) => clean.endsWith(ext));
}

export function formatMediaName(type, name) {
  if (!name) return 'Media Asset';
  return name.length > 25 ? `${name.substring(0, 22)}...` : name;
}

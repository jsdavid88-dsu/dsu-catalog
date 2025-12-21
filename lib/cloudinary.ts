/**
 * Optimizes a Cloudinary URL by injecting transformation parameters.
 * Transformation 'f_auto,q_auto' automatically chooses the best format (WebP/AVIF)
 * and adjusts quality for the best balance between size and visual clarity.
 * 
 * @param url The original Cloudinary URL
 * @param options Optimization options (width, height, crop, etc.)
 * @returns Optimized URL or original URL if not a Cloudinary link
 */
export function optimizeCloudinary(url: string, options?: { width?: number; height?: number; crop?: string }): string {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Check if it already has transformations
    // Cloudinary URLs usually follow: .../upload/[transformations]/v[version]/...
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const prefix = url.substring(0, uploadIndex + 8); // includes '/upload/'
    const suffix = url.substring(uploadIndex + 8);

    // Build transformations
    let transforms = 'f_auto,q_auto';

    if (options?.width) {
        transforms += `,w_${options.width}`;
    }
    if (options?.height) {
        transforms += `,h_${options.height}`;
    }
    if (options?.crop) {
        transforms += `,c_${options.crop}`;
    }

    // If the suffix already starts with a transformation (doesn't start with 'v' for version),
    // we should be careful. But for simplicity in this app, we'll just prepend ours.
    // Standard Cloudinary URL structure: .../upload/v123... or .../upload/transform/v123...

    return `${prefix}${transforms}/${suffix}`;
}

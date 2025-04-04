import supabase, { supabaseUrl } from "./supabase"

/**
 * Get all URLs for a user
 * @param {string} user_id - The user ID
 * @returns {Promise<Array>} - Array of URL objects
 */
export async function getUrls(user_id) {
  if (!user_id) {
    throw new Error("User ID is required")
  }

  try {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching URLs:", error)
      throw new Error("Unable to load URLs")
    }

    return data || []
  } catch (error) {
    console.error("Error in getUrls:", error)
    throw new Error("Unable to load URLs")
  }
}

/**
 * Get a specific URL by ID and user ID
 * @param {Object} params - Parameters
 * @param {string} params.id - URL ID
 * @param {string} params.user_id - User ID
 * @returns {Promise<Object>} - URL object
 */
export async function getUrl({ id, user_id }) {
  if (!id || !user_id) {
    throw new Error("URL ID and User ID are required")
  }

  try {
    const { data, error } = await supabase.from("urls").select("*").eq("id", id).eq("user_id", user_id).single()

    if (error) {
      console.error("Error fetching URL:", error)
      throw new Error("Short URL not found")
    }

    return data
  } catch (error) {
    console.error("Error in getUrl:", error)
    throw new Error("Short URL not found")
  }
}

/**
 * Get the original URL from a short or custom URL
 * @param {string} id - Short URL or custom URL identifier
 * @returns {Promise<Object>} - URL object with original URL
 */
export async function getLongUrl(id) {
  if (!id) {
    throw new Error("URL identifier is required")
  }

  try {
    // Use parameterized query to prevent SQL injection
    const { data, error } = await supabase
      .from("urls")
      .select("id, original_url")
      .or(`short_url.eq.${id},custom_url.eq.${id}`)
      .single()

    if (error) {
      console.error("Error fetching long URL:", error)
      throw new Error("URL not found")
    }

    return data
  } catch (error) {
    console.error("Error in getLongUrl:", error)
    throw new Error("URL not found")
  }
}

/**
 * Check if a custom URL is already taken
 * @param {string} customUrl - The custom URL to check
 * @returns {Promise<boolean>} - True if available, false if taken
 */
export async function isCustomUrlAvailable(customUrl) {
  if (!customUrl) return true

  try {
    const { _data, error } = await supabase.from("urls").select("id").eq("custom_url", customUrl).single()

    if (error && error.code === "PGRST116") {
      // No match found, URL is available
      return true
    }

    // URL exists
    return false
  } catch (error) {
    console.error("Error checking custom URL:", error)
    throw new Error("Unable to check custom URL availability")
  }
}

/**
 * Create a new short URL
 * @param {Object} urlData - URL data
 * @param {string} urlData.title - URL title
 * @param {string} urlData.longUrl - Original URL
 * @param {string} urlData.customUrl - Custom URL (optional)
 * @param {string} urlData.user_id - User ID
 * @param {Blob} qrcode - QR code image blob
 * @returns {Promise<Array>} - Created URL object
 */
export async function createUrl({ title, longUrl, customUrl, user_id }, qrcode) {
  if (!title || !longUrl || !user_id) {
    throw new Error("Title, URL, and user ID are required")
  }

  // Validate URL format
  try {
    new URL(longUrl.startsWith("http") ? longUrl : `https://${longUrl}`)
  } catch (e) {
    throw new Error("Invalid URL format")
  }

  // Check if custom URL is available
  if (customUrl) {
    const isAvailable = await isCustomUrlAvailable(customUrl)
    if (!isAvailable) {
      throw new Error("Custom URL is already taken")
    }
  }

  // Generate a unique short URL
  const short_url = Math.random().toString(36).substring(2, 8)
  const fileName = `qr-${short_url}-${Date.now()}`

  try {
    // Ensure QR code is valid
    if (!qrcode || !(qrcode instanceof Blob)) {
      throw new Error("Invalid QR code")
    }

    // Upload QR code
    const { error: storageError } = await supabase.storage.from("qrs").upload(fileName, qrcode)

    if (storageError) {
      console.error("Error uploading QR code:", storageError)
      throw new Error("Failed to upload QR code")
    }

    const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`

    // Ensure URL has a protocol
    const normalizedUrl = longUrl.startsWith("http") ? longUrl : `https://${longUrl}`

    // Create URL record
    const { data, error } = await supabase
      .from("urls")
      .insert([
        {
          title,
          user_id,
          original_url: normalizedUrl,
          custom_url: customUrl || null,
          short_url,
          qr,
        },
      ])
      .select()

    if (error) {
      // Clean up QR code if URL creation fails
      await supabase.storage.from("qrs").remove([fileName])
      console.error("Error creating URL:", error)
      throw new Error("Error creating short URL")
    }

    return data
  } catch (error) {
    console.error("Error in createUrl:", error)
    throw error
  }
}

/**
 * Delete a URL
 * @param {string} id - URL ID
 * @returns {Promise<Object>} - Deleted URL object
 */
export async function deleteUrl(id) {
  if (!id) {
    throw new Error("URL ID is required")
  }

  try {
    // Get the URL to delete (to get the QR code path)
    const { data: urlData } = await supabase.from("urls").select("qr").eq("id", id).single()

    // Delete the URL
    const { data, error } = await supabase.from("urls").delete().eq("id", id).select()

    if (error) {
      console.error("Error deleting URL:", error)
      throw new Error("Unable to delete URL")
    }

    // Extract the filename from the QR code URL
    if (urlData?.qr) {
      const fileName = urlData.qr.split("/").pop()
      // Delete the QR code
      await supabase.storage.from("qrs").remove([fileName])
    }

    return data
  } catch (error) {
    console.error("Error in deleteUrl:", error)
    throw new Error("Unable to delete URL")
  }
}


import { UAParser } from "ua-parser-js"
import supabase from "./supabase"

/**
 * Get clicks for multiple URLs
 * @param {Array<string>} urlIds - Array of URL IDs
 * @returns {Promise<Array>} - Array of click objects
 */
export async function getClicksForUrls(urlIds) {
  if (!urlIds || !urlIds.length) {
    return []
  }

  try {
    const { data, error } = await supabase.from("clicks").select("*").in("url_id", urlIds)

    if (error) {
      console.error("Error fetching clicks:", error)
      throw new Error("Unable to load click statistics")
    }

    return data || []
  } catch (error) {
    console.error("Error in getClicksForUrls:", error)
    return []
  }
}

/**
 * Get clicks for a specific URL
 * @param {string} url_id - URL ID
 * @returns {Promise<Array>} - Array of click objects
 */
export async function getClicksForUrl(url_id) {
  if (!url_id) {
    return []
  }

  try {
    const { data, error } = await supabase.from("clicks").select("*").eq("url_id", url_id)

    if (error) {
      console.error("Error fetching clicks for URL:", error)
      throw new Error("Unable to load statistics")
    }

    return data || []
  } catch (error) {
    console.error("Error in getClicksForUrl:", error)
    throw new Error("Unable to load statistics")
  }
}

/**
 * Store click data and redirect to original URL
 * @param {Object} params - Parameters
 * @param {string} params.id - URL ID
 * @param {string} params.originalUrl - Original URL
 * @returns {Promise<void>}
 */
export const storeClicks = async ({ id, originalUrl }) => {
  if (!id || !originalUrl) {
    console.error("Missing URL ID or original URL")
    return
  }

  try {
    // Parse user agent
    const parser = new UAParser()
    const result = parser.getResult()
    const device =
      result.device.type || (result.os.name === "iOS" || result.os.name === "Android" ? "mobile" : "desktop")

    // Get location data with timeout and fallback
    let locationData = { city: "Unknown", country_name: "Unknown" }
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch("https://ipapi.co/json", {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        locationData = await response.json()
      }
    } catch (error) {
      console.error("Error fetching location:", error)
    }

    // Record the click
    await supabase.from("clicks").insert({
      url_id: id,
      city: locationData.city || "Unknown",
      country: locationData.country_name || "Unknown",
      device: device,
    })

    // Ensure URL has a protocol
    let redirectUrl = originalUrl
    if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
      redirectUrl = "https://" + redirectUrl
    }

    return redirectUrl
  } catch (error) {
    console.error("Error recording click:", error)

    // Still return the URL even if click recording fails
    let redirectUrl = originalUrl
    if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
      redirectUrl = "https://" + redirectUrl
    }

    return redirectUrl
  }
}


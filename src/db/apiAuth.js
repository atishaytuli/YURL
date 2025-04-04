import supabase, { supabaseUrl } from "./supabase";

export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signup({ name, email, password, profile_pic }) {
  if (!name || !email || !password || !profile_pic) {
    throw new Error("All fields are required");
  }

  try {
    const fileName = `dp-${name.split(" ").join("-")}-${Date.now()}`;
    const { error: storageError } = await supabase.storage
      .from("profile-pic")
      .upload(fileName, profile_pic);

    if (storageError) throw new Error(storageError.message);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
        },
      },
    });

    if (error) {
      await supabase.storage.from("profile_pic").remove([fileName]);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) throw new Error(error.message);
    
    if (!session.session) return null;
    const { data: user } = await supabase.auth.getUser();
    
    return user?.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}
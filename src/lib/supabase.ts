import { createClient } from "@supabase/supabase-js";

// Retrieve key-value coordinates from Vite dynamic env
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Safely initialize the client. If coordinates are placeholders or empty,
// we will export a mock representation which enables standard state operations
// with mock responses, guaranteeing a zero-crash, highly resilient runtime.
export const isSupabaseConfigured = (() => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl === "https://your-supabase-project.supabase.co" || 
    supabaseUrl.includes("your-supabase-project") ||
    supabaseAnonKey === "your-supabase-anon-key" ||
    supabaseAnonKey.includes("your-supabase-anon")
  ) {
    return false;
  }
  try {
    const parsed = new URL(supabaseUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
})();

export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean high-fidelity client interface for authorization, favorites, and mix playlists
export const supabaseService = {
  // Trigger standard Google OAuth Authorization with Redirect or popup fallback
  async signInWithGoogle() {
    if (!supabaseClient) {
      console.warn("[SUPABASE] Offline mode active. Mocking user login credentials.");
      return { data: { user: { id: "offline-user-777", email: "visitor@starr.io", user_metadata: { full_name: "Stallion Visitor" } } }, error: null };
    }
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async signOut() {
    if (!supabaseClient) return { error: null };
    return await supabaseClient.auth.signOut();
  },

  async getCurrentUser() {
    if (!supabaseClient) {
      return { user: { id: "offline-user-777", email: "visitor@starr.io", name: "Stallion Guest" }, error: null };
    }
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      if (!user) return { user: null, error: null };

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Stallion Rider"
        },
        error: null
      };
    } catch (err: any) {
      return { user: null, error: err };
    }
  },

  // Save Hearts / Favorites track for current authenticated index user
  async toggleFavorite(userId: string, track: { id: string; title: string; coverUrl: string; artist: string }) {
    if (!supabaseClient) {
      console.log(`[SUPABASE MOCK] Toggled favorite for local storage trackId: ${track.id}`);
      return { success: true, action: "toggle", error: null };
    }

    try {
      // First check if already favorites
      const { data, error: fetchErr } = await supabaseClient
        .from("user_favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("youtube_video_id", track.id);

      if (fetchErr) throw fetchErr;

      if (data && data.length > 0) {
        // Delete exist favorite
        const { error: delErr } = await supabaseClient
          .from("user_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("youtube_video_id", track.id);
        
        if (delErr) throw delErr;
        return { success: true, action: "removed", error: null };
      } else {
        // Insert new favorite
        const { error: insErr } = await supabaseClient
          .from("user_favorites")
          .insert({
            user_id: userId,
            youtube_video_id: track.id,
            title: track.title,
            thumbnail_url: track.coverUrl,
            added_at: new Date().toISOString()
          });

        if (insErr) throw insErr;
        return { success: true, action: "added", error: null };
      }
    } catch (err: any) {
      console.error("[SUPABASE ERROR] toggleFavorite failed:", err.message);
      return { success: false, action: "failed", error: err.message };
    }
  },

  // Fetch all saved hearted video ids
  async fetchFavorites(userId: string) {
    if (!supabaseClient) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabaseClient
        .from("user_favorites")
        .select("*")
        .eq("user_id", userId)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error("[SUPABASE ERROR] fetchFavorites failed:", err.message);
      return { data: [], error: err.message };
    }
  },

  // Fetch user customized mix playlists
  async fetchCustomPlaylists(userId: string) {
    if (!supabaseClient) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabaseClient
        .from("custom_playlists")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error("[SUPABASE ERROR] fetchCustomPlaylists failed:", err.message);
      return { data: [], error: err.message };
    }
  },

  // Add customized mix playlist name
  async createCustomPlaylist(userId: string, playlistName: string, trackIds: string[]) {
    if (!supabaseClient) {
      return { data: { id: "mock-playlist-" + Math.random(), playlist_name: playlistName, track_ids_array: trackIds }, error: null };
    }

    try {
      const { data, error } = await supabaseClient
        .from("custom_playlists")
        .insert({
          user_id: userId,
          playlist_name: playlistName,
          track_ids_array: trackIds,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      console.error("[SUPABASE ERROR] createCustomPlaylist failed:", err.message);
      return { data: null, error: err.message };
    }
  },

  // Save tracks vector into customized playlist
  async updatePlaylistTracks(playlistId: string, trackIds: string[]) {
    if (!supabaseClient) {
      return { success: true, error: null };
    }

    try {
      const { error } = await supabaseClient
        .from("custom_playlists")
        .update({ track_ids_array: trackIds })
        .eq("id", playlistId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err: any) {
      console.error("[SUPABASE ERROR] updatePlaylistTracks failed:", err.message);
      return { success: false, error: err.message };
    }
  }
};

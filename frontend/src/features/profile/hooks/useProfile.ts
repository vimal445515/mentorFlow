import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfile } from "../api/profileApi";
import type {
  StudentProfileData,
  MentorProfileData,
  UpdateProfileDto,
} from "../types/profile.types";

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfileData | MentorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProfile();
      setProfile(res.data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = async (updatedData: UpdateProfileDto) => {
    try {
      const res = await updateProfile(updatedData);
      if (res.data) {
        console.log("update data:",updatedData)
        console.log("profile data",res.data);
        setProfile(res.data);
      }
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    saveProfile,
  };
}

export default useProfile;

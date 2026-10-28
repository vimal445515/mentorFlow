import { useState, useEffect, type FC } from "react";
import {
  Camera,
  ShieldCheck,
  ArrowRight,
  Save,
  ShieldAlert,
} from "lucide-react";
import { ProfileTopBar } from "../components/ProfileTopBar";
import { MentorSidebar } from "../components/MentorSidebar";
import { getProfile, requestAdminAproval, updateProfile } from "../api/profileApi";
import type { MentorProfileData } from "../types/profile.types";
import { useAppSelector } from "@/app/store/hooks";
import { useToast } from "@/shared/components/Toast";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import { showAlert } from "@/shared/components/alertBox";

export const MentorProfilePage: FC = () => {
  const handleLogoutClick = useMentorLogout();
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [requestingVerification, setRequestingVerification] = useState(false);
  const [profile, setProfile] = useState<MentorProfileData>({
    id: user?.id || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    role: user?.role || "MENTOR",
    profileImageUrl: user?.profileImageUrl || "",
    status: user?.status || "ACTIVE",
    headline: "",
    sessionPrice: 0,
    teachingSubjects: "",
    bio: "",
    yearsExperience: 0,
    verificationStatus: "ACTIVE",
  });

  const [fullName, setFullName] = useState(profile.fullName);
  const [headline, setHeadline] = useState(profile.headline);
  const [sessionPrice, setSessionPrice] = useState<number | string>(profile.sessionPrice || 0);
  const [teachingSubjects, setTeachingSubjects] = useState(profile.teachingSubjects);
  const [bio, setBio] = useState(profile.bio);
  const verificationStatus = profile.verificationStatus || "ACTIVE";
  const isVerificationPending = verificationStatus === "PENDING_APPROVAL";
  const isVerified = verificationStatus === "APPROVED";
  const verificationStatusLabel = verificationStatus
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((res) => {
        if (isMounted && res.data) {
          const data = res.data as MentorProfileData;
          setProfile(data);
          setFullName(data.fullName || user?.fullName || "");
          setHeadline(data.headline);
          setSessionPrice(data.sessionPrice || 0);
          setTeachingSubjects(data.teachingSubjects);
          setBio(data.bio);
        }
      })
      .catch((err) => {
        console.error("Failed to load mentor profile:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({
        fullName,
        headline,
        sessionPrice: Number(sessionPrice) || 0,
        teachingSubjects,
        bio,
      });

      if (res.success) {
        if (res.data?.role === "MENTOR") {
          setProfile(res.data);
        }
        showToast("Mentor profile saved successfully!", "success", "Changes Saved");
      } else {
        showToast(res.message || "Could not save profile", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Error updating mentor profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    const action = await showAlert(
      "MENTOR",
      "Request for verification",
      "Do you want to request verification for your mentor account?",
      "info",
      "Verify",
      "Cancel",
    );
    if (!action.isConfirmed) return;

    setRequestingVerification(true);
    try {
      const response = await requestAdminAproval();
      if (!response.success) {
        showToast(response.message || "Could not submit verification request.", "error");
        return;
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        verificationStatus:
          response.data?.verificationStatus ?? "PENDING_APPROVAL",
      }));
      showToast(
        response.message || "Verification request submitted for staff review.",
        "success",
        "Verification",
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Could not submit verification request.",
        "error",
        "Verification Failed",
      );
    } finally {
      setRequestingVerification(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      {/* Top Bar */}
      <ProfileTopBar
        role="MENTOR"
        pageTitle="Edit Profile"
        onLogout={handleLogoutClick}
        action={() => showToast("Public mentor directory preview active", "info")}
        actionName="view profile"
      />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <MentorSidebar activeItem="Profile" />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-6 w-full overflow-y-auto">
          {/* Header Title & Verification Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                Mentor Profile &amp; Credentials
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                This information is displayed to students browsing mentors on the platform.
              </p>
            </div>
            <div>
            </div>
          </div>

          {/* Verification Banner Card */}
          <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#3D6946]" />
                <h3 className="text-sm font-bold text-stone-900">Mentor Verification</h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                    isVerified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isVerificationPending
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                  }`}
                >
                  {verificationStatusLabel}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {isVerified
                  ? "Your mentor profile is verified."
                  : isVerificationPending
                    ? "Your verification request is pending admin review."
                    : "Your mentor profile has not been submitted for verification yet."}
              </p>
            </div>

            {!isVerified && (
              <button
                type="button"
                onClick={() => void handleRequestVerification()}
                disabled={requestingVerification || isVerificationPending}
                className="px-4 py-2 rounded-xl bg-[#3D6946] hover:bg-[#32573a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 self-start sm:self-auto disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {requestingVerification
                    ? "Submitting..."
                    : isVerificationPending
                      ? "Request Pending"
                      : "Request Verification"}
                </span>
              </button>
            )}
          </section>

          {/* Main Edit Card */}
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Profile Photo & Public Avatar */}
            <div className="flex items-center gap-5 pb-6 border-b border-stone-100">
              <div className="relative shrink-0">
                {profile.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-stone-200 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-xs bg-[#3D6946]">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#3D6946] text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Camera className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-stone-900">
                  Profile Photo &amp; Public Avatar
                </h4>
                <p className="text-xs text-stone-500">
                  Clear headshot recommended. Dimensions: 400&times;400px JPG or PNG.
                </p>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer shadow-xs inline-block"
                >
                  Change Image
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Row 1: Full Name & Professional Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
                    placeholder="e.g. Staff Backend Architect"
                  />
                </div>
              </div>

              {/* Row 2: Session Hourly Rate & Primary Teaching Subjects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Session Hourly Rate (&#8377; INR)
                  </label>
                  <input
                    type="number"
                    value={sessionPrice}
                    onChange={(e) => setSessionPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
                    placeholder="500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Primary Teaching Subjects
                  </label>
                  <input
                    type="text"
                    value={teachingSubjects}
                    onChange={(e) => setTeachingSubjects(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
                    placeholder="e.g. Node.js, Express, PostgreSQL, Distributed Systems"
                  />
                </div>
              </div>

              {/* Row 3: Mentor Bio & Philosophy */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Mentor Bio &amp; Philosophy
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white resize-none"
                  placeholder="Share your mentoring philosophy, engineering background, and mentorship style..."
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Edit Skills Manager</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Edit Career Timeline</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#3D6946] hover:bg-[#32573a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Profile Changes"}</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

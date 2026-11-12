import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Save, CheckCircle2 } from "lucide-react";
import { ProfileTopBar } from "../components/ProfileTopBar";
import { StudentSidebar } from "../components/StudentSidebar";
import { getProfile, updateProfile } from "../api/profileApi";
import type { StudentProfileData } from "../types/profile.types";
import { useAppSelector } from "@/app/store/hooks";
import { logout } from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";
import { showAlert } from "@/shared/components/alertBox";

export const StudentProfilePage: FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData>({
    id: user?.id || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    role: user?.role || "STUDENT",
    profileImageUrl: user?.profileImageUrl || "",
    status: user?.status || "ACTIVE",
    currentGoal: "",
    bio: "",
    timezone: "UTC",
    roadmapProgress: 0,
    sessionsCompleted: 0,
    milestoneApprovals: 0,
    badgesEarned: 0,
    notificationsEnabled: true,
  });

  const [fullName, setFullName] = useState(profile.fullName);
  const [currentGoal, setCurrentGoal] = useState(profile.currentGoal || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.notificationsEnabled ?? true,
  );

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((res) => {
        if (isMounted && res.data) {
          const data = res.data as StudentProfileData;
          setProfile(data);
          setFullName(data.fullName || "");
          setCurrentGoal(data?.currentGoal || "");
          setBio(data.bio || "");
          setNotificationsEnabled(data.notificationsEnabled ?? true);
        }
      })
      .catch((err) => {
        console.error("Failed to load student profile:", err);
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
        currentGoal,
        bio,
        notificationsEnabled,
      });

      if (res.data) {
        setProfile(res.data as StudentProfileData);
      }

      if (res.success) {
        showToast("Student profile saved successfully!", "success", "Changes Saved");
      } else {
        showToast(res.message || "Could not save profile", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      const result = await showAlert(
        "STUDENT",
        "Logout!",
        "Are you shure, you want to logout this account !",
        "question",
        "Confirm",
        "Cancel",
      );
      if (!result.isConfirmed) return;
      await logout();
      showToast("Logged out successfully.", "info");
    } finally {
      navigate("/student-login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      {/* Top Bar */}
      <ProfileTopBar role="STUDENT" pageTitle="My Profile" onLogout={handleLogoutClick} />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <StudentSidebar activeItem="" />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-7 w-full overflow-y-auto">
          {/* Card 1: Top Hero Summary */}
          <section className="bg-[#FAF6F0] rounded-3xl border  border-stone-400 p-6 sm:p-8 shadow-xs transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar with Camera Badge */}
                <div className="relative shrink-0">
                  {profile.profileImageUrl ? (
                    <img
                      src={profile.profileImageUrl}
                      alt={fullName}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-full object-cover border-3 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl text-white shadow-sm bg-gradient-to-tr from-[#A8522E] to-[#C85A32] border-3 border-white">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    title="Change profile avatar"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#A8522E] text-white flex items-center justify-center border-2 border-white shadow-xs hover:bg-[#8F401E] transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Profile Identity & Stats */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                      {fullName}
                    </h1>
                    {/* <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                      <Zap className="w-3 h-3 fill-[#6D28D9]" />
                      <span>Premium Student</span>
                    </span> */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active Account</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {profile.email}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-stone-700 font-semibold">
                    <span>
                      <strong className="font-extrabold text-stone-900">0%</strong> Roadmap Progress
                    </span>
                    <span className="text-stone-300">•</span>
                    <span>
                      <strong className="font-extrabold text-stone-900">0</strong> Sessions
                      Completed
                    </span>
                    <span className="text-stone-300">•</span>
                    <span>
                      <strong className="font-extrabold text-stone-900">0</strong> Milestone
                      Approvals
                    </span>
                    <span className="text-stone-300">•</span>
                    <span>
                      <strong className="font-extrabold text-stone-900">0</strong> Badges Earned
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Profile Button */}
              <div className="self-start md:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#A8522E] hover:bg-[#8F401E] text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Card 2: Account Details & Learning Goals */}
          <section className="bg-white rounded-3xl border border-stone-400 p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              Account Details & Learning Goals
            </h2>

            <div className="space-y-5">
              {/* Row 1: Full Name & Verified Email (Disabled) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-500 text-stone-900 text-sm focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors bg-white"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 flex items-center justify-between">
                    <span>Verified Email</span>
                    <span className="text-[11px] font-medium text-stone-400">Read-only</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-500 text-stone-500 text-sm bg-stone-50 cursor-not-allowed select-none focus:outline-none"
                    title="Email cannot be changed"
                  />
                </div>
              </div>

              {/* Row 2: Primary Career Objective */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Primary Career Objective
                </label>
                <input
                  type="text"
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-500 text-stone-900 text-sm focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors bg-white"
                  placeholder="e.g. Become a Professional Backend Engineer"
                />
              </div>

              {/* Row 3: Bio & Academic Interests */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Bio & Academic Interests
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-500 text-stone-900 text-sm focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32] transition-colors bg-white resize-none"
                  placeholder="Share a short bio, research topics, or technologies you want to master..."
                />
              </div>

              {/* Row 4: Notification Preferences */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
                {/* <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Notification Preferences
                  </h4>
                  <p className="text-xs text-stone-500">
                    Receive alerts for mentor session reminders and assignment
                    reviews
                  </p>
                </div> */}
                {/* <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#A8522E] accent-[#A8522E] focus:ring-[#A8522E] border-stone-300"
                  />
                  <span>Email & Push Notifications Enabled</span>
                </label> */}
              </div>
            </div>
          </section>

          {/* Card 3: Subscription Status
          <section className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  ACTIVE SUBSCRIPTION
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Renews on {profile.subscription?.renewalDate || 'Oct 24, 2026'}
                </span>
              </div>

              <button
                type="button"
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Crown className="w-3.5 h-3.5 text-stone-500" />
                <span>Manage Subscription</span>
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-stone-900">
                {profile.subscription?.planName || 'Premium Plan (₹199 / month)'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-3xl">
                Unlocks higher AI usage limits, AI Learning Assistant, RAG-based learning-material
                Q&amp;A, AI resource recommendations, and personalized learning recommendations.
                Subscriptions do not include individual mentor 1-on-1 session fees.
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-stone-100 text-xs">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Billing Cycle
                </span>
                <span className="font-semibold text-stone-800">
                  {profile.subscription?.billingCycle || 'Monthly Auto-Debit (UPI)'}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  AI Limits
                </span>
                <span className="font-semibold text-stone-800">
                  {profile.subscription?.aiLimits || 'Expanded AI Usage'}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  AI Assistant
                </span>
                <span className="font-semibold text-stone-800">
                  {profile.subscription?.aiAssistant || 'Enabled (RAG Grounded)'}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Plan Change
                </span>
                <button
                  type="button"
                  className="font-semibold text-[#A8522E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Switch / Cancel</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </section> */}
        </main>
      </div>
    </div>
  );
};

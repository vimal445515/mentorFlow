import { useEffect, useState, type FC } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useToast } from "@/shared/components/Toast";
import { AdminTopBar } from "../components/AdminTopBar";
import { approveMentor, getMentorDetails, rejectMentor } from "../api/mentorApi";
import type {
  MentorDetails,
  MentorExperienceDetail,
} from "../types/mentor.types";
import type { ManagedUserStatus } from "../types/user.types";
import { showAlert } from "@/shared/components/alertBox";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function formatStatus(status: ManagedUserStatus): string {
  return status.replaceAll("_", " ");
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

function formatExperienceDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "numeric",
      }).format(date);
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatEnum(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function StatusBadge({ status }: { status: ManagedUserStatus }) {
  const classes =
    status === "ACTIVE" || status === "APPROVED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "SUSPENDED"
        ? "border-red-200 bg-red-50 text-red-600"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${classes}`}>
      {formatStatus(status)}
    </span>
  );
}

function ReviewValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-0.5 break-words text-xs font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function ExperienceItem({ experience }: { experience: MentorExperienceDetail }) {
  const dateRange = `${formatExperienceDate(experience.startDate)} — ${
    experience.isCurrent
      ? "Present"
      : experience.endDate
        ? formatExperienceDate(experience.endDate)
        : "End date not provided"
  }`;

  return (
    <article className="space-y-2 border-t border-stone-100 pt-5 first:border-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-2">
        {experience.isCurrent && (
          <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Current Position
          </span>
        )}
        <span className="text-xs text-stone-400">{dateRange}</span>
      </div>
      <div>
        <h3 className="text-base font-bold text-stone-900">{experience.title}</h3>
        {experience.company && (
          <p className="text-xs font-semibold text-stone-600">{experience.company}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-500">
        <span>{formatEnum(experience.employmentType)}</span>
        <span>{formatEnum(experience.workPlaceType)}</span>
        {experience.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {experience.location}
          </span>
        )}
      </div>
      {experience.description && (
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-stone-600">
          {experience.description}
        </p>
      )}
    </article>
  );
}

export const AdminMentorDetailsPage: FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const { showToast } = useToast();
  const [mentor, setMentor] = useState<MentorDetails | null>(null);
  const [requestError, setRequestError] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const requestKey = `${mentorId ?? ""}:${refreshKey}`;
  const isLoading = loadedRequestKey !== requestKey;
  const loadError = mentorId ? requestError : "A mentor ID is required.";

  useEffect(() => {
    if (!mentorId) {
      return;
    }

    const controller = new AbortController();
    getMentorDetails(mentorId, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        if (!response.data) {
          throw new Error(response.message || "Mentor details were not returned.");
        }
        setMentor(response.data);
        setRequestError("");
        setLoadedRequestKey(requestKey);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setRequestError(getErrorMessage(error, "Could not load mentor details."));
          setLoadedRequestKey(requestKey);
        }
      });

    return () => controller.abort();
  }, [mentorId, requestKey]);

  const refresh = () => {
    setRequestError("");
    setRefreshKey((previousKey) => previousKey + 1);
  };

  const handleApprovalDecision = async (decision: "APPROVE" | "REJECT") => {
    if (!mentor) {
      return;
    }

    const isApproval = decision === "APPROVE";
    const isRevoking = !isApproval && mentor.verificationStatus === "APPROVED";
    const confirmation = await showAlert(
      "ADMIN",
      isApproval
        ? "Approve mentor?"
        : isRevoking
          ? "Revoke mentor verification?"
          : "Reject verification request?",
      isApproval
        ? `Approve ${mentor.fullName} as a verified mentor?`
        : isRevoking
          ? `Revoke ${mentor.fullName}'s verified status? Their verification status will return to active.`
          : `Reject ${mentor.fullName}'s verification request? Their verification status will return to active.`,
      "question",
      isApproval ? "Approve" : "Reject",
      "Cancel",
    );
    if (!confirmation.isConfirmed) {
      return;
    }

    setIsUpdating(true);
    try {
      if (isApproval) {
        await approveMentor(mentor.id);
      } else {
        await rejectMentor(mentor.id);
      }
      showToast(
        isApproval
          ? `${mentor.fullName} has been verified.`
          : isRevoking
            ? `${mentor.fullName}'s verification was revoked.`
            : `${mentor.fullName}'s verification request was rejected.`,
        "success",
      );
      refresh();
    } catch (error) {
      showToast(
        getErrorMessage(
          error,
          isApproval
            ? "Could not approve mentor."
            : isRevoking
              ? "Could not revoke mentor verification."
              : "Could not reject verification request.",
        ),
        "error",
        isApproval ? "Approval Failed" : isRevoking ? "Revocation Failed" : "Rejection Failed",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const skillCount = mentor?.skills.length ?? 0;
  const experienceCount = mentor?.experiences.length ?? 0;

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#F5F2EE] font-sans text-stone-900">
      <AdminTopBar
        actions={
          <div className="flex items-center gap-2">
            {mentor && !isLoading && !loadError && (
              <span className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 sm:inline-flex">
                {mentor.verificationStatus === "APPROVED" ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <Clock size={14} className="text-amber-600" />
                )}
                {formatStatus(mentor.verificationStatus)}
              </span>
            )}
            <button
              type="button"
              onClick={refresh}
              disabled={isLoading || !mentorId}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-xs transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Refresh mentor details"
            >
              <RefreshCw
                size={14}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        }
      >
        <Link to="/admin/mentors" className="hover:text-stone-900">
          Mentors
        </Link>
        <span className="mx-2 text-stone-300">/</span>
        <span className="font-semibold text-stone-900">
          {mentor?.fullName ?? "Mentor Details"}
        </span>
      </AdminTopBar>

      <main className="flex-1 p-5 sm:p-8">
        {isLoading ? (
          <div className="rounded-2xl border border-[#EBE6DF] bg-white px-6 py-16 text-center text-sm text-stone-500">
            Loading mentor details…
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center text-sm text-red-600">
            {loadError}
          </div>
        ) : mentor ? (
          <div className="space-y-6">
            <section className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs md:flex-row md:items-center">
              <div className="flex min-w-0 items-center gap-5">
                {mentor.profileImageUrl ? (
                  <img
                    src={mentor.profileImageUrl}
                    alt={mentor.fullName}
                    className="h-20 w-20 shrink-0 rounded-2xl border border-stone-200 object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-[#FDF0EC] text-2xl font-bold text-[#C85A32] shadow-sm">
                    {mentor.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                      {mentor.fullName}
                    </h1>
                    <StatusBadge status={mentor.verificationStatus} />
                    <StatusBadge status={mentor.status} />
                  </div>
                  <p className="break-all text-sm text-stone-600">
                    {mentor.headline || "Mentor"}
                    <span className="mx-1">•</span>
                    Rate:{" "}
                    <strong className="text-stone-900">
                      {formatPrice(mentor.sessionPrice)} / session
                    </strong>
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs font-medium text-stone-500">
                    <span>
                      <strong className="font-semibold text-stone-900">
                        {mentor.yearsExperience}
                      </strong>{" "}
                      {mentor.yearsExperience === 1 ? "Year" : "Years"} Experience
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} className="text-amber-500" />
                      <strong className="font-semibold text-stone-900">
                        {mentor.averageRating.toFixed(2)}
                      </strong>{" "}
                      Average Rating
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={12} />
                      <strong className="font-semibold text-stone-900">
                        {mentor.followerCount.toLocaleString()}
                      </strong>{" "}
                      Followers
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section className="space-y-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/30 to-white p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                        Admin Verification Review
                      </span>
                      <h2 className="text-lg font-bold text-stone-900">
                        Mentor Verification Request
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                      {mentor.verificationStatus === "APPROVED" ? (
                        <CheckCircle2 size={13} />
                      ) : mentor.verificationStatus === "SUSPENDED" ? (
                        <XCircle size={13} />
                      ) : (
                        <Clock size={13} />
                      )}
                      Verification: {formatStatus(mentor.verificationStatus)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-stone-200 bg-stone-50/80 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                    <ReviewValue label="Mentor Name" value={mentor.fullName} />
                    <ReviewValue label="Email Address" value={mentor.email} />
                    <ReviewValue
                      label="Session Price"
                      value={`${formatPrice(mentor.sessionPrice)} / session`}
                    />
                    <ReviewValue label="Profile Status" value={formatStatus(mentor.status)} />
                    <ReviewValue
                      label="Experience"
                      value={`${experienceCount} ${experienceCount === 1 ? "role" : "roles"} • ${mentor.yearsExperience} years`}
                    />
                    <ReviewValue
                      label="Timezone"
                      value={mentor.timezone || "Not provided"}
                    />
                    <ReviewValue
                      label="Technical Skills"
                      value={`${skillCount} ${skillCount === 1 ? "skill" : "skills"} listed`}
                    />
                    <ReviewValue
                      label="Biography"
                      value={mentor.bio ? `${mentor.bio.length} characters` : "Not provided"}
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                    <p className="text-xs text-stone-500">
                      Review the stored mentor profile, skills, and experience before approval.
                    </p>
                    {(mentor.verificationStatus === "PENDING_APPROVAL" ||
                      mentor.verificationStatus === "APPROVED") && (
                      <div className="flex flex-wrap gap-2">
                        {mentor.verificationStatus === "PENDING_APPROVAL" && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => void handleApprovalDecision("APPROVE")}
                            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle2 size={14} />
                            {isUpdating ? "Updating…" : "Approve Mentor"}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void handleApprovalDecision("REJECT")}
                          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-xs transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          {isUpdating
                            ? "Updating…"
                            : mentor.verificationStatus === "APPROVED"
                              ? "Revoke Verification"
                              : "Reject Request"}
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-3 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-stone-900">Mentor Biography</h2>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                    {mentor.bio || "No biography provided."}
                  </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-stone-900">Technical Skills</h2>
                  {mentor.skills.length ? (
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => (
                        <span
                          key={skill.skillId}
                          title={skill.subtopics || undefined}
                          className="rounded-full border border-[#EBE3DB] bg-[#F5F0EB] px-3 py-1 text-xs font-medium text-stone-800"
                        >
                          {skill.skillName} ({formatEnum(skill.proficiencyLevel)})
                        </span>
                      ))}
                    </div>
                  ) : mentor.teachingSubjects ? (
                    <div className="flex flex-wrap gap-2">
                      {mentor.teachingSubjects.split(",").map((subject) => subject.trim()).filter(Boolean).map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full border border-[#EBE3DB] bg-[#F5F0EB] px-3 py-1 text-xs font-medium text-stone-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">No technical skills provided.</p>
                  )}
                  {mentor.skills.some((skill) => skill.subtopics) && (
                    <div className="space-y-2 border-t border-stone-100 pt-3">
                      {mentor.skills.filter((skill) => skill.subtopics).map((skill) => (
                        <p key={skill.skillId} className="text-xs text-stone-500">
                          <span className="font-semibold text-stone-700">{skill.skillName}:</span>{" "}
                          {skill.subtopics}
                        </p>
                      ))}
                    </div>
                  )}
                  {mentor.teachingSubjects && (
                    <p className="border-t border-stone-100 pt-3 text-xs text-stone-500">
                      Teaching subjects: {mentor.teachingSubjects}
                    </p>
                  )}
                </section>

                <section className="space-y-6 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-stone-700" />
                      <h2 className="text-base font-bold text-stone-900">
                        Experience History
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-600">
                        {experienceCount} {experienceCount === 1 ? "Role" : "Roles"}
                      </span>
                      <span className="rounded-full border border-[#DCE7DE] bg-[#F0F6F1] px-2.5 py-1 text-xs font-semibold text-[#3D6946]">
                        {mentor.yearsExperience}{" "}
                        {mentor.yearsExperience === 1 ? "year" : "years"} total
                      </span>
                    </div>
                  </div>
                  {mentor.experiences.length ? (
                    <div className="space-y-5">
                      {mentor.experiences.map((experience) => (
                        <ExperienceItem
                          key={experience.experienceId}
                          experience={experience}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">No experience history provided.</p>
                  )}
                </section>
              </div>

              <aside className="space-y-6">
                <section className="space-y-4 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-stone-900">
                    Account Status &amp; Controls
                  </h2>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-stone-500">Account Status:</span>
                      <StatusBadge status={mentor.status} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-stone-500">Verification:</span>
                      <StatusBadge status={mentor.verificationStatus} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-stone-500">Joined:</span>
                      <span className="font-semibold text-stone-700">
                        {formatDate(mentor.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-stone-500">Approved:</span>
                      <span className="font-semibold text-stone-700">
                        {mentor.approvedAt ? formatDate(mentor.approvedAt) : "Not approved"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-stone-500">Timezone:</span>
                      <span className="font-semibold text-stone-700">
                        {mentor.timezone || "Not provided"}
                      </span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

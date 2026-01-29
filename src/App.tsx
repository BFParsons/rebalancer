import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useAuth } from "./contexts/AuthContext";
import { api } from "./api/client";
import { Login } from "./components/Login";
import { Onboarding } from "./components/Onboarding";
import { SurveyForm } from "./components/SurveyForm";
import { TeamDashboard } from "./components/TeamDashboard";
import { HistoricalView } from "./components/HistoricalView";
import { Avatar } from "./components/Avatar";
import { AvatarPicker } from "./components/AvatarPicker";
import { Button } from "./components/ui/button";
import { Users, ClipboardList, LogOut } from "lucide-react";

export default function App() {
  const { user, isLoading, isAuthenticated, logout, refreshUser } = useAuth();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"survey" | "dashboard">("survey");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [membersData, surveysData] = await Promise.all([
        api.teamMembers.getAll(),
        api.surveys.getCurrentWeek(),
      ]);

      // Transform team members to match frontend format
      const transformedMembers = membersData.map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatar: m.avatarInitials,
        weeklyHours: m.weeklyHours,
      }));

      // Transform responses to match frontend format
      const transformedResponses = surveysData.map((r: any) => ({
        id: r.id,
        userId: r.teamMemberId,
        week: r.weekStart,
        capacity: r.capacity,
        stressLevel: r.stressLevel,
        anticipatedWorkload: r.anticipatedWorkload,
        comments: r.comments,
        highWorkloadReason: r.highWorkloadReason,
        highWorkloadOther: r.highWorkloadOther,
        stressReduction: r.stressReduction,
      }));

      setTeamMembers(transformedMembers);
      setResponses(transformedResponses);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateWeeklyHours = async (memberId: string, hours: number) => {
    try {
      await api.teamMembers.update(memberId, { weeklyHours: hours });
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, weeklyHours: hours } : member
        )
      );
    } catch (error) {
      console.error("Failed to update weekly hours:", error);
    }
  };

  const handleSurveySubmit = async (data: any) => {
    try {
      // Get current week start (Monday)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      const weekStart = monday.toISOString().split("T")[0];

      const surveyData = {
        weekStart,
        capacity: data.capacity,
        stressLevel: data.stressLevel,
        anticipatedWorkload: data.anticipatedWorkload,
        comments: data.comments,
        highWorkloadReason: data.highWorkloadReason,
        highWorkloadOther: data.highWorkloadOther,
        stressReduction: data.stressReduction,
      };

      const newResponse = await api.surveys.create(surveyData);

      // Add to local state
      setResponses((prev) => [
        ...prev,
        {
          id: newResponse.id,
          userId: newResponse.teamMemberId,
          week: newResponse.weekStart,
          capacity: newResponse.capacity,
          stressLevel: newResponse.stressLevel,
          anticipatedWorkload: newResponse.anticipatedWorkload,
          comments: newResponse.comments,
          highWorkloadReason: newResponse.highWorkloadReason,
          highWorkloadOther: newResponse.highWorkloadOther,
          stressReduction: newResponse.stressReduction,
        },
      ]);
    } catch (error: any) {
      console.error("Failed to submit survey:", error);
      alert(error.message || "Failed to submit survey");
    }
  };

  const handleAvatarSave = async (data: { type: 'initials' | 'animal' | 'custom'; animal?: string; imageUrl?: string }) => {
    if (!user?.teamMember?.id) return;

    await api.teamMembers.updateAvatar(user.teamMember.id, data);
    // Refresh user data
    await refreshUser();
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show loading while fetching data
  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Create currentUser object from auth user
  const currentUser = user?.teamMember
    ? {
        id: user.teamMember.id,
        name: user.teamMember.name,
        role: user.teamMember.role,
        avatar: user.teamMember.avatarInitials,
        avatarType: user.teamMember.avatarType || 'initials',
        avatarAnimal: user.teamMember.avatarAnimal,
        avatarImageUrl: user.teamMember.avatarImageUrl,
        weeklyHours: user.teamMember.weeklyHours,
      }
    : {
        id: user?.id || "",
        name: user?.displayName || user?.email || "User",
        role: user?.role || "member",
        avatar: user?.displayName?.slice(0, 2).toUpperCase() || "U",
        avatarType: 'initials' as const,
        avatarAnimal: undefined,
        avatarImageUrl: undefined,
        weeklyHours: 40,
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* User menu */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <Avatar
          type={currentUser.avatarType}
          initials={currentUser.avatar}
          animal={currentUser.avatarAnimal}
          imageUrl={currentUser.avatarImageUrl}
          size="md"
          onClick={() => setShowAvatarPicker(true)}
        />
        <span className="text-sm text-gray-600 hidden sm:inline">
          {user?.displayName || user?.email}
        </span>
        <Button variant="ghost" size="sm" onClick={logout} title="Logout">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && user?.teamMember && (
          <AvatarPicker
            currentType={currentUser.avatarType}
            currentAnimal={currentUser.avatarAnimal}
            currentImageUrl={currentUser.avatarImageUrl}
            initials={currentUser.avatar}
            onSave={handleAvatarSave}
            onClose={() => setShowAvatarPicker(false)}
          />
        )}
      </AnimatePresence>

      {viewMode === "survey" ? (
        showOnboarding ? (
          <Onboarding
            onComplete={() => setShowOnboarding(false)}
            currentUser={currentUser}
          />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="absolute top-4 right-24">
              <Button
                variant="outline"
                onClick={() => setViewMode("dashboard")}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manager Dashboard
              </Button>
            </div>
            <SurveyForm onSubmit={handleSurveySubmit} currentUser={currentUser} />
          </div>
        )
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-blue-600 mb-2">Team Capacity Tracker</h1>
              <p className="text-gray-600">
                Weekly surveys to monitor team wellbeing and workload
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setViewMode("survey")}
              className="flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Take Survey
            </Button>
          </div>

          <TeamDashboard
            teamMembers={teamMembers}
            responses={responses}
            onUpdateWeeklyHours={handleUpdateWeeklyHours}
          />

          <div className="mt-8">
            <HistoricalView teamMembers={teamMembers} responses={responses} />
          </div>
        </div>
      )}
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Clock, MessageSquare, ChevronRight } from 'lucide-react';

interface TeamDashboardProps {
  teamMembers: any[];
  responses: any[];
  onUpdateWeeklyHours: (memberId: string, hours: number) => void;
}

export function TeamDashboard({ teamMembers, responses, onUpdateWeeklyHours }: TeamDashboardProps) {
  const getCurrentWeekResponses = () => {
    // Calculate Monday of current week to match week_start format
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const currentWeekStart = monday.toISOString().split('T')[0];
    // Compare just the date portion (handle both "2026-01-26" and "2026-01-26T00:00:00.000Z")
    return responses.filter(r => r.week && r.week.substring(0, 10) === currentWeekStart);
  };

  const currentResponses = getCurrentWeekResponses();

  const getResponseForMember = (memberId: string) => {
    return currentResponses.find(r => r.userId === memberId);
  };

  const getStressBadge = (level: number) => {
    if (level <= 3) return { variant: 'default' as const, text: 'Low', color: 'bg-green-500' };
    if (level <= 6) return { variant: 'secondary' as const, text: 'Moderate', color: 'bg-yellow-500' };
    return { variant: 'destructive' as const, text: 'High', color: 'bg-red-500' };
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity <= 80) return 'bg-blue-500';
    if (capacity <= 100) return 'bg-green-500';
    return 'bg-orange-500';
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getWorkloadBadge = (workload: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[workload as keyof typeof colors] || colors.medium;
  };

  const getWorkloadIcon = (workload: string) => {
    if (workload === 'low') return <TrendingDown className="w-3 h-3" />;
    if (workload === 'high') return <TrendingUp className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const hasFeedback = (response: any) => {
    return response?.comments || response?.stressReduction || response?.highWorkloadOther;
  };

  const getFeedbackSnippet = (response: any, maxLength: number = 80) => {
    const feedback = response?.comments || response?.stressReduction || response?.highWorkloadOther || '';
    if (feedback.length <= maxLength) return feedback;
    return feedback.substring(0, maxLength).trim() + '...';
  };

  const getHighWorkloadReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'project_deadline': 'Nearing deadline',
      'understaffed': 'Too much work allocated',
      'unplanned_work': 'Unplanned work came up',
      'meetings': 'Too many meetings',
      'dependencies': 'Blocked by dependencies',
      'other': 'Other'
    };
    return labels[reason] || reason;
  };

  const averageCapacity = currentResponses.length > 0
    ? Math.round(currentResponses.reduce((sum, r) => sum + r.capacity, 0) / currentResponses.length)
    : 0;

  const averageStress = currentResponses.length > 0
    ? (currentResponses.reduce((sum, r) => sum + r.stressLevel, 0) / currentResponses.length).toFixed(1)
    : 0;

  const highStressCount = currentResponses.filter(r => r.stressLevel >= 7).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Capacity</CardDescription>
            <CardTitle className="text-blue-600">{averageCapacity}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={averageCapacity} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Stress Level</CardDescription>
            <CardTitle className="text-purple-600">{averageStress}/10</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={Number(averageStress) * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>High Stress Alerts</CardDescription>
            <CardTitle className="text-red-600">{highStressCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {highStressCount > 0 ? 'Team members need support' : 'Team doing well'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Status Overview</CardTitle>
          <CardDescription>Current week responses from team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map(member => {
              const response = getResponseForMember(member.id);
              const stressBadge = response ? getStressBadge(response.stressLevel) : null;
              const showFeedback = hasFeedback(response);

              return (
                <div key={member.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    {/* Name row with inline stress/capacity indicators */}
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="truncate font-medium">{member.name}</h4>
                      {response && (
                        <div className="flex items-center gap-2">
                          {/* Capacity indicator */}
                          <div className="flex items-center gap-1" title={`Capacity: ${response.capacity}%`}>
                            <div className={`h-3 w-3 rounded-full ${getCapacityColor(response.capacity)}`}></div>
                            <span className="text-xs font-medium text-gray-600">{response.capacity}%</span>
                          </div>
                          {/* Stress indicator */}
                          <div className="flex items-center gap-1" title={`Stress: ${response.stressLevel}/10`}>
                            <div className={`h-3 w-3 rounded-full ${getStressColor(response.stressLevel)}`}></div>
                            <span className="text-xs font-medium text-gray-600">{response.stressLevel}/10</span>
                          </div>
                          {response.stressLevel >= 7 && (
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{member.role}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Weekly hours:</span>
                      <Input
                        type="number"
                        value={member.weeklyHours}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          if (value >= 0 && value <= 80) {
                            onUpdateWeeklyHours(member.id, value);
                          }
                        }}
                        className="w-16 h-7 text-sm px-2"
                        min="0"
                        max="80"
                      />
                      <span className="text-xs text-gray-400">
                        (100% = {member.weeklyHours}hrs)
                      </span>
                    </div>

                    {response ? (
                      <div className="space-y-3">
                        {/* Visual stress and capacity bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-gray-500">Capacity</p>
                              <span className="text-xs font-medium">{response.capacity}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getCapacityColor(response.capacity)}`}
                                style={{ width: `${Math.min(response.capacity, 150) / 1.5}%` }}
                              ></div>
                            </div>
                            {response.capacity > 100 && (
                              <p className="text-xs text-orange-600 mt-1">Over capacity</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-gray-500">Stress Level</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">{response.stressLevel}/10</span>
                                <Badge variant={stressBadge?.variant} className="text-xs px-1.5 py-0">
                                  {stressBadge?.text}
                                </Badge>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getStressColor(response.stressLevel)}`}
                                style={{ width: `${response.stressLevel * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Next week workload */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">Next week:</p>
                          <Badge variant="outline" className={`${getWorkloadBadge(response.anticipatedWorkload)} text-xs`}>
                            <span className="mr-1">{getWorkloadIcon(response.anticipatedWorkload)}</span>
                            {response.anticipatedWorkload.charAt(0).toUpperCase() + response.anticipatedWorkload.slice(1)}
                          </Badge>
                        </div>

                        {/* Feedback snippet with click to expand */}
                        {showFeedback && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors group"
                              >
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      "{getFeedbackSnippet(response)}"
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                                      {member.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  {member.name}'s Feedback
                                </DialogTitle>
                                <DialogDescription>
                                  Weekly check-in response
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 mt-4">
                                {/* Summary stats */}
                                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getCapacityColor(response.capacity)} text-white text-sm font-medium mb-1`}>
                                      {response.capacity}
                                    </div>
                                    <p className="text-xs text-gray-500">Capacity %</p>
                                  </div>
                                  <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getStressColor(response.stressLevel)} text-white text-sm font-medium mb-1`}>
                                      {response.stressLevel}
                                    </div>
                                    <p className="text-xs text-gray-500">Stress /10</p>
                                  </div>
                                  <div className="text-center">
                                    <Badge variant="outline" className={`${getWorkloadBadge(response.anticipatedWorkload)} text-xs mb-1`}>
                                      {response.anticipatedWorkload}
                                    </Badge>
                                    <p className="text-xs text-gray-500">Next week</p>
                                  </div>
                                </div>

                                {/* High workload reason if applicable */}
                                {response.highWorkloadReason && (
                                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <p className="text-xs font-medium text-orange-700 mb-1">Over Capacity Reason</p>
                                    <p className="text-sm text-gray-700">{getHighWorkloadReasonLabel(response.highWorkloadReason)}</p>
                                    {response.highWorkloadOther && (
                                      <p className="text-sm text-gray-600 mt-2 italic">"{response.highWorkloadOther}"</p>
                                    )}
                                  </div>
                                )}

                                {/* Stress reduction suggestions */}
                                {response.stressReduction && (
                                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                    <p className="text-xs font-medium text-purple-700 mb-1">How the team can help reduce stress</p>
                                    <p className="text-sm text-gray-700">"{response.stressReduction}"</p>
                                  </div>
                                )}

                                {/* General comments */}
                                {response.comments && (
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs font-medium text-blue-700 mb-1">Additional Comments</p>
                                    <p className="text-sm text-gray-700">"{response.comments}"</p>
                                  </div>
                                )}

                                {/* No feedback message */}
                                {!response.comments && !response.stressReduction && !response.highWorkloadOther && (
                                  <p className="text-sm text-gray-500 italic text-center py-4">
                                    No additional feedback provided this week.
                                  </p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No response submitted yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

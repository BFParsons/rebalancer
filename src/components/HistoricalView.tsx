import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

interface HistoricalViewProps {
  teamMembers: any[];
  responses: any[];
}

// Mock historical data for trends
const mockHistoricalData = [
  { week: 'Week 1', avgCapacity: 82, avgStress: 5.2, highStress: 2 },
  { week: 'Week 2', avgCapacity: 78, avgStress: 6.1, highStress: 3 },
  { week: 'Week 3', avgCapacity: 85, avgStress: 4.8, highStress: 1 },
  { week: 'Week 4', avgCapacity: 80, avgStress: 5.5, highStress: 2 },
  { week: 'Current', avgCapacity: 84, avgStress: 5.0, highStress: 1 },
];

const mockIndividualData = {
  '1': [
    { week: 'Week 1', capacity: 85, stress: 6 },
    { week: 'Week 2', capacity: 80, stress: 7 },
    { week: 'Week 3', capacity: 90, stress: 5 },
    { week: 'Week 4', capacity: 85, stress: 6 },
    { week: 'Current', capacity: 85, stress: 6 },
  ],
  '2': [
    { week: 'Week 1', capacity: 90, stress: 4 },
    { week: 'Week 2', capacity: 85, stress: 5 },
    { week: 'Week 3', capacity: 92, stress: 3 },
    { week: 'Week 4', capacity: 88, stress: 4 },
    { week: 'Current', capacity: 90, stress: 4 },
  ],
  '3': [
    { week: 'Week 1', capacity: 75, stress: 7 },
    { week: 'Week 2', capacity: 70, stress: 8 },
    { week: 'Week 3', capacity: 80, stress: 6 },
    { week: 'Week 4', capacity: 75, stress: 7 },
    { week: 'Current', capacity: 70, stress: 7 },
  ],
};

export function HistoricalView({ teamMembers }: HistoricalViewProps) {
  const [selectedMember, setSelectedMember] = useState<string>('team');

  const individualData = selectedMember !== 'team' 
    ? (mockIndividualData as any)[selectedMember] || []
    : null;

  return (
    <div className="space-y-6">
      {/* Member Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Historical capacity and stress trends</CardDescription>
            </div>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Entire Team</SelectItem>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Team Overview Charts */}
      {selectedMember === 'team' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Average Team Capacity Over Time</CardTitle>
              <CardDescription>Team's self-reported work capacity percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgCapacity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Average Capacity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Stress Levels Over Time</CardTitle>
              <CardDescription>Team's self-reported stress on a scale of 1-10</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgStress" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Average Stress Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High Stress Alerts</CardTitle>
              <CardDescription>Number of team members reporting high stress (7+)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="highStress" 
                    fill="#ef4444" 
                    name="High Stress Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Individual Member Charts */}
      {selectedMember !== 'team' && individualData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Individual Capacity Trend</CardTitle>
              <CardDescription>
                {teamMembers.find(m => m.id === selectedMember)?.name}'s capacity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={individualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="capacity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Capacity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Individual Stress Trend</CardTitle>
              <CardDescription>
                {teamMembers.find(m => m.id === selectedMember)?.name}'s stress levels over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={individualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Stress Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

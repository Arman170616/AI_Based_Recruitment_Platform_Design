"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, Mail, Phone, Video, MapPin, Plus, Edit, Send, CheckCircle } from "lucide-react"

interface Interview {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  date: string
  time: string
  duration: number
  type: "video" | "phone" | "in-person"
  interviewer: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  location?: string
  notes?: string
}

interface Shortlist {
  id: string
  name: string
  position: string
  candidates: {
    id: string
    name: string
    email: string
    score: number
    status: "pending" | "contacted" | "scheduled" | "interviewed"
  }[]
  createdDate: string
}

export default function SchedulingModule() {
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "1",
      candidateName: "Sarah Johnson",
      candidateEmail: "sarah.johnson@email.com",
      position: "Senior Frontend Developer",
      date: "2024-01-20",
      time: "10:00",
      duration: 60,
      type: "video",
      interviewer: "John Smith",
      status: "scheduled",
      notes: "Technical interview focusing on React and TypeScript",
    },
    {
      id: "2",
      candidateName: "Michael Chen",
      candidateEmail: "michael.chen@email.com",
      position: "Senior Frontend Developer",
      date: "2024-01-22",
      time: "14:00",
      duration: 45,
      type: "video",
      interviewer: "Jane Doe",
      status: "confirmed",
      notes: "Initial screening call",
    },
  ])

  const [shortlists, setShortlists] = useState<Shortlist[]>([
    {
      id: "1",
      name: "Frontend Developer Q1 2024",
      position: "Senior Frontend Developer",
      candidates: [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          score: 92,
          status: "scheduled",
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "michael.chen@email.com",
          score: 88,
          status: "scheduled",
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          email: "emily.rodriguez@email.com",
          score: 85,
          status: "contacted",
        },
      ],
      createdDate: "2024-01-15",
    },
  ])

  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "contacted":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-green-100 text-green-800"
      case "interviewed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      case "in-person":
        return <MapPin className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const scheduleInterview = (candidate: any) => {
    setSelectedCandidate(candidate)
    setShowScheduleForm(true)
  }

  const sendBulkInvitations = (shortlistId: string) => {
    // Simulate sending bulk invitations
    setShortlists((prev) =>
      prev.map((shortlist) =>
        shortlist.id === shortlistId
          ? {
              ...shortlist,
              candidates: shortlist.candidates.map((candidate) =>
                candidate.status === "pending" ? { ...candidate, status: "contacted" } : candidate,
              ),
            }
          : shortlist,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-yellow-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
                Interview Scheduling & Shortlisting
              </CardTitle>
              <CardDescription>Manage candidate shortlists and automate interview scheduling</CardDescription>
            </div>
            <Button onClick={() => setShowScheduleForm(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shortlists */}
        <div className="space-y-4">
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg">Candidate Shortlists</CardTitle>
              <CardDescription>Auto-generated shortlists based on AI scoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shortlists.map((shortlist) => (
                  <div key={shortlist.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{shortlist.name}</h4>
                        <p className="text-sm text-gray-600">{shortlist.position}</p>
                        <p className="text-xs text-gray-500">Created: {shortlist.createdDate}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{shortlist.candidates.length} candidates</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {shortlist.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{candidate.name}</span>
                              <span className="text-xs text-gray-500">({candidate.score}%)</span>
                            </div>
                            <p className="text-xs text-gray-600">{candidate.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getCandidateStatusColor(candidate.status)}>{candidate.status}</Badge>
                            {candidate.status === "contacted" && (
                              <Button size="sm" variant="outline" onClick={() => scheduleInterview(candidate)}>
                                <Calendar className="w-3 h-3 mr-1" />
                                Schedule
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => sendBulkInvitations(shortlist.id)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send Invitations
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-3 h-3 mr-1" />
                        Email All
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Interviews */}
        <div className="space-y-4">
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg">Scheduled Interviews</CardTitle>
              <CardDescription>Upcoming and recent interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div key={interview.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                        <p className="text-xs text-gray-500">{interview.candidateEmail}</p>
                      </div>
                      <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                          {interview.time} ({interview.duration}min)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getInterviewTypeIcon(interview.type)}
                        <span className="capitalize">{interview.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{interview.interviewer}</span>
                      </div>
                    </div>

                    {interview.notes && (
                      <div className="mb-3 p-2 bg-white rounded border border-yellow-200">
                        <p className="text-xs text-gray-600">{interview.notes}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-3 h-3 mr-1" />
                        Send Reminder
                      </Button>
                      {interview.status === "scheduled" && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Interview Form */}
      {showScheduleForm && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle>Schedule New Interview</CardTitle>
            <CardDescription>
              {selectedCandidate
                ? `Scheduling interview for ${selectedCandidate.name}`
                : "Create a new interview appointment"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate">Candidate Name</Label>
                <Input
                  id="candidate"
                  value={selectedCandidate?.name || ""}
                  placeholder="Select or enter candidate name"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="e.g., Senior Frontend Developer" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" placeholder="60" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Interview Type</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>
              <div>
                <Label htmlFor="interviewer">Interviewer</Label>
                <Input id="interviewer" placeholder="Select interviewer" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Interview focus areas, special instructions..." />
            </div>

            <div className="flex space-x-2">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" onClick={() => setShowScheduleForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Integration */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>Sync with external calendar systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="w-6 h-6 mb-2 text-blue-600" />
              <span>Google Calendar</span>
              <span className="text-xs text-gray-500">Connected</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="w-6 h-6 mb-2 text-blue-600" />
              <span>Outlook</span>
              <span className="text-xs text-gray-500">Not Connected</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Mail className="w-6 h-6 mb-2 text-green-600" />
              <span>Email Reminders</span>
              <span className="text-xs text-gray-500">Enabled</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

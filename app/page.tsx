"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Users,
  Target,
  Calendar,
  Settings,
  FileText,
  TrendingUp,
  BarChart3,
  Download,
  Filter,
  Plus,
} from "lucide-react"
import CVUploadModule from "@/components/cv-upload-module"
import JobRequirementsModule from "@/components/job-requirements-module"
import ScoringRankingModule from "@/components/scoring-ranking-module"
import AIChatbot from "@/components/ai-chatbot"
import SchedulingModule from "@/components/scheduling-module"
import AdminPanel from "@/components/admin-panel"

export default function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const stats = [
    {
      title: "Total CVs Processed",
      value: "2,847",
      change: "+12%",
      icon: FileText,
      color: "text-yellow-600",
    },
    {
      title: "Active Job Positions",
      value: "23",
      change: "+3",
      icon: Target,
      color: "text-yellow-600",
    },
    {
      title: "Candidates Shortlisted",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Interviews Scheduled",
      value: "42",
      change: "+15%",
      icon: Calendar,
      color: "text-blue-600",
    },
  ]

  const recentCandidates = [
    {
      name: "Sarah Johnson",
      position: "Senior Frontend Developer",
      score: 92,
      status: "Shortlisted",
      uploadDate: "2024-01-15",
    },
    {
      name: "Michael Chen",
      position: "Data Scientist",
      score: 88,
      status: "Under Review",
      uploadDate: "2024-01-15",
    },
    {
      name: "Emily Rodriguez",
      position: "UX Designer",
      score: 85,
      status: "Interview Scheduled",
      uploadDate: "2024-01-14",
    },
    {
      name: "David Kim",
      position: "Backend Developer",
      score: 78,
      status: "Under Review",
      uploadDate: "2024-01-14",
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50"
    if (score >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-800"
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-yellow-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Recruitment Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Job Position
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-yellow-100">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Upload className="w-4 h-4 mr-2" />
              CV Upload
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Job Requirements
            </TabsTrigger>
            <TabsTrigger value="scoring" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Scoring & Ranking
            </TabsTrigger>
            <TabsTrigger
              value="scheduling"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Candidates */}
              <Card className="lg:col-span-2 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Candidates
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </CardTitle>
                  <CardDescription>Latest CV submissions and their AI-generated scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCandidates.map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                          <p className="text-xs text-gray-500">Uploaded: {candidate.uploadDate}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}
                          >
                            {candidate.score}%
                          </div>
                          <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common recruitment tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New CVs
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-yellow-300">
                    <Target className="w-4 h-4 mr-2" />
                    Create Job Position
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-yellow-300">
                    <Users className="w-4 h-4 mr-2" />
                    Review Candidates
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-yellow-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-yellow-300">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Processing Status */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-yellow-600" />
                  AI Processing Status
                </CardTitle>
                <CardDescription>Real-time AI analysis and processing updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CV Parsing</span>
                      <span className="text-sm text-gray-600">23/25 completed</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Skill Matching</span>
                      <span className="text-sm text-gray-600">18/23 completed</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score Generation</span>
                      <span className="text-sm text-gray-600">15/18 completed</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <CVUploadModule />
          </TabsContent>

          <TabsContent value="jobs">
            <JobRequirementsModule />
          </TabsContent>

          <TabsContent value="scoring">
            <ScoringRankingModule />
          </TabsContent>

          <TabsContent value="scheduling">
            <SchedulingModule />
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}

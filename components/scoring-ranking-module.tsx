"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Users, Download, Filter, Search, Eye, Star, BarChart3, CheckCircle, AlertTriangle } from "lucide-react"

interface Candidate {
  id: string
  name: string
  email: string
  position: string
  overallScore: number
  skillsScore: number
  experienceScore: number
  educationScore: number
  status: "new" | "reviewed" | "shortlisted" | "rejected"
  uploadDate: string
  skills: string[]
  experience: string
  education: string
  strengths: string[]
  weaknesses: string[]
}

export default function ScoringRankingModule() {
  const [candidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      position: "Senior Frontend Developer",
      overallScore: 92,
      skillsScore: 95,
      experienceScore: 88,
      educationScore: 85,
      status: "shortlisted",
      uploadDate: "2024-01-15",
      skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
      experience: "6 years",
      education: "Bachelor's in Computer Science",
      strengths: ["Strong React expertise", "Full-stack capabilities", "Leadership experience"],
      weaknesses: ["Limited mobile development", "No cloud certifications"],
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      position: "Senior Frontend Developer",
      overallScore: 88,
      skillsScore: 90,
      experienceScore: 85,
      educationScore: 90,
      status: "reviewed",
      uploadDate: "2024-01-15",
      skills: ["React", "Vue.js", "JavaScript", "CSS", "Webpack"],
      experience: "5 years",
      education: "Master's in Software Engineering",
      strengths: ["Multi-framework experience", "Strong educational background", "Open source contributions"],
      weaknesses: ["No TypeScript experience", "Limited backend knowledge"],
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      position: "Senior Frontend Developer",
      overallScore: 85,
      skillsScore: 82,
      experienceScore: 90,
      educationScore: 80,
      status: "new",
      uploadDate: "2024-01-14",
      skills: ["React", "Angular", "JavaScript", "SASS", "Jest"],
      experience: "7 years",
      education: "Bachelor's in Information Technology",
      strengths: ["Extensive experience", "Testing expertise", "Team leadership"],
      weaknesses: ["No modern framework depth", "Limited TypeScript"],
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@email.com",
      position: "Senior Frontend Developer",
      overallScore: 78,
      skillsScore: 75,
      experienceScore: 80,
      educationScore: 85,
      status: "new",
      uploadDate: "2024-01-14",
      skills: ["JavaScript", "HTML", "CSS", "jQuery", "Bootstrap"],
      experience: "4 years",
      education: "Bachelor's in Computer Science",
      strengths: ["Solid fundamentals", "Good educational background", "Quick learner"],
      weaknesses: ["Limited modern framework experience", "No advanced tooling knowledge"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50"
    if (score >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "new":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedCandidates = filteredCandidates.sort((a, b) => b.overallScore - a.overallScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-yellow-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-yellow-600" />
                AI Scoring & Candidate Ranking
              </CardTitle>
              <CardDescription>AI-generated candidate scores with detailed analysis and ranking</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates by name, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total: {candidates.length}</span>
              <span>Shortlisted: {candidates.filter((c) => c.status === "shortlisted").length}</span>
              <span>
                Avg Score: {Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates List */}
        <div className="lg:col-span-2 space-y-4">
          {sortedCandidates.map((candidate, index) => (
            <Card key={candidate.id} className="border-yellow-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <Badge className="text-xs">#{index + 1}</Badge>
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-600">{candidate.position}</p>
                    <p className="text-xs text-gray-500">Uploaded: {candidate.uploadDate}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(candidate.overallScore)}`}>
                      {candidate.overallScore}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Overall Match</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Skills</span>
                      <span>{candidate.skillsScore}%</span>
                    </div>
                    <Progress value={candidate.skillsScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Experience</span>
                      <span>{candidate.experienceScore}%</span>
                    </div>
                    <Progress value={candidate.experienceScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Education</span>
                      <span>{candidate.educationScore}%</span>
                    </div>
                    <Progress value={candidate.educationScore} className="h-2" />
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(candidate)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Shortlist
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">{candidate.experience} experience</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed View */}
        <div className="space-y-4">
          {selectedCandidate ? (
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg">{selectedCandidate.name}</CardTitle>
                <CardDescription>Detailed AI Analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Score Visualization */}
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className={`text-3xl font-bold ${getScoreColor(selectedCandidate.overallScore).split(" ")[0]}`}>
                    {selectedCandidate.overallScore}%
                  </div>
                  <p className="text-sm text-gray-600">Overall Match Score</p>
                </div>

                {/* Score Breakdown Chart */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skills Match</span>
                        <span className="font-medium">{selectedCandidate.skillsScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.skillsScore} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Experience Match</span>
                        <span className="font-medium">{selectedCandidate.experienceScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.experienceScore} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Education Match</span>
                        <span className="font-medium">{selectedCandidate.educationScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.educationScore} className="h-3" />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {selectedCandidate.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {selectedCandidate.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Generate Full Report</Button>
                  <Button variant="outline" className="w-full">
                    Schedule Interview
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Shortlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-yellow-200">
              <CardContent className="p-6 text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a candidate to view detailed analysis</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg">Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">High Scorers (70%+)</span>
                <span className="font-medium">{candidates.filter((c) => c.overallScore >= 70).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Medium Scorers (50-69%)</span>
                <span className="font-medium">
                  {candidates.filter((c) => c.overallScore >= 50 && c.overallScore < 70).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Low Scorers (&lt;50%)</span>
                <span className="font-medium">{candidates.filter((c) => c.overallScore < 50).length}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">Average Score</span>
                <span className="font-bold text-yellow-600">
                  {Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

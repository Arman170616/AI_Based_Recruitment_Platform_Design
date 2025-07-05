"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Plus, Target, Save, X, Settings } from "lucide-react"

interface JobRequirement {
  id: string
  title: string
  department: string
  location: string
  description: string
  requirements: {
    skill: string
    weight: number
    mandatory: boolean
  }[]
  experience: {
    min: number
    max: number
    weight: number
  }
  education: {
    level: string
    weight: number
    mandatory: boolean
  }
  created: string
  status: "active" | "draft" | "closed"
}

export default function JobRequirementsModule() {
  const [jobs, setJobs] = useState<JobRequirement[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      description: "We are looking for an experienced frontend developer to join our team.",
      requirements: [
        { skill: "React", weight: 90, mandatory: true },
        { skill: "TypeScript", weight: 80, mandatory: true },
        { skill: "Next.js", weight: 70, mandatory: false },
        { skill: "Tailwind CSS", weight: 60, mandatory: false },
      ],
      experience: { min: 3, max: 8, weight: 85 },
      education: { level: "Bachelor's Degree", weight: 60, mandatory: false },
      created: "2024-01-10",
      status: "active",
    },
    {
      id: "2",
      title: "Data Scientist",
      department: "Analytics",
      location: "New York",
      description: "Join our data science team to build ML models and analytics solutions.",
      requirements: [
        { skill: "Python", weight: 95, mandatory: true },
        { skill: "Machine Learning", weight: 90, mandatory: true },
        { skill: "SQL", weight: 80, mandatory: true },
        { skill: "TensorFlow", weight: 70, mandatory: false },
      ],
      experience: { min: 2, max: 6, weight: 80 },
      education: { level: "Master's Degree", weight: 85, mandatory: true },
      created: "2024-01-08",
      status: "active",
    },
  ])

  const [editingJob, setEditingJob] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const addSkillToJob = (jobId: string, skill: string) => {
    if (!skill.trim()) return

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              requirements: [...job.requirements, { skill: skill.trim(), weight: 50, mandatory: false }],
            }
          : job,
      ),
    )
    setNewSkill("")
  }

  const updateSkillWeight = (jobId: string, skillIndex: number, weight: number) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              requirements: job.requirements.map((req, index) => (index === skillIndex ? { ...req, weight } : req)),
            }
          : job,
      ),
    )
  }

  const toggleSkillMandatory = (jobId: string, skillIndex: number) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              requirements: job.requirements.map((req, index) =>
                index === skillIndex ? { ...req, mandatory: !req.mandatory } : req,
              ),
            }
          : job,
      ),
    )
  }

  const removeSkill = (jobId: string, skillIndex: number) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              requirements: job.requirements.filter((_, index) => index !== skillIndex),
            }
          : job,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-yellow-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-yellow-600" />
                Job Requirements Management
              </CardTitle>
              <CardDescription>Create and manage job positions with AI-powered requirement matching</CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Job Position
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create Job Form */}
      {showCreateForm && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle>Create New Job Position</CardTitle>
            <CardDescription>Define requirements and criteria for candidate matching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g., Senior Frontend Developer" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="e.g., Engineering" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" placeholder="Describe the role and responsibilities..." />
            </div>
            <div className="flex space-x-2">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Create Position
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Positions List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="border-yellow-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>
                    {job.department} • {job.location} • Created {job.created}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingJob(editingJob === job.id ? null : job.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{job.description}</p>

              {editingJob === job.id ? (
                <div className="space-y-6 border-t pt-4">
                  {/* Skills Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Skills & Technologies</h4>
                    <div className="space-y-3">
                      {job.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{req.skill}</span>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={req.mandatory}
                                  onCheckedChange={() => toggleSkillMandatory(job.id, index)}
                                />
                                <span className="text-sm text-gray-600">Mandatory</span>
                                <Button variant="ghost" size="sm" onClick={() => removeSkill(job.id, index)}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Weight: {req.weight}%</span>
                              </div>
                              <Slider
                                value={[req.weight]}
                                onValueChange={(value) => updateSkillWeight(job.id, index, value[0])}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Skill */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add new skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addSkillToJob(job.id, newSkill)
                            }
                          }}
                        />
                        <Button
                          onClick={() => addSkillToJob(job.id, newSkill)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Experience Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Experience Requirements</h4>
                    <div className="p-3 bg-yellow-50 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Minimum Years</Label>
                          <Input type="number" value={job.experience.min} />
                        </div>
                        <div>
                          <Label>Maximum Years</Label>
                          <Input type="number" value={job.experience.max} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Experience Weight: {job.experience.weight}%</span>
                        </div>
                        <Slider value={[job.experience.weight]} max={100} step={5} className="w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Education Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Education Requirements</h4>
                    <div className="p-3 bg-yellow-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{job.education.level}</span>
                        <div className="flex items-center space-x-2">
                          <Switch checked={job.education.mandatory} />
                          <span className="text-sm text-gray-600">Mandatory</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Education Weight: {job.education.weight}%</span>
                        </div>
                        <Slider value={[job.education.weight]} max={100} step={5} className="w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingJob(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge
                          key={index}
                          className={req.mandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                        >
                          {req.skill} ({req.weight}%)
                          {req.mandatory && " *"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span> {job.experience.min}-{job.experience.max} years
                    </div>
                    <div>
                      <span className="font-medium">Education:</span> {job.education.level}
                      {job.education.mandatory && " (Required)"}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

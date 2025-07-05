"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Users,
  Shield,
  Database,
  Key,
  Activity,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "recruiter" | "hiring_manager"
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
}

interface SystemMetric {
  name: string
  value: string
  change: string
  status: "good" | "warning" | "error"
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@company.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 09:30",
      permissions: ["full_access", "user_management", "system_config"],
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@company.com",
      role: "recruiter",
      status: "active",
      lastLogin: "2024-01-15 14:20",
      permissions: ["cv_upload", "candidate_review", "interview_schedule"],
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "hiring_manager",
      status: "active",
      lastLogin: "2024-01-14 16:45",
      permissions: ["candidate_review", "interview_schedule", "final_decision"],
    },
  ])

  const [systemMetrics] = useState<SystemMetric[]>([
    { name: "System Uptime", value: "99.9%", change: "+0.1%", status: "good" },
    { name: "AI Processing Speed", value: "2.3s avg", change: "-0.2s", status: "good" },
    { name: "Database Size", value: "2.4 GB", change: "+120 MB", status: "good" },
    { name: "Active Users", value: "23", change: "+3", status: "good" },
    { name: "API Response Time", value: "145ms", change: "+12ms", status: "warning" },
    { name: "Error Rate", value: "0.02%", change: "+0.01%", status: "warning" },
  ])

  const [showAddUser, setShowAddUser] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "recruiter":
        return "bg-blue-100 text-blue-800"
      case "hiring_manager":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMetricStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-yellow-600" />
            System Administration
          </CardTitle>
          <CardDescription>Manage users, system settings, and monitor platform performance</CardDescription>
        </CardHeader>
      </Card>

      {/* System Metrics */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-yellow-600" />
            System Health & Metrics
          </CardTitle>
          <CardDescription>Real-time system performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  {getMetricStatusIcon(metric.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span
                    className={`text-sm ${
                      metric.change.startsWith("+") && metric.status === "good"
                        ? "text-green-600"
                        : metric.change.startsWith("-") && metric.status === "good"
                          ? "text-green-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card className="border-yellow-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-yellow-600" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button onClick={() => setShowAddUser(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Last login: {user.lastLogin}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Permissions */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-yellow-600" />
              Security & Permissions
            </CardTitle>
            <CardDescription>Configure security settings and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Session Timeout</Label>
                  <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">API Rate Limiting</Label>
                  <p className="text-sm text-gray-600">Limit API requests per user</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Audit Logging</Label>
                  <p className="text-sm text-gray-600">Log all user actions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">API Keys</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div>
                    <span className="font-medium text-sm">Production API Key</span>
                    <p className="text-xs text-gray-500">Last used: 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="w-3 h-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div>
                    <span className="font-medium text-sm">Development API Key</span>
                    <p className="text-xs text-gray-500">Last used: 1 day ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="w-3 h-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-yellow-600" />
            Data Management
          </CardTitle>
          <CardDescription>Backup, export, and manage system data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-gray-900 mb-2">Database Backup</h4>
              <p className="text-sm text-gray-600 mb-3">Last backup: 2 hours ago</p>
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  <Download className="w-3 h-3 mr-1" />
                  Create Backup
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  <Upload className="w-3 h-3 mr-1" />
                  Restore Backup
                </Button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
              <p className="text-sm text-gray-600 mb-3">Export system data for analysis</p>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="w-3 h-3 mr-1" />
                  Export CVs
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="w-3 h-3 mr-1" />
                  Export Reports
                </Button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-gray-900 mb-2">Data Cleanup</h4>
              <p className="text-sm text-gray-600 mb-3">Remove old or unnecessary data</p>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clean Old CVs
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Archive Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Form */}
      {showAddUser && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account with appropriate permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="recruiter">Recruiter</option>
                  <option value="hiring_manager">Hiring Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "CV Upload",
                  "Candidate Review",
                  "Interview Schedule",
                  "Final Decision",
                  "User Management",
                  "System Config",
                ].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input type="checkbox" id={permission} />
                    <Label htmlFor={permission} className="text-sm">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

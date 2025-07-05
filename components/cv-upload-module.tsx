"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye, Download, RefreshCw } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: string
  status: "parsing" | "completed" | "error"
  progress: number
  extractedData?: {
    name: string
    email: string
    phone: string
    experience: string
    skills: string[]
  }
}

export default function CVUploadModule() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      status: "parsing",
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate AI parsing process
    newFiles.forEach((file) => {
      simulateParsingProcess(file.id)
    })
  }

  const simulateParsingProcess = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)

            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...file,
                progress: 100,
                status: Math.random() > 0.1 ? "completed" : "error",
                extractedData:
                  Math.random() > 0.1
                    ? {
                        name: "John Doe",
                        email: "john.doe@email.com",
                        phone: "+1 (555) 123-4567",
                        experience: "5+ years",
                        skills: ["JavaScript", "React", "Node.js", "Python"],
                      }
                    : undefined,
              }
            }

            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 500)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const retryParsing = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, status: "parsing", progress: 0 } : file)),
    )
    simulateParsingProcess(fileId)
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2 text-yellow-600" />
            CV Upload & AI Parsing
          </CardTitle>
          <CardDescription>
            Upload CVs in PDF, DOCX, or TXT format. Our AI will automatically extract and validate candidate
            information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-yellow-400 bg-yellow-50" : "border-yellow-300 bg-yellow-25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop CVs here, or click to browse</h3>
            <p className="text-gray-600 mb-4">Supports PDF, DOCX, and TXT files up to 10MB each</p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Select Files</Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {uploadedFiles.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>AI is analyzing uploaded CVs and extracting candidate information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-600">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === "completed" && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {file.status === "error" && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}
                      {file.status === "parsing" && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          Parsing
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {file.status === "parsing" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Processing Progress</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {file.status === "completed" && file.extractedData && (
                    <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                      <h5 className="font-medium text-gray-900 mb-2">Extracted Information</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {file.extractedData.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {file.extractedData.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {file.extractedData.phone}
                        </div>
                        <div>
                          <span className="font-medium">Experience:</span> {file.extractedData.experience}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.extractedData.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                      <p className="text-sm text-red-700 mb-2">
                        Failed to parse CV. The file might be corrupted or in an unsupported format.
                      </p>
                      <Button size="sm" variant="outline" onClick={() => retryParsing(file.id)}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {uploadedFiles.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>Perform actions on multiple CVs at once</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Process All to Job Matching</Button>
              <Button variant="outline" className="border-yellow-300">
                Export All Data
              </Button>
              <Button variant="outline" className="border-yellow-300">
                Generate Batch Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

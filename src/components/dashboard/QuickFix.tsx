"use client"

import Card from "../common/Card"
import Button from "../common/Button"
import {
  Zap,
  Info,
  Upload,
  Camera,
} from "lucide-react"

export default function QuickFix() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="p-8 max-w-4xl mx-auto h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quick Fix Solutions</h1>
            <p className="text-gray-600 mt-2 text-lg">Emergency remedies for sudden skin issues</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="bg-gradient-to-r from-teal-200 via-blue-100 to-teal-100 text-teal-900 px-4 py-2 rounded-lg inline-flex items-center font-semibold shadow-md">
              <Zap className="w-5 h-5 mr-2 animate-pulse text-teal-600" />
              Instant Help Available
            </span>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-100 via-white to-teal-100">
          <div className="p-12 flex flex-col items-center space-y-10">
            <span className="text-3xl font-bold text-gray-900">Quick Skin Check</span>
            <p className="text-gray-600 text-center max-w-2xl text-lg">Take or upload a photo to get instant feedback on your skin condition. Our AI will give you quick tips and highlight any visible concerns.</p>
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 transition hover:scale-105 hover:border-blue-400 focus:ring-2 focus:ring-blue-200">
                <Camera className="w-6 h-6 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 transition hover:scale-105 hover:border-teal-400 focus:ring-2 focus:ring-teal-200">
                <Upload className="w-6 h-6 mr-2" />
                Upload Photo
              </Button>
            </div>
            <div className="relative w-48 h-48 flex items-center justify-center mt-4">
              <div className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-3xl bg-white flex items-center justify-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer group shadow-lg">
                <Camera className="w-16 h-16 text-blue-200 group-hover:text-blue-400 transition-colors duration-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-gray-400 z-10 font-medium text-lg">No photo</span>
            </div>
            <div className="w-full border-t border-blue-100 my-4" />
            {/* Mock analysis result */}
            <div className="mt-4 p-6 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl text-center w-full shadow-md flex items-center justify-center gap-3">
              <Info className="h-6 w-6 text-blue-500" />
              <span className="text-lg text-blue-900 font-medium">Upload a photo to see instant skin insights here!</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

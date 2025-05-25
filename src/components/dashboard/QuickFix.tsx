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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quick Fix Solutions</h1>
          <p className="text-gray-600 mt-1">Emergency remedies for sudden skin issues</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-gradient-to-r from-teal-200 via-blue-100 to-teal-100 text-teal-900 px-3 py-1.5 rounded-lg inline-flex items-center font-semibold shadow-sm">
            <Zap className="w-3 h-3 mr-1" />
            Instant Help Available
          </span>
        </div>
      </div>

      

      <div className="mb-8">
        <Card className="border-0 shadow-2xl rounded-3xl shadow-lg bg-gradient-to-br from-blue-100 via-white to-teal-100">
          <div className="p-8 flex flex-col items-center space-y-6">
            <span className="text-2xl font-bold text-gray-900">Quick Skin Check</span>
            <p className="text-gray-600 text-center max-w-md">Take or upload a photo to get instant feedback on your skin condition. Our AI will give you quick tips and highlight any visible concerns.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button variant="outline" className="w-full sm:w-auto transition hover:scale-105 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" className="w-full sm:w-auto transition hover:scale-105 hover:border-teal-400">
                <Upload className="w-5 h-5 mr-2" />
                Upload Photo
              </Button>
            </div>
            <div className="relative w-36 h-36 flex items-center justify-center mt-4">
              <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-xl bg-white flex items-center justify-center transition hover:border-blue-400 cursor-pointer">
                <Camera className="w-10 h-10 text-gray-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-gray-400 z-10">No photo</span>
            </div>
            {/* Mock analysis result */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg text-center w-full shadow-sm">
              <Info className="h-5 w-5 inline mr-2 text-blue-500 align-middle" />
              <span className="text-base text-blue-900 font-medium align-middle">Upload a photo to see instant skin insights here!</span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}

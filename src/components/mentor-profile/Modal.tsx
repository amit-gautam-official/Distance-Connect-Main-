"use client"

import { X } from "lucide-react";

// Avatar Modal Component
export const AvatarModal = ({ isOpen ,  onClose, imageUrl, name } : {isOpen : Boolean, onClose : () => void, imageUrl : string, name : string}) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative max-w-2xl rounded-lg bg-white p-4 shadow-xl">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col items-center p-4">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">{name}&apos;s Profile Image</h3>
            <div className="overflow-hidden rounded-lg">
              <img 
                src={imageUrl || ""} 
                alt={name || "Profile"} 
                className="h-auto max-h-96 w-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = ""; // Handle image loading error
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
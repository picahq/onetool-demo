"use client"

import { useState, useRef, useEffect } from "react"
import { GeistSans } from "geist/font/sans"

const models = [
    { id: "gpt-4.1", name: "GPT-4.1" },
    { id: "gpt-5", name: "GPT-5" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
]

interface ModelSelectorProps {
    selectedModel: string
    onModelChange: (model: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const selectedModelName = models.find(model => model.id === selectedModel)?.name || "Select Model"

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setIsOpen(!isOpen)
        } else if (event.key === "Escape") {
            setIsOpen(false)
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            if (!isOpen) {
                setIsOpen(true)
                return
            }

            const currentIndex = models.findIndex(model => model.id === selectedModel)
            let nextIndex

            if (event.key === "ArrowDown") {
                nextIndex = currentIndex < models.length - 1 ? currentIndex + 1 : 0
            } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : models.length - 1
            }

            onModelChange(models[nextIndex].id)
        }
    }

    return (
        <div ref={dropdownRef} className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={`${GeistSans.className} w-36 h-8 text-xs bg-gray-900 border border-gray-700 rounded-md px-2 text-gray-400 cursor-pointer focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none flex items-center justify-between hover:bg-gray-800 transition-colors`}
            >
                <span className="truncate">{selectedModelName}</span>
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
                    {models.map((model) => (
                        <div
                            key={model.id}
                            onClick={() => {
                                onModelChange(model.id)
                                setIsOpen(false)
                            }}
                            className={`${GeistSans.className} px-2 py-2 text-xs cursor-pointer hover:bg-gray-800 transition-colors ${model.id === selectedModel
                                ? 'bg-gray-800 text-green-400'
                                : 'text-gray-300'
                                }`}
                            role="option"
                            aria-selected={model.id === selectedModel}
                        >
                            {model.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

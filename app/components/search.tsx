'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isExpanded: boolean
}

export default function SearchBar({ onSearch, isExpanded }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(inputValue)
  }

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`relative w-full max-w-xl mt-4 transition-transform ${isExpanded ? 'transform -translate-y-8' : ''}`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-full p-4 rounded-full text-black focus:outline-none transition-all duration-300 ${
          inputValue ? 'glow' : ''
        }`}
        placeholder="Search for investment opportunities"
      />
      <style jsx>{`
        input.glow {
          box-shadow: 0 0 5px #4299e1, 0 0 10px #4299e1, 0 0 15px #4299e1;
        }
        input.glow:focus {
          box-shadow: 0 0 10px #4299e1, 0 0 20px #4299e1, 0 0 30px #4299e1;
        }
      `}</style>
    </form>
  )
}

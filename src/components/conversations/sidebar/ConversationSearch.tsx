'use client'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function ConversationSearch({ value, onChange }: Props) {
  return (
    <div className="p-3 border-b">
      <input
        type="text"
        placeholder="Buscar por nombre o número..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring"
      />
    </div>
  )
}
'use client'

type Filter = 'all' | 'unread' | 'read'

interface Props {
  active: Filter
  onChange: (filter: Filter) => void
}

export default function ConversationFilters({ active, onChange }: Props) {
  const button = (key: Filter, label: string) => (
    <button
      onClick={() => onChange(key)}
      className={`px-3 py-1 text-sm rounded-full ${
        active === key
          ? 'bg-green-500 text-white'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex gap-2 p-3 border-b">
      {button('all', 'Todos')}
      {button('unread', 'No leídos')}
      {button('read', 'Leídos')}
    </div>
  )
}
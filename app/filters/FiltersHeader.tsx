export default function FiltersHeader({ onOpenFilters }: { onOpenFilters?: () => void }) {
  return (
    <div
      style={{
        width: '100%',
        padding: '14px 32px 16px'
      }}
    >
      <button onClick={onOpenFilters}>Фильтры</button>
    </div>
  )
}

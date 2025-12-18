import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { Search } from 'lucide-react'
import { useState } from 'react'

function BugSearch() {
  const [keywords, setKeywords] = useState('')
  const [classification, setClassification] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [minAge, setMinAge] = useState('')
  const [closed, setClosed] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  return (
    <div className="p-4 max-w-2xl">
      {/* Keywords Search */}
      <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
        <Input 
          placeholder="Keywords" 
          value={keywords} 
          onChange={(e) => setKeywords(e.target.value)} 
        />
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Classification */}
        <div>
          <Label>Classification</Label>
          <Select onValueChange={setClassification} value={classification}>
            <option value="">All</option>
            {/* Add your classification options here */}
            <option value="UI">UI</option>
            <option value="Backend">Backend</option>
            <option value="Performance">Performance</option>
          </Select>
        </div>

        {/* Age Filters */}
        <div className="flex space-x-2">
          <div>
            <Label>Max Age (days)</Label>
            <Input 
              type="number" 
              value={maxAge} 
              onChange={(e) => setMaxAge(e.target.value)} 
            />
          </div>
          <div>
            <Label>Min Age (days)</Label>
            <Input 
              type="number" 
              value={minAge} 
              onChange={(e) => setMinAge(e.target.value)} 
            />
          </div>
        </div>

        {/* Closed Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox checked={closed} onChange={(e) => setClosed(e.target.checked)} />
          <Label>Show Closed Bugs</Label>
        </div>

        {/* Sort By */}
        <div>
          <Label>Sort By</Label>
          <Select onValueChange={setSortBy} value={sortBy}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
            <option value="classification">Classification</option>
            <option value="assignedTo">Assigned To</option>
            <option value="createdBy">Reported By</option>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default BugSearch
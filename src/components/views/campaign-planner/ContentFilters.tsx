import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface ContentFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  showCampaignFilter?: boolean;
}

export interface FilterValues {
  campaign: string;
  format: string;
  type: string;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({ 
  onFilterChange,
  showCampaignFilter = true 
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    campaign: '',
    format: '',
    type: ''
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select onValueChange={(value) => handleFilterChange('format', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="Video">Video</SelectItem>
            <SelectItem value="Case Study">Case Study</SelectItem>
            <SelectItem value="Blog Post">Blog Post</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Social Media">Social Media</SelectItem>
            <SelectItem value="Webinar">Webinar</SelectItem>
            <SelectItem value="Ebook">Ebook</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="hero">Hero</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContentFilters;

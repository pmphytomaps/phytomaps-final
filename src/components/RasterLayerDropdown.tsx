import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { GolfCourseTileset } from "@/lib/tilesetService";

interface RasterLayerDropdownProps {
  tilesets: GolfCourseTileset[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export const RasterLayerDropdown: React.FC<RasterLayerDropdownProps> = ({
  tilesets,
  selectedIds,
  onSelectionChange,
  enabled,
  onToggleEnabled,
  opacity,
  onOpacityChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLayer = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const formatDateTime = (date: string | null, time: string | null) => {
      const dateStr = date || 'No date';
      const timeStr = time ? time.substring(0, 5) : '';
      return timeStr ? `${dateStr} ${timeStr}` : dateStr;
  };

  if (tilesets.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 right-14 z-10 w-72">
      {/* Collapsed Header */}
      <div 
        className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border transition-all duration-200 ${
          isExpanded ? 'rounded-b-none' : ''
        }`}
      >
        <div 
          className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MapPin className={`w-4 h-4 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className="text-sm font-medium">Live Maps</span>
          {selectedIds.length > 0 && enabled && (
            <Badge variant="default" className="text-xs bg-blue-600">
              {selectedIds.length}
            </Badge>
          )}
          <div className="flex-1" />
          <Button
            variant={enabled ? "default" : "outline"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onToggleEnabled(!enabled);
            }}
          >
            {enabled ? 'ON' : 'OFF'}
          </Button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t bg-white rounded-b-lg">
            {/* Layer Selection */}
            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
              {tilesets.map((tileset) => {
                const isSelected = selectedIds.includes(tileset.id);

                return (
                  <div
                    key={tileset.id}
                    className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleLayer(tileset.id)}
                      disabled={!enabled}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate" title={tileset.name || 'Map Layer'}>
                          {tileset.name || 'Map Layer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {formatDateTime(tileset.flight_date, tileset.flight_time)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            {enabled && selectedIds.length > 0 && (
              <div className="border-t px-4 py-3 space-y-3 bg-gray-50/50 rounded-b-lg">
                {/* Opacity Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-14">Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity * 100}
                    onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-gray-600 w-10 text-right">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RasterLayerDropdown;

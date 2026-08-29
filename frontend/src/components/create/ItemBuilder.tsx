import { useState } from 'react';
import { SurpriseItem } from '../../types';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Image, Video, Music, Link as LinkIcon, Type, Mail } from 'lucide-react';
import { uploadMedia } from '../../api/client';

interface ItemBuilderProps {
  items: SurpriseItem[];
  onChange: (items: SurpriseItem[]) => void;
}

// --- Sortable Item Component ---
function SortableItem({ item, index, onUpdate, onRemove }: { 
  item: SurpriseItem; 
  index: number;
  onUpdate: (id: number, updates: Partial<SurpriseItem>) => void;
  onRemove: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { media_url } = await uploadMedia(file);
      onUpdate(item.id!, { media_url, content: file.name });
    } catch (err) {
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="glass p-4 rounded-xl mb-4 relative group">
      <div className="flex gap-4">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="flex items-center justify-center cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 pt-2"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        {/* Content Area */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider bg-purple-500/20 px-2 py-1 rounded">
              {item.type}
            </span>
            <button 
              onClick={() => onRemove(item.id!)}
              className="text-white/20 hover:text-red-400 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {(item.type === 'text' || item.type === 'letter') && (
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 min-h-[100px] resize-y"
              placeholder={item.type === 'letter' ? "Write your letter here..." : "Type your message..."}
              value={item.content || ''}
              onChange={(e) => onUpdate(item.id!, { content: e.target.value })}
            />
          )}

          {(item.type === 'photo' || item.type === 'video' || item.type === 'audio') && (
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
              {item.media_url ? (
                <div className="space-y-2">
                  <p className="text-green-400 text-sm font-medium">Uploaded Successfully!</p>
                  <p className="text-white/50 text-xs truncate">{item.content}</p>
                  <button 
                    onClick={() => onUpdate(item.id!, { media_url: '', content: '' })}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <>
                  <label className="cursor-pointer flex flex-col items-center justify-center">
                    {isUploading ? (
                      <span className="text-white/60">Uploading...</span>
                    ) : (
                      <>
                        <span className="text-white/80 font-medium mb-1">Click to upload {item.type}</span>
                        <span className="text-white/40 text-xs">Max 10MB</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept={item.type === 'photo' ? 'image/*' : item.type === 'video' ? 'video/*' : 'audio/*'} 
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </>
                    )}
                  </label>
                </>
              )}
            </div>
          )}

          {item.type === 'link' && (
            <div className="space-y-3">
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                placeholder="Link Title (e.g. Our Playlist)"
                value={item.title || ''}
                onChange={(e) => onUpdate(item.id!, { title: e.target.value })}
              />
              <input
                type="url"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                placeholder="https://..."
                value={item.media_url || ''}
                onChange={(e) => onUpdate(item.id!, { media_url: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Builder Component ---
let idCounter = 1;

export default function ItemBuilder({ items, onChange }: ItemBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      // Re-assign display orders
      onChange(newItems.map((item, index) => ({ ...item, display_order: index })));
    }
  };

  const addItem = (type: SurpriseItem['type']) => {
    const newItem: SurpriseItem = {
      id: idCounter++,
      type,
      display_order: items.length,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: number, updates: Partial<SurpriseItem>) => {
    onChange(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    onChange(newItems.map((item, index) => ({ ...item, display_order: index })));
  };

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-white/60 mb-6">Build your surprise by adding items below!</p>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id!)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((item, index) => (
                <SortableItem 
                  key={item.id} 
                  item={item} 
                  index={index}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="glass p-4 rounded-xl">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-medium">Add to Surprise</p>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => addItem('text')} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <Type className="w-5 h-5 mb-1" />
            <span className="text-xs">Text</span>
          </button>
          <button type="button" onClick={() => addItem('letter')} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <Mail className="w-5 h-5 mb-1" />
            <span className="text-xs">Letter</span>
          </button>
          <button type="button" onClick={() => addItem('photo')} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <Image className="w-5 h-5 mb-1" />
            <span className="text-xs">Photo</span>
          </button>
          <button type="button" onClick={() => addItem('video')} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <Video className="w-5 h-5 mb-1" />
            <span className="text-xs">Video</span>
          </button>
          <button type="button" onClick={() => addItem('audio')} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <Music className="w-5 h-5 mb-1" />
            <span className="text-xs">Audio</span>
          </button>
          <button type="button" onClick={() => addItem('link')} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <LinkIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}

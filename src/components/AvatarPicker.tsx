import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { animalAvatars, getAnimalAvatar } from '../data/avatars';
import { playSelect, playSurveyComplete } from '../utils/sounds';

interface AvatarPickerProps {
  currentType: 'initials' | 'animal' | 'custom';
  currentAnimal?: string;
  currentImageUrl?: string;
  initials: string;
  onSave: (data: { type: 'initials' | 'animal' | 'custom'; animal?: string; imageUrl?: string }) => Promise<void>;
  onClose: () => void;
}

export function AvatarPicker({
  currentType,
  currentAnimal,
  currentImageUrl,
  initials,
  onSave,
  onClose,
}: AvatarPickerProps) {
  const [selectedType, setSelectedType] = useState<'initials' | 'animal' | 'custom'>(currentType);
  const [selectedAnimal, setSelectedAnimal] = useState<string | undefined>(currentAnimal);
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    setIsUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
      setSelectedType('custom');
      setIsUploading(false);
      playSelect();
    };
    reader.onerror = () => {
      alert('Failed to read image');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        type: selectedType,
        animal: selectedType === 'animal' ? selectedAnimal : undefined,
        imageUrl: selectedType === 'custom' ? imageUrl : undefined,
      });
      playSurveyComplete();
      onClose();
    } catch (error) {
      alert('Failed to save avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    if (selectedType === 'custom' && imageUrl) {
      return (
        <img
          src={imageUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      );
    }

    if (selectedType === 'animal' && selectedAnimal) {
      const animal = getAnimalAvatar(selectedAnimal);
      if (animal) {
        return (
          <div className={`w-full h-full bg-gradient-to-br ${animal.gradient} flex items-center justify-center text-5xl`}>
            {animal.emoji}
          </div>
        );
      }
    }

    // Default: initials
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
        {initials}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Choose Your Avatar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-6 flex justify-center">
          <motion.div
            key={`${selectedType}-${selectedAnimal}-${imageUrl}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-28 h-28 rounded-full overflow-hidden shadow-lg ring-4 ring-purple-100"
          >
            {renderPreview()}
          </motion.div>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-4">
          {/* Upload Photo */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-dashed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </span>
              )}
            </Button>
          </div>

          {/* Use Initials */}
          <Button
            variant={selectedType === 'initials' ? 'default' : 'outline'}
            className={`w-full h-14 rounded-2xl ${
              selectedType === 'initials'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : ''
            }`}
            onClick={() => {
              setSelectedType('initials');
              playSelect();
            }}
          >
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              Use My Initials
              {selectedType === 'initials' && <Check className="w-5 h-5 ml-auto" />}
            </span>
          </Button>

          {/* Animal Characters */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Or pick a cute character:</p>
            <div className="grid grid-cols-5 gap-2">
              {animalAvatars.map((animal) => (
                <motion.button
                  key={animal.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedType('animal');
                    setSelectedAnimal(animal.id);
                    playSelect();
                  }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${animal.gradient} flex items-center justify-center text-2xl shadow-md transition-all ${
                    selectedType === 'animal' && selectedAnimal === animal.id
                      ? 'ring-4 ring-purple-400 ring-offset-2'
                      : 'hover:shadow-lg'
                  }`}
                  title={animal.name}
                >
                  {animal.emoji}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Avatar'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

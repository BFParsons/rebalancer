import { getAnimalAvatar } from '../data/avatars';

interface AvatarProps {
  type?: 'initials' | 'animal' | 'custom';
  initials?: string;
  animal?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export function Avatar({
  type = 'initials',
  initials = '?',
  animal,
  imageUrl,
  size = 'md',
  className = '',
  onClick,
}: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const isClickable = !!onClick;

  const baseClasses = `rounded-full overflow-hidden flex items-center justify-center font-bold shadow-md ${sizeClass} ${className} ${
    isClickable ? 'cursor-pointer hover:ring-4 hover:ring-purple-200 transition-all' : ''
  }`;

  if (type === 'custom' && imageUrl) {
    return (
      <div className={baseClasses} onClick={onClick}>
        <img
          src={imageUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (type === 'animal' && animal) {
    const animalData = getAnimalAvatar(animal);
    if (animalData) {
      return (
        <div
          className={`${baseClasses} bg-gradient-to-br ${animalData.gradient}`}
          onClick={onClick}
        >
          {animalData.emoji}
        </div>
      );
    }
  }

  // Default: initials
  return (
    <div
      className={`${baseClasses} bg-gradient-to-br from-purple-500 to-pink-500 text-white`}
      onClick={onClick}
    >
      {initials}
    </div>
  );
}

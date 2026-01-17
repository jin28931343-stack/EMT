import React from 'react';
import { 
  Search, ChevronUp, ChevronDown, X, Plus, Minus, Download, 
  ArrowUp, Gavel, FileText, Shield, Stethoscope, AlertCircle, 
  Activity, Info, BookOpen, Users 
} from 'lucide-react';

const iconMap = {
  search: Search,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  x: X,
  plus: Plus,
  minus: Minus,
  download: Download,
  'arrow-up': ArrowUp,
  gavel: Gavel,
  'file-text': FileText,
  shield: Shield,
  stethoscope: Stethoscope,
  'alert-circle': AlertCircle,
  activity: Activity,
  info: Info,
  'book-open': BookOpen,
  users: Users
};

const Icon = ({ name, size = 24, className, ...props }) => {
  const LucideIcon = iconMap[name.toLowerCase()] || Activity;
  return <LucideIcon size={size} className={className} {...props} />;
};

export default Icon;
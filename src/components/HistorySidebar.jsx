import { useState, useEffect } from 'react';
import { Clock, X, Star, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { getWritingTypes } from '../utils/database';
import * as LucideIcons from 'lucide-react';

export default function HistorySidebar({ isOpen, onClose, onLoadHistory }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [writingTypes, setWritingTypes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      loadWritingTypes();
    }
  }, [isOpen]);

  const loadWritingTypes = async () => {
    try {
      const types = await getWritingTypes();
      setWritingTypes(types);
    } catch (error) {
      console.error('Error loading writing types:', error);
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('generation_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filterType !== 'all') {
        query = query.eq('writing_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      const { error } = await supabase
        .from('generation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const toggleFavorite = async (item) => {
    try {
      const { error } = await supabase
        .from('generation_history')
        .update({ is_favorite: !item.is_favorite })
        .eq('id', item.id);

      if (error) throw error;
      
      // Update local state
      setHistory(history.map(h => 
        h.id === item.id ? { ...h, is_favorite: !h.is_favorite } : h
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getTypeIcon = (writingType) => {
    const type = writingTypes.find(t => t.value === writingType);
    if (type && type.icon_name) {
      return LucideIcons[type.icon_name] || Clock;
    }
    return Clock;
  };

  const getTypeLabel = (writingType) => {
    const type = writingTypes.find(t => t.value === writingType);
    return type ? type.label : writingType;
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchQuery || 
      (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.role_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <h2 className="text-2xl font-bold">History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                loadHistory();
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {writingTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                <Clock className="w-12 h-12 mb-2 opacity-50" />
                <p>No history yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredHistory.map((item) => {
                  const TypeIcon = getTypeIcon(item.writing_type);
                  return (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => onLoadHistory(item)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TypeIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-slate-800 truncate">
                              {item.title || item.company_name || 'Untitled'}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(item);
                                }}
                                className="p-1 hover:bg-slate-200 rounded transition-colors"
                              >
                                <Star 
                                  className={`w-4 h-4 ${
                                    item.is_favorite 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-slate-400'
                                  }`}
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Delete this history item?')) {
                                    deleteHistoryItem(item.id);
                                  }
                                }}
                                className="p-1 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-1">
                            {getTypeLabel(item.writing_type)}
                            {item.company_name && ` • ${item.company_name}`}
                          </p>
                          
                          {item.role_name && (
                            <p className="text-sm text-slate-500 truncate">
                              {item.role_name}
                            </p>
                          )}
                          
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

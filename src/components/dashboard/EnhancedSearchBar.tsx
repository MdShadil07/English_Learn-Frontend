import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, BookOpen, X, LoaderCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { api } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface UserSearchResult {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  level?: number;
  role?: 'student' | 'teacher' | 'admin';
  subscriptionStatus?: string;
}

interface SearchResult {
  type: 'user' | 'lesson' | 'note' | 'word';
  id: string;
  title: string;
  description?: string;
  data: UserSearchResult | Record<string, unknown>;
}

export const EnhancedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`🔍 Searching for: "${query}"`);
      
      // Search for users via backend API (MongoDB)
      const userResults = await api.user.search(query);
      
      console.log('📦 API Response:', userResults);
      
      const transformedResults: SearchResult[] = [];

      // Transform user results - handle both response wrapped in 'data' and direct array
      let usersArray: UserSearchResult[] = [];
      
      if (Array.isArray(userResults)) {
        usersArray = userResults;
      } else if ((userResults as any)?.data && Array.isArray((userResults as any).data)) {
        usersArray = (userResults as any).data;
      } else if ((userResults as any)?.success && Array.isArray(userResults)) {
        usersArray = userResults as unknown as UserSearchResult[];
      }

      if (usersArray.length === 0) {
        console.log(`ℹ️  No results found for "${query}"`);
      }

      usersArray.forEach((user) => {
        transformedResults.push({
          type: 'user',
          id: user.id,
          title: user.fullName || user.email,
          description: `${user.role || 'student'} • Level ${user.level || 1}`,
          data: user,
        });
      });

      setResults(transformedResults);
      console.log(`✅ Found ${transformedResults.length} results`);
    } catch (err) {
      console.error('❌ Search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error searching users';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'user') {
      const user = result.data as UserSearchResult;
      navigate(`/user-profile/${user.id}`, { state: { profile: user } });
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        setResults([]);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users, lessons, words, notes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 h-10 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 focus:bg-background focus:border-emerald-300"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setError(null);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 left-0 right-0 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {isLoading && (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-600 dark:text-slate-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 m-2 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {!isLoading && results.length === 0 && !error && (
              <div className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
                No results found for "{query}"
              </div>
            )}

            {!isLoading &&
              results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelectResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-emerald-50 dark:bg-emerald-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {result.type === 'user' && (
                    <>
                      <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white dark:ring-slate-900">
                        <AvatarImage src={(result.data as UserSearchResult).avatar} />
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                          {getInitials((result.data as UserSearchResult).fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {result.description}
                        </p>
                      </div>
                      <Users className="h-4 w-4 text-emerald-500 shrink-0" />
                    </>
                  )}

                  {result.type !== 'user' && (
                    <>
                      <BookOpen className="h-5 w-5 text-blue-500 shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {result.title}
                        </p>
                      </div>
                    </>
                  )}
                </button>
              ))}

            {/* Search Tips */}
            {!isLoading && results.length === 0 && query && (
              <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <p className="font-medium mb-1">Search Tips:</p>
                <ul className="space-y-1">
                  <li>• Search by username, email, or full name</li>
                  <li>• Use arrow keys to navigate</li>
                  <li>• Press Enter to select</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

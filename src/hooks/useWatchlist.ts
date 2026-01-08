import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_STORAGE_KEY = 'bioquill_molecule_watchlist';

export interface WatchlistItem {
  moleculeId: string;
  addedAt: string;
  notes?: string;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  const saveWatchlist = useCallback((items: WatchlistItem[]) => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
      setWatchlist(items);
    } catch (error) {
      console.error('Failed to save watchlist:', error);
    }
  }, []);

  const addToWatchlist = useCallback((moleculeId: string, notes?: string) => {
    const existing = watchlist.find(item => item.moleculeId === moleculeId);
    if (existing) return false;
    
    const newItem: WatchlistItem = {
      moleculeId,
      addedAt: new Date().toISOString(),
      notes
    };
    saveWatchlist([...watchlist, newItem]);
    return true;
  }, [watchlist, saveWatchlist]);

  const removeFromWatchlist = useCallback((moleculeId: string) => {
    saveWatchlist(watchlist.filter(item => item.moleculeId !== moleculeId));
  }, [watchlist, saveWatchlist]);

  const isInWatchlist = useCallback((moleculeId: string) => {
    return watchlist.some(item => item.moleculeId === moleculeId);
  }, [watchlist]);

  const updateNotes = useCallback((moleculeId: string, notes: string) => {
    saveWatchlist(
      watchlist.map(item => 
        item.moleculeId === moleculeId ? { ...item, notes } : item
      )
    );
  }, [watchlist, saveWatchlist]);

  const clearWatchlist = useCallback(() => {
    saveWatchlist([]);
  }, [saveWatchlist]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    updateNotes,
    clearWatchlist
  };
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BookmarkItem } from '../types';

const STORAGE_KEY = 'course2_bookmarks';

const loadBookmarks = (): BookmarkItem[] => {
  try {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (!persisted) return [];
    return JSON.parse(persisted) as BookmarkItem[];
  } catch (error) {
    console.warn('Failed to load bookmarks', error);
    return [];
  }
};

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => loadBookmarks());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((bookmark) => bookmark.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (item: BookmarkItem) => {
      setBookmarks((prev) => {
        if (prev.some((bookmark) => bookmark.id === item.id)) {
          return prev.filter((bookmark) => bookmark.id !== item.id);
        }
        return [...prev, item];
      });
    },
    []
  );

  const groupedBookmarks = useMemo(() => {
    return bookmarks.reduce<Record<string, BookmarkItem[]>>((acc, bookmark) => {
      const key = `${bookmark.branchSlug.toUpperCase()} • Sem ${bookmark.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(bookmark);
      return acc;
    }, {});
  }, [bookmarks]);

  return {
    bookmarks,
    groupedBookmarks,
    isBookmarked,
    toggleBookmark
  };
};

export type UseBookmarksReturn = ReturnType<typeof useBookmarks>;


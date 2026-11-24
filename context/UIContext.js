import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export const UIContext = createContext({
  progress: 0,
  setProgress: () => {},
  sidebar: { current: null },
  ref: { current: null },
  changeHamburgerIcon: true,
  setChangeHamburgerIcon: () => {},
  importCartDynamically: false,
  setImportCartDynamically: () => {},
  toggleCart: () => {},
  toggleSidebar: () => {},
  toggleCartForNavIcons: () => {},
  toggleSidebarForNavIcons: () => {},
});

export function UIProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [changeHamburgerIcon, setChangeHamburgerIcon] = useState(true);
  const [importCartDynamically, setImportCartDynamically] = useState(false);
  const sidebar = useRef(null);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setProgress(40);
    const handleComplete = () => setProgress(100);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
    };
  }, [router.events]);

  const toggleCart = useCallback(() => {
    if (!ref.current) return;
    if (ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-full');
      ref.current.classList.add('translate-x-0');
    } else {
      ref.current.classList.remove('translate-x-0');
      ref.current.classList.add('translate-x-full');
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    if (!sidebar.current) return;
    if (sidebar.current.classList.contains('-translate-x-full')) {
      sidebar.current.classList.remove('-translate-x-full');
      sidebar.current.classList.add('translate-x-0');
    } else {
      sidebar.current.classList.remove('translate-x-0');
      sidebar.current.classList.add('-translate-x-full');
    }
  }, []);

  const toggleCartForNavIcons = useCallback(() => {
    if (ref.current && ref.current.classList.contains('translate-x-0')) {
      ref.current.classList.remove('translate-x-0');
      ref.current.classList.add('translate-x-full');
    }
  }, []);

  const toggleSidebarForNavIcons = useCallback(() => {
    if (sidebar.current && sidebar.current.classList.contains('translate-x-0')) {
      sidebar.current.classList.remove('translate-x-0');
      sidebar.current.classList.add('-translate-x-full');
    }
  }, []);

  return (
    <UIContext.Provider
      value={{
        progress,
        setProgress,
        sidebar,
        ref,
        changeHamburgerIcon,
        setChangeHamburgerIcon,
        importCartDynamically,
        setImportCartDynamically,
        toggleCart,
        toggleSidebar,
        toggleCartForNavIcons,
        toggleSidebarForNavIcons,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}

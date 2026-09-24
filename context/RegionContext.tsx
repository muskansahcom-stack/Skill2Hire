'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Country, Region, RegionalProfile } from '@/lib/types';
import { REGIONAL_DICTIONARIES } from '@/lib/regionalIntelligence';

export type SupportedLanguage = 'en' | 'hi' | 'bho' | 'ta' | 'te' | 'mr';

interface RegionContextType {
  selectedRegion: string; // 'global' | 'in-bihar' | 'in-tamilnadu' | 'in-telangana' | 'in-maharashtra' | 'kr-seoul' | etc.
  selectedDistrict: string | null;
  selectedLanguage: SupportedLanguage;
  setRegion: (regionId: string) => void;
  setDistrict: (districtId: string | null) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  countries: Country[];
  regions: Region[];
  currentProfile: RegionalProfile | null;
  isBiharActive: boolean;
  t: (key: string) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [selectedRegion, setSelectedRegionState] = useState<string>('in-bihar');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>('in-br-patna');
  const [selectedLanguage, setSelectedLanguageState] = useState<SupportedLanguage>('en');
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [currentProfile, setCurrentProfile] = useState<RegionalProfile | null>(null);

  // Hydrate initial preferences from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRegion = localStorage.getItem('skill2hire_region');
      const savedDistrict = localStorage.getItem('skill2hire_district');
      const savedLang = localStorage.getItem('skill2hire_lang') as SupportedLanguage;
      
      if (savedRegion) setSelectedRegionState(savedRegion);
      if (savedDistrict !== null) setSelectedDistrict(savedDistrict);
      if (savedLang && ['en', 'hi', 'bho', 'ta', 'te', 'mr'].includes(savedLang)) {
        setSelectedLanguageState(savedLang);
      }
    }
  }, []);

  // Fetch countries & regions
  useEffect(() => {
    async function loadRegions() {
      try {
        const res = await fetch('/api/regional/regions');
        if (res.ok) {
          const data = await res.json();
          if (data.countries) setCountries(data.countries);
          if (data.regions) setRegions(data.regions);
          if (data.profiles && data.profiles.length > 0) {
            const profile = data.profiles.find((p: any) => p.regionId === selectedRegion) || data.profiles[0];
            setCurrentProfile(profile);
          }
        }
      } catch (err) {
        console.error('Failed to load regions metadata:', err);
      }
    }
    loadRegions();
  }, [selectedRegion]);

  const setRegion = (regionId: string) => {
    setSelectedRegionState(regionId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skill2hire_region', regionId);
    }
    
    // Set default district and recommended language per region
    if (regionId === 'in-bihar') {
      setSelectedDistrict('in-br-patna');
    } else if (regionId === 'in-tamilnadu') {
      setSelectedDistrict('in-tn-chennai');
      setLanguage('ta');
    } else if (regionId === 'in-telangana') {
      setSelectedDistrict('in-ts-hyderabad');
      setLanguage('te');
    } else if (regionId === 'in-maharashtra') {
      setSelectedDistrict('in-mh-pune');
      setLanguage('mr');
    } else if (regionId === 'in-karnataka') {
      setSelectedDistrict('in-ka-bengaluru');
    } else {
      setSelectedDistrict(null);
    }
  };

  const setDistrict = (districtId: string | null) => {
    setSelectedDistrict(districtId);
    if (typeof window !== 'undefined') {
      if (districtId) localStorage.setItem('skill2hire_district', districtId);
      else localStorage.removeItem('skill2hire_district');
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skill2hire_lang', lang);
    }
  };

  const t = (key: string): string => {
    const dict = REGIONAL_DICTIONARIES[selectedLanguage] || REGIONAL_DICTIONARIES.en;
    return dict[key] || REGIONAL_DICTIONARIES.en[key] || key;
  };

  const isBiharActive = selectedRegion === 'in-bihar';

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        selectedDistrict,
        selectedLanguage,
        setRegion,
        setDistrict,
        setLanguage,
        countries,
        regions,
        currentProfile,
        isBiharActive,
        t
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}

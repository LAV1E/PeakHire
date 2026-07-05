"use client";

import { useState, useCallback } from "react";

export function useJobFilters() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    employmentType: undefined,
    experienceLevel: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    page: 1,
    limit: 12,
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      location: "",
      employmentType: undefined,
      experienceLevel: undefined,
      minSalary: undefined,
      maxSalary: undefined,
      page: 1,
      limit: 12,
    });
  }, []);

  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const activeFilterCount = [
    filters.search,
    filters.location,
    filters.employmentType,
    filters.experienceLevel,
    filters.minSalary,
    filters.maxSalary,
  ].filter(Boolean).length;

  return { filters, updateFilter, resetFilters, setPage, activeFilterCount };
}

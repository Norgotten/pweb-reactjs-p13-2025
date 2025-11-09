// src/components/FilterSidebar.tsx
import React from 'react';

const FilterSidebar: React.FC = () => {
  return (
    <aside className="w-full lg:w-1/4">
      <h3 className="text-2xl font-semibold border-b border-border-color pb-4">
        Filter
      </h3>
      
      {/* Grup Filter */}
      <div className="border-b border-border-color py-6">
        <div className="flex justify-between items-center cursor-pointer">
          <h4 className="text-lg font-medium">Categories</h4>
          <span className="text-light-text text-sm">▼</span>
        </div>
        <div className="mt-4 flex flex-col gap-y-3">
          <label className="flex items-center gap-x-2 text-light-text cursor-pointer">
            <input type="radio" name="category" defaultChecked /> All Genres
          </label>
          <label className="flex items-center gap-x-2 text-light-text cursor-pointer">
            <input type="radio" name="category" /> Biography & Memory
          </label>
          <label className="flex items-center gap-x-2 text-light-text cursor-pointer">
            <input type="radio" name="category" /> Children's Book
          </label>
          {/* ... tambahkan kategori lain ... */}
        </div>
      </div>
      
      {/* Grup Filter Lain */}
      <div className="border-b border-border-color py-6">
        <div className="flex justify-between items-center cursor-pointer">
          <h4 className="text-lg font-medium">Book Format</h4>
          <span className="text-light-text text-sm">▼</span>
        </div>
        <div className="mt-4 flex flex-col gap-y-3">
          <label className="flex items-center gap-x-2 text-light-text cursor-pointer">
            <input type="radio" name="format" defaultChecked /> All Format
          </label>
          <label className="flex items-center gap-x-2 text-light-text cursor-pointer">
            <input type="radio" name="format" /> Hard Cover
          </label>
          <label className="flex items-center gap-x-2 text-light-text cursor-pointer">
            <input type="radio" name="format" /> Paper Back
          </label>
        </div>
      </div>
      
      {/* Tombol */}
      <div className="mt-8 flex flex-col gap-y-2">
        <button className="w-full bg-brand-color text-white font-semibold py-3 rounded-md hover:opacity-90 transition-opacity">
          Apply Filter
        </button>
        <button className="w-full bg-transparent border border-border-color text-light-text font-semibold py-3 rounded-md hover:bg-gray-50">
          Reset Filter
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
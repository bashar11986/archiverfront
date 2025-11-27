import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SearchableSelect({
    label,
    options,
    getLabel,
    getValue,
    selected,
    setSelected    
  }: any) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
  
    const filtered = options.filter((o: any) =>
      getLabel(o).toLowerCase().includes(query.toLowerCase())
    );
  const tcommon = useTranslations('common');
    return (
      <div className="mb-4 relative">
        <label className="text-sm font-medium">{label}</label>
  
        <div
          className="border rounded p-2 mt-1 cursor-pointer bg-white"
          onClick={() => setOpen(!open)}
        >
          {selected ? (
            <span>{getLabel(options.find((o: any) => getValue(o) === selected)!)}</span>
          ) : (
            <span className="text-gray-400">{tcommon("select")}</span>
          )}
        </div>
  
        {open && (
          <div className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-auto">
            <input
              type="text"
              className="w-full p-2 border-b text-sm"
              placeholder={tcommon("searching")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
  
            {filtered.length === 0 ? (
              <div className="p-2 text-sm text-gray-400">{tcommon("noResults")}</div>
            ) : (
              filtered.map((o: any, i: number) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelected(getValue(o));
                    setOpen(false);
                  }}
                  className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {getLabel(o)}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
  
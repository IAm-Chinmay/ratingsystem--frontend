import { useState } from "react";
import { clsx } from "clsx";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function SortableTable({ columns, data, onRowClick }) {
  const [sortField, setSortField] = useState("");
  const [ascending, setAscending] = useState(true);

  const handleSort = (field) => {
    if (field === sortField) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField]?.toString().toLowerCase();
    const valB = b[sortField]?.toString().toLowerCase();
    return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <table className="w-full border bg-white rounded shadow-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="p-3 cursor-pointer select-none"
              onClick={() => handleSort(col.key)}
            >
              {col.label}{" "}
              {sortField === col.key &&
                (ascending ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map(
          (row, i) => (
            console.log(row),
            (
              <tr
                key={i}
                className={clsx(
                  "border-t hover:bg-blue-50 transition cursor-pointer",
                  onRowClick && "hover:font-medium"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            )
          )
        )}
      </tbody>
    </table>
  );
}

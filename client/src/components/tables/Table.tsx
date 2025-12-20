"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableProps {
  title: string;
  data: Record<string, any>[];
  actionButtonLabel?: string;
  actionButtonIcon?: ReactNode;
  onActionClick?: () => void;
}

export default function Table({
  title,
  data,
  actionButtonLabel,
  actionButtonIcon,
  onActionClick,
}: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full border bg-neutral-900">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg ">{title}</h2>
          {(actionButtonLabel || actionButtonIcon) && onActionClick && (
            <Button
              onClick={onActionClick}
              variant="outline"
              size={actionButtonLabel ? "default" : "icon"}
              className="rounded-none"
            >
              {actionButtonIcon}
              {actionButtonLabel}
            </Button>
          )}
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const formatHeader = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capitals
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Format cell value for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="w-full border bg-neutral-900">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {(actionButtonLabel || actionButtonIcon) && onActionClick && (
          <Button
            onClick={onActionClick}
            variant="outline"
            size={actionButtonLabel ? "default" : "icon"}
            className="rounded-none"
          >
            {actionButtonIcon}
            {actionButtonLabel}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={String(column)}
                  className="text-left p-4 font-semibold text-sm text-muted-foreground"
                >
                  {formatHeader(String(column))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b last:border-b-0",
                  rowIndex % 2 === 0 && "bg-background/30",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${String(column)}`}
                    className="p-4 text-sm"
                  >
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

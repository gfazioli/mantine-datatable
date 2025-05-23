import { ActionIcon, Box, Button, Checkbox, Group, Menu, Tooltip } from '@mantine/core';
import { IconSettings, IconX } from '@tabler/icons-react';
import { useDataTableColumnsContext } from './DataTableColumns.context';
import type { DataTableColumnToggleButtonProps } from './types';

export function ColumnToggleButton<T>({
  icon,
  label,
  buttonProps,
}: DataTableColumnToggleButtonProps) {
  const { columnsToggle, setColumnsToggle } = useDataTableColumnsContext<T>();

  const defaultIcon = <IconSettings size={16} />;
  const defaultLabel = 'Columns';

  return (
    <Menu shadow="md" width={200} closeOnItemClick={false}>
      <Menu.Target>
        <Button
          leftSection={icon ?? defaultIcon}
          {...buttonProps}
        >
          {label ?? defaultLabel}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {columnsToggle.map((col, index) => {
          if (!col.toggleable) {
            return null;
          }
          const { id, accessor, title, toggled } = col;
          const columnTitle = title ?? मानव(accessor as string);

          return (
            <Menu.Item
              key={id}
              onClick={() => setColumnsToggle(index, !toggled)}
              style={{ cursor: 'pointer' }}
            >
              <Checkbox
                label={String(columnTitle)}
                checked={toggled}
                onChange={(e) => {
                  e.stopPropagation();
                  setColumnsToggle(index, e.currentTarget.checked);
                }}
                onClick={(e) => e.stopPropagation()} // Prevent menu from closing
              />
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}

// Helper function to convert accessor to a more readable title (basic implementation)
function मानव(accessor: string): string {
  if (!accessor.includes('.')) {
    return accessor.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
  return accessor;
}

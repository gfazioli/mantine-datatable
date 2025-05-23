'use client';

import { Text } from '@mantine/core';
import { IconColumns, IconColumns3, IconSettings } from '@tabler/icons-react';
import { DataTable, useDataTableColumns, type DataTableSortStatus } from '__PACKAGE__';
import sortBy from 'lodash/sortBy';
import { useContextMenu } from 'mantine-contextmenu';
import { useEffect, useState } from 'react';
import { companies, type Company } from '~/data';

export default function DraggingTogglingComplexExample() {
  const { showContextMenu } = useContextMenu();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Company>>({
    columnAccessor: 'name',
    direction: 'asc',
  });

  const [records, setRecords] = useState(sortBy(companies, 'name'));

  useEffect(() => {
    const data = sortBy(companies, sortStatus.columnAccessor) as Company[];
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus]);

  const key = 'draggable-toggleable-resizable-complex-example';

  // This example combines draggable, toggleable, and resizable columns
  // with persistence in localStorage via useDataTableColumns.
  const { effectiveColumns, resetColumnsOrder } = useDataTableColumns({
    key,
    columns: [
      {
        accessor: 'name',
        width: '40%',
        toggleable: true, // Can be hidden via ColumnToggleButton
        draggable: true, // Can be dragged to reorder
        sortable: true,
        resizable: true, // Can be resized
        minResizableWidth: 100, // Minimum width when resizing
      },
      {
        accessor: 'streetAddress',
        width: '60%',
        toggleable: true,
        draggable: true,
        resizable: true,
        minResizableWidth: 150,
      },
      {
        accessor: 'city',
        width: 160,
        toggleable: true,
        draggable: true,
        resizable: true,
        minResizableWidth: 80,
      },
      {
        accessor: 'state',
        textAlign: 'right',
        // This column is not toggleable, draggable, or resizable by default.
      },
    ],
  });

  return (
    <>
      <Text mb="md">
        This example demonstrates draggable, toggleable, and resizable columns with state persistence.
        <ul>
          <li>
            <strong>Toggle Columns:</strong> Use the &quot;Manage Columns&quot; button (customized with `columnToggleButtonProps`)
            in the top-right to show or hide columns.
          </li>
          <li>
            <strong>Drag Columns:</strong> Drag column headers to reorder them.
            Notice the blue border appearing on the left of the target column, indicating the drop position.
          </li>
          <li>
            <strong>Resize Columns:</strong> Drag the handles on the right side of column headers to resize them.
            Columns also have a `minResizableWidth` to prevent them from becoming too small.
          </li>
          <li>
            <strong>Right-click a row:</strong> to open a context menu with an option to reset column order.
          </li>
        </ul>
      </Text>
      <DataTable
        withTableBorder
        withColumnBorders
        storeColumnsKey={key} // Necessary for column state persistence
        records={records}
        columns={effectiveColumns}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        // Customizing the ColumnToggleButton
        columnToggleButtonProps={{
          icon: <IconColumns size={16} />, // Custom icon
          label: 'Manage Columns', // Custom label
          buttonProps: { variant: 'light', color: 'blue' }, // Custom Mantine Button props
        }}
        onRowContextMenu={({ event }) =>
          showContextMenu([
            // The "resetColumnsToggle" is removed as ColumnToggleButton now handles this.
            // Users can reset toggle state by re-selecting columns in the menu.
            {
              key: 'reset-columns-order',
              icon: <IconColumns3 size={16} />,
              onClick: resetColumnsOrder, // Resets column order to default
            },
          ])(event)
        }
      />
    </>
  );
}

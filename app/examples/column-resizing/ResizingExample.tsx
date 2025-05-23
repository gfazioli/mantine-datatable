'use client';

import { Button, Group, Stack, Switch, Text } from '@mantine/core';
import { DataTable, useDataTableColumns } from '__PACKAGE__';
import { useState } from 'react';
import { companies, type Company } from '~/data';

export default function ResizingExample() {
  const key = 'resize-example';

  const [withTableBorder, setWithTableBorder] = useState<boolean>(true);
  const [withColumnBorders, setWithColumnBorders] = useState<boolean>(true);

  const { effectiveColumns, resetColumnsWidth } = useDataTableColumns<Company>({
    key,
    columns: [
      // This column is resizable and has a minimum width of 80 pixels.
      { accessor: 'name', width: 100, resizable: true, minResizableWidth: 80 },
      // This column is resizable and has a minimum width of 120 pixels.
      // Its initial width will be determined by the available space.
      { accessor: 'streetAddress', resizable: true, minResizableWidth: 120 },
      // This column is resizable, has ellipsis, and a minimum width of 100 pixels.
      { accessor: 'city', ellipsis: true, resizable: true, minResizableWidth: 100 },
      // This column is not resizable.
      { accessor: 'state', textAlign: 'right' },
    ],
  });

  return (
    <Stack>
      <Text>
        Resizable columns can now have a `minResizableWidth` property (in pixels).
        Try resizing the &quot;Name&quot;, &quot;Street Address&quot;, or &quot;City&quot; columns below their specified minimum widths.
      </Text>
      <DataTable
        withTableBorder={withTableBorder}
        withColumnBorders={withColumnBorders}
        storeColumnsKey={key}
        records={companies}
        columns={effectiveColumns}
      />
      <Group grow justify="space-between">
        <Group justify="flex-start">
          <Switch
            checked={withTableBorder}
            onChange={(event) => setWithTableBorder(event.currentTarget.checked)}
            labelPosition="left"
            label="Table Border"
          />
          <Switch
            checked={withColumnBorders}
            onChange={(event) => setWithColumnBorders(event.currentTarget.checked)}
            labelPosition="left"
            label="Column Borders"
          />
        </Group>
        <Group justify="right">
          <Button onClick={resetColumnsWidth}>Reset Column Width</Button>
        </Group>
      </Group>
    </Stack>
  );
}

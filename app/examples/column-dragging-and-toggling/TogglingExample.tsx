'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconBuildingCommunity, IconBuildingSkyscraper, IconColumns, IconMap, IconRoadSign } from '@tabler/icons-react';
import { DataTable, useDataTableColumns } from '__PACKAGE__';
import { companies } from '~/data';

export default function TogglingExample() {
  const key = 'toggleable-example';

  // This example uses useDataTableColumns to persist the column toggle state in localStorage
  // and share it between multiple DataTable instances
  const { effectiveColumns } = useDataTableColumns({
    key,
    columns: [
      {
        accessor: 'name',
        title: (
          <Group gap={4} mt={-1}>
            <IconBuildingSkyscraper size={16} />
            <Text inherit mt={1}>
              Company
            </Text>
          </Group>
        ),
        width: '40%',
        toggleable: true, // This column can be toggled
        defaultToggle: false, // This column will be hidden by default
      },
      {
        accessor: 'streetAddress',
        title: (
          <Group gap={4} mt={-1}>
            <IconRoadSign size={16} />
            <Text inherit mt={1}>
              Street Address
            </Text>
          </Group>
        ),
        width: '60%',
        toggleable: true, // This column can be toggled
      },
      {
        accessor: 'city',
        title: (
          <Group gap={4} mt={-1}>
            <IconBuildingCommunity size={16} />
            <Text inherit mt={1}>
              City
            </Text>
          </Group>
        ),
        width: 160,
        toggleable: true, // This column can be toggled
      },
      {
        accessor: 'state',
        textAlign: 'right',
        title: (
          <Group justify="right">
            <IconMap size={16} />
            {/* This column is not toggleable by default as `toggleable` is not set */}
          </Group>
        ),
      },
    ],
  });

  return (
    <Stack>
      <Text>
        The DataTable now features a dedicated `ColumnToggleButton` (by default in the top-right corner)
        to control column visibility.
        You can customize its appearance and behavior using the `columnToggleButtonProps` property.
      </Text>
      <DataTable
        withTableBorder
        withColumnBorders
        storeColumnsKey={key} // Ensures column state is persisted
        records={companies}
        columns={effectiveColumns}
        // columnToggleButtonProps can be used to customize the button
        // Here's an example of changing its icon and label:
        columnToggleButtonProps={{
          // `icon` is a ReactNode, defaults to <IconSettings />
          icon: <IconColumns size={16} />,
          // `label` is a ReactNode, defaults to "Columns"
          label: 'Manage Columns',
          // `buttonProps` are Mantine Button component props
          buttonProps: { variant: 'outline' },
        }}
      />
      {/* The old "Reset toggled columns" button is removed as the ColumnToggleButton handles this functionality. */}
    </Stack>
  );
}

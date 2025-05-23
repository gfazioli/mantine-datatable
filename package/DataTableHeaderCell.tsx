import { ActionIcon, Box, Center, Flex, Group, TableTh, type MantineStyleProp, type MantineTheme, useMantineTheme } from '@mantine/core';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useDataTableColumnsContext } from './DataTableColumns.context';
import { DataTableHeaderCellFilter } from './DataTableHeaderCellFilter';
import { DataTableResizableHeaderHandle } from './DataTableResizableHeaderHandle';
import { useMediaQueryStringOrFunction } from './hooks';
import { IconArrowUp } from './icons/IconArrowUp';
import { IconArrowsVertical } from './icons/IconArrowsVertical';
import { IconGripVertical } from './icons/IconGripVertical';
// IconX is no longer used
import type { DataTableColumn, DataTableSortProps } from './types';
import { ELLIPSIS, NOWRAP, TEXT_ALIGN_CENTER, TEXT_ALIGN_LEFT, TEXT_ALIGN_RIGHT } from './utilityClasses';
import { humanize } from './utils';

type DataTableHeaderCellProps<T> = {
  className: string | undefined;
  style: MantineStyleProp | undefined;
  visibleMediaQuery: string | ((theme: MantineTheme) => string) | undefined;
  title: React.ReactNode | undefined;
  sortStatus: DataTableSortProps<T>['sortStatus'];
  sortIcons: DataTableSortProps<T>['sortIcons'];
  onSortStatusChange: DataTableSortProps<T>['onSortStatusChange'];
} & Pick<
  DataTableColumn<T>,
  | 'accessor'
  | 'sortable'
  | 'draggable'
  | 'toggleable'
  | 'resizable'
  | 'textAlign'
  | 'width'
  | 'filter'
  | 'filterPopoverProps'
  | 'filtering'
  | 'sortKey'
  | 'minResizableWidth' // Add minResizableWidth here
>;

export function DataTableHeaderCell<T>({
  className,
  style,
  accessor,
  visibleMediaQuery,
  title,
  sortable,
  draggable,
  toggleable,
  resizable,
  sortIcons,
  textAlign,
  width,
  sortStatus,
  onSortStatusChange,
  filter,
  filterPopoverProps,
  filtering,
  sortKey,
  minResizableWidth, // Destructure minResizableWidth
}: DataTableHeaderCellProps<T>) {
  const { setSourceColumn, setTargetColumn, swapColumns } = useDataTableColumnsContext();
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [dropIndicatorSide, setDropIndicatorSide] = useState<'left' | 'right' | null>(null);
  const columnRef = useRef<HTMLTableCellElement | null>(null);
  const theme = useMantineTheme();

  if (!useMediaQueryStringOrFunction(visibleMediaQuery)) return null;
  const text = title ?? humanize(accessor as string);
  const tooltip = typeof text === 'string' ? text : undefined;

  const sortAction =
    sortable && onSortStatusChange
      ? (e?: React.BaseSyntheticEvent) => {
          if (e?.defaultPrevented) return;

          onSortStatusChange({
            sortKey,
            columnAccessor: accessor,
            direction:
              sortStatus?.columnAccessor === accessor
                ? sortStatus.direction === 'asc'
                  ? 'desc'
                  : 'asc'
                : (sortStatus?.direction ?? 'asc'),
          });
        }
      : undefined;

  const handleColumnDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setSourceColumn(accessor as string);
    setDragOver(false);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggable) return;
    setTargetColumn(accessor as string);
    setDragOver(true);
    // For simplicity, always show indicator on the left for now
    // Later, this could be refined if columnsOrder becomes accessible
    setDropIndicatorSide('left');
  };

  const handleColumnDrop = () => {
    if (!draggable) return;
    setTargetColumn(accessor as string); // Ensure target is set on drop
    setDragOver(false);
    setDropIndicatorSide(null);
    swapColumns();
  };

  const handleColumnDragEnter = (e: React.DragEvent) => {
    if (!draggable) return;
    // Only set target if it's a valid drop target (another column header)
    // This check might be too restrictive if dragging over other elements is needed for some reason
    if ((e.target as HTMLElement).closest?.('.mantine-datatable-header-cell-draggable')) {
      setTargetColumn(accessor as string);
      setDragOver(true);
      setDropIndicatorSide('left');
    }
  };

  const handleColumnDragLeave = ()_ => {
    if (!draggable) return;
    setDragOver(false);
    setDropIndicatorSide(null);
  };

  // handleColumnToggle is no longer used

  return (
    <TableTh
      className={clsx(
        {
          'mantine-datatable-header-cell-sortable': sortable,
          // 'mantine-datatable-header-cell-toggleable': toggleable, // Removed toggleable class
          'mantine-datatable-header-cell-resizable': resizable,
        },
        className
      )}
      style={[
        {
          width,
          ...(!resizable ? { minWidth: width, maxWidth: width } : { minWidth: '1px' }),
          borderLeft: dropIndicatorSide === 'left' ? `2px solid ${theme.colors.blue[theme.fn.primaryShade()]}` : undefined,
          borderRight: dropIndicatorSide === 'right' ? `2px solid ${theme.colors.blue[theme.fn.primaryShade()]}` : undefined,
        },
        style,
      ]}
      role={sortable ? 'button' : undefined}
      tabIndex={sortable ? 0 : undefined}
      onClick={sortAction}
      onKeyDown={(e) => e.key === 'Enter' && sortAction?.()}
      ref={columnRef}
    >
      <Group className="mantine-datatable-header-cell-sortable-group" justify="space-between" wrap="nowrap">
        <Flex
          align="center"
          w="100%"
          className={clsx({
            'mantine-datatable-header-cell-draggable': draggable,
            'mantine-datatable-header-cell-drag-over': dragOver,
          })}
          draggable={draggable}
          onDragStart={draggable ? handleColumnDragStart : undefined}
          onDragEnter={draggable ? handleColumnDragEnter : undefined}
          onDragOver={draggable ? handleColumnDragOver : undefined}
          onDrop={draggable ? handleColumnDrop : undefined}
          onDragLeave={draggable ? handleColumnDragLeave : undefined}
        >
          {draggable ? (
            <Center role="img" aria-label="Drag column">
              <ActionIcon
                className="mantine-datatable-header-cell-draggable-action-icon"
                variant="subtle"
                size="xs"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                }}
              >
                <IconGripVertical />
              </ActionIcon>
            </Center>
          ) : null}
          <Box
            className={clsx(
              'mantine-datatable-header-cell-sortable-text',
              {
                [TEXT_ALIGN_LEFT]: textAlign === 'left',
                [TEXT_ALIGN_CENTER]: textAlign === 'center',
                [TEXT_ALIGN_RIGHT]: textAlign === 'right',
              },
              NOWRAP,
              ELLIPSIS
            )}
            title={tooltip}
          >
            {text}
          </Box>
        </Flex>
        {/* Toggleable icon removed */}
        {sortable || sortStatus?.columnAccessor === accessor ? (
          <>
            {sortStatus?.columnAccessor === accessor ? (
              <Center
                className={clsx('mantine-datatable-header-cell-sortable-icon', {
                  'mantine-datatable-header-cell-sortable-icon-reversed': sortStatus.direction === 'desc',
                })}
                role="img"
                aria-label={`Sorted ${sortStatus.direction === 'desc' ? 'descending' : 'ascending'}`}
              >
                {sortIcons?.sorted || <IconArrowUp />}
              </Center>
            ) : (
              <Center
                className="mantine-datatable-header-cell-sortable-unsorted-icon"
                role="img"
                aria-label="Not sorted"
              >
                {sortIcons?.unsorted || <IconArrowsVertical />}
              </Center>
            )}
          </>
        ) : null}
        {filter ? (
          <DataTableHeaderCellFilter filterPopoverProps={filterPopoverProps} isActive={!!filtering}>
            {filter}
          </DataTableHeaderCellFilter>
        ) : null}
      </Group>
      {resizable ? <DataTableResizableHeaderHandle accessor={accessor as string} columnRef={columnRef} minResizableWidth={minResizableWidth} /> : null}
    </TableTh>
  );
}

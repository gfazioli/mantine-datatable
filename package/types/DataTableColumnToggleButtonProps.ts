import type { ButtonProps } from '@mantine/core';

export type DataTableColumnToggleButtonProps = {
  /**
   * Icon for the column toggle button
   * @default IconSettings
   */
  icon?: React.ReactNode;
  /**
   * Label for the column toggle button
   * @default 'Columns'
   */
  label?: React.ReactNode;
  /**
   * Props to pass to the Mantine Button component
   */
  buttonProps?: ButtonProps;
};

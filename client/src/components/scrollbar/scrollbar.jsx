import { forwardRef } from 'react';
import SimpleBar from 'simplebar-react'; // Importing the SimpleBar library for custom scrollbars.
import Box from '@mui/material/Box'; // Importing Box component from MUI.

import { scrollbarClasses } from './classes'; // Importing custom classes for scrollbar styling.

// ----------------------------------------------------------------------

// Creating the Scrollbar component using forwardRef to support ref forwarding.
export const Scrollbar = forwardRef((props, ref) => {
  const { slotProps, children, fillContent, sx, ...other } = props; // Destructuring props

  return (
    <Box
      component={SimpleBar} // The Box will render as a SimpleBar component.
      scrollableNodeProps={{ ref }} // Assigning ref to the scrollable node.
      clickOnTrack={false} // Prevents click on track to scroll.
      className={scrollbarClasses.root} // Applying custom classes.
      sx={{
        // Setting styles using MUI's sx prop.
        minWidth: 0, // Minimum width is 0 to avoid layout issues.
        minHeight: 0, // Minimum height is 0 for flexibility.
        flexGrow: 1, // Allows the Box to grow within a flex container.
        display: 'flex', // Enables flexbox layout.
        flexDirection: 'column', // Arranges children in a column.

        // Applying custom styles for different SimpleBar wrapper and content areas
        '& .simplebar-wrapper': slotProps?.wrapper,
        '& .simplebar-content-wrapper': slotProps?.contentWrapper,

        // Custom styles for the content area
        '& .simplebar-content': {
          ...(fillContent && {
            minHeight: 1, // Ensures minimum height for content area if fillContent is true.
            display: 'flex',
            flex: '1 1 auto', // Allows the content to grow and shrink automatically.
            flexDirection: 'column', // Stacking children in a column.
          }),
          ...slotProps?.content, // Additional styles for content area.
        },

        ...sx, // Merge with any additional styles passed via the sx prop.
      }}
      {...other} // Spreading any other props onto the Box component.
    >
      {/* Rendering children passed to the Scrollbar component. */}
      {children}
    </Box>
  );
});

import { Box } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

export const QuickSearchToolbar= () => {
    return (
      <Box  
      >
        <GridToolbarQuickFilter  sx={{ height: 60, width: '100%' }}          
          placeholder="Buscar"
          quickFilterParser={(searchInput) =>
            searchInput
              .split(',')
              .map((value) => value.trim())
              .filter((value) => value !== '')
          }
          
        />
      </Box>
    );
  }
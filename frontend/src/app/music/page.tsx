"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export default function MusicPage() {
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Library
          </Typography>
          <Typography variant="h4">Music & files</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload, folders and search — a mini cloud drive
          </Typography>
        </Box>
        <Chip label="file disk" color="primary" variant="outlined" size="small" />
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 5,
          textAlign: "center",
          borderStyle: "dashed",
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="h6" gutterBottom>
          File manager stub
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The full disk UI from the previous CRA app can be reconnected here next.
          Backend routes `/api/files` are already available.
        </Typography>
        <Button variant="contained" disabled>
          Upload coming soon
        </Button>
      </Paper>
    </Box>
  );
}

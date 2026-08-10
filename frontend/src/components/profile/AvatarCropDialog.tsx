"use client";

import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { getCroppedImageFile } from "@/lib/cropImage";

type AvatarCropDialogProps = {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropped: (file: File) => void | Promise<void>;
};

export default function AvatarCropDialog({
  open,
  imageSrc,
  onClose,
  onCropped,
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setApplying(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels);
      await onCropped(file);
      onClose();
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={applying ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle>Adjust photo</DialogTitle>
      <DialogContent>
        <Box
          position="relative"
          width="100%"
          height={320}
          bgcolor="grey.900"
          borderRadius={3}
          overflow="hidden"
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </Box>

        <Stack spacing={1} mt={2.5} px={0.5}>
          <Typography variant="body2" color="text.secondary">
            Zoom
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            onChange={(_, value) => setZoom(value as number)}
            aria-label="Zoom"
          />
          <Typography variant="caption" color="text.secondary">
            Drag to choose the square area for your avatar
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={applying}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={applying || !croppedAreaPixels}
        >
          {applying ? "Saving…" : "Use photo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

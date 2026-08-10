"use client";

import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  Profile,
} from "@/store/slices/profileSlice";
import { setAuthProfile } from "@/store/slices/authSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import { avatarUrl } from "@/lib/api";
import AvatarCropDialog from "@/components/profile/AvatarCropDialog";

type EditProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
};

export default function EditProfileDialog({
  open,
  onClose,
  profile,
}: EditProfileDialogProps) {
  const dispatch = useAppDispatch();
  const authName = useAppSelector((s) => s.auth.name);
  const updateStatus = useAppSelector((s) => s.profile.updateStatus);
  const { success } = useNotify();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>();
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(profile?.name || authName || "");
      setBio(profile?.bio || "");
      setPreviewAvatar(avatarUrl(profile?.avatar));
    }
  }, [open, profile, authName]);

  useEffect(() => {
    return () => {
      if (cropSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(cropSrc);
      }
    };
  }, [cropSrc]);

  const saving = updateStatus === "loading";

  const onSave = async () => {
    const result = await dispatch(
      updateProfile({ name: name.trim(), bio: bio.trim() })
    );
    if (updateProfile.fulfilled.match(result)) {
      dispatch(
        setAuthProfile({
          name: result.payload.name,
          avatar: result.payload.avatar,
        })
      );
      success("Profile updated");
      onClose();
    }
  };

  const onFileSelected = (file: File | undefined) => {
    if (!file) return;
    if (cropSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(cropSrc);
    }
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCropped = async (file: File) => {
    setAvatarBusy(true);
    try {
      const result = await dispatch(uploadAvatar(file));
      if (uploadAvatar.fulfilled.match(result)) {
        setPreviewAvatar(avatarUrl(result.payload.avatar));
        dispatch(
          setAuthProfile({
            name: result.payload.name,
            avatar: result.payload.avatar,
          })
        );
        success("Avatar updated");
      }
    } finally {
      setAvatarBusy(false);
    }
  };

  const onDeleteAvatar = async () => {
    setAvatarBusy(true);
    try {
      const result = await dispatch(deleteAvatar());
      if (deleteAvatar.fulfilled.match(result)) {
        setPreviewAvatar(undefined);
        dispatch(setAuthProfile({ avatar: null }));
        success("Avatar removed");
      }
    } finally {
      setAvatarBusy(false);
    }
  };

  const closeCrop = () => {
    setCropOpen(false);
    if (cropSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(cropSrc);
    }
    setCropSrc(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Edit profile</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={1}>
            <Box position="relative">
              <Avatar
                src={previewAvatar}
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "primary.main",
                  fontSize: 36,
                }}
              >
                {(name || "U").slice(0, 1).toUpperCase()}
              </Avatar>
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarBusy}
                sx={{
                  position: "absolute",
                  right: -4,
                  bottom: -4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "grey.100" },
                }}
                aria-label="Change avatar"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onFileSelected(e.target.files?.[0])}
              />
            </Box>

            <Stack direction="row" spacing={1} mt={1.5}>
              <Button
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarBusy}
              >
                Upload photo
              </Button>
              {previewAvatar && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={onDeleteAvatar}
                  disabled={avatarBusy}
                >
                  Remove
                </Button>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" mt={1}>
              Choose a square area and zoom before saving
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputProps={{ maxLength: 60 }}
          />
          <TextField
            fullWidth
            label="Bio"
            margin="normal"
            multiline
            minRows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            helperText={`${bio.length}/160`}
            inputProps={{ maxLength: 160 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            disabled={saving || name.trim().length < 2}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <AvatarCropDialog
        open={cropOpen}
        imageSrc={cropSrc}
        onClose={closeCrop}
        onCropped={onCropped}
      />
    </>
  );
}

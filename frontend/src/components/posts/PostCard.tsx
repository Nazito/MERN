"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Post,
  deletePost,
  toggleLike,
  updatePost,
} from "@/store/slices/postsSlice";
import { avatarUrl } from "@/lib/api";

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h`;
  return date.toLocaleDateString();
}

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const busy = useAppSelector((s) => s.posts.actionStatus) === "loading";

  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.text);

  const authorName = post.author?.name || "Member";
  const authorId = post.author?._id;
  const photo = avatarUrl(post.author?.avatar);

  const onSaveEdit = async () => {
    const value = draft.trim();
    if (!value || value === post.text) {
      setEditing(false);
      setDraft(post.text);
      return;
    }
    const result = await dispatch(updatePost({ id: post._id, text: value }));
    if (updatePost.fulfilled.match(result)) {
      setEditing(false);
    }
  };

  const onDelete = async () => {
    setMenuEl(null);
    await dispatch(deletePost(post._id));
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            src={photo}
            component={authorId ? Link : "div"}
            href={authorId ? `/profile/${authorId}` : undefined}
            sx={{ bgcolor: "primary.main", textDecoration: "none" }}
          >
            {authorName.slice(0, 1).toUpperCase()}
          </Avatar>
        }
        action={
          post.isMine ? (
            <>
              <IconButton
                size="small"
                aria-label="Post actions"
                onClick={(e) => setMenuEl(e.currentTarget)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={menuEl}
                open={Boolean(menuEl)}
                onClose={() => setMenuEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setMenuEl(null);
                    setDraft(post.text);
                    setEditing(true);
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={onDelete} disabled={busy}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : null
        }
        title={
          authorId ? (
            <Typography
              component={Link}
              href={`/profile/${authorId}`}
              variant="subtitle1"
              fontWeight={600}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              {authorName}
            </Typography>
          ) : (
            authorName
          )
        }
        subheader={formatTime(post.createdAt)}
      />
      <CardContent>
        {editing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              inputProps={{ maxLength: 2000 }}
            />
            <Box mt={1.25} display="flex" gap={1} justifyContent="flex-end">
              <Button
                size="small"
                onClick={() => {
                  setEditing(false);
                  setDraft(post.text);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={!draft.trim() || busy}
                onClick={onSaveEdit}
              >
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {post.text}
          </Typography>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          size="small"
          color={post.likedByMe ? "primary" : "inherit"}
          startIcon={
            post.likedByMe ? <FavoriteIcon /> : <FavoriteBorderIcon />
          }
          disabled={!isAuth}
          onClick={() => dispatch(toggleLike(post._id))}
        >
          {post.likesCount}
        </Button>
      </CardActions>
    </Card>
  );
}

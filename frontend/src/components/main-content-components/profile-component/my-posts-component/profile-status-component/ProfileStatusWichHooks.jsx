import React from "react";
// import classes from "./ProfileStatus.module.css";
// import PreLoaderComponent from "../../../../commons/preLoader/PreLoaderComponent";
import { useState } from "react";
import { useEffect } from "react";

const ProfileStatusWichHooks = (props) => {
  let [editMode, setEditMode] = useState(false);
  let [status, setStatus] = useState(props.status);
  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);

  const activateEditMode = () => {
    setEditMode(true);
  };

  const deactivateEditMode = () => {
    setEditMode(false);
    props.updateStatus(status);
  };

  const onStatusChange = (e) => {
    setStatus(e.currentTarget.value);
  };
  return (
    <>
      {!editMode && (
        <div>
          <span>{props.status || "no status"}</span>
          <button onClick={activateEditMode}>edit</button>
        </div>
      )}

      {editMode && (
        <div>
          <input autoFocus={true} onChange={onStatusChange} value={status} />
          <button onClick={deactivateEditMode}>ok</button>
        </div>
      )}
    </>
  );
};

export default ProfileStatusWichHooks;

import React from "react";
import {
  createField,
  Input,
  Textarea,
} from "../../../../commons/formControls/formsControl";
import classesError from "../../../../commons/formControls/formsControl.module.css";
import { reduxForm } from "redux-form";

const ProfileDataForm = ({ handleSubmit, profile, error }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button>ok</button>
      </div>
      {error && <div className={classesError.formSummaryError}>{error}</div>}
      <div>full name: {createField("full name", "fullName", [], Input)}</div>
      <div>
        looking for a job:{" "}
        {createField("looking for a job", "lookingForAJob", [], Input, {
          type: "checkbox",
        })}
      </div>

      <div>
        my profesional skills:
        {createField(
          "my profesional skils",
          "lookingForAJobDescription",
          [],
          Textarea
        )}
      </div>

      {/* <div>
        contacts:
        {Object.keys(profile.contacts).map((key) => {
          return (
            <div key={key}>
              {key}
              {createField(key, "contacts." + key, [], Input)}
            </div>
          );
        })}
      </div> */}

      <div>about me: {createField("about me", "aboutMe", [], Textarea)}</div>
      <div></div>
    </form>
  );
};

const ProfileDataFormReduxForm = reduxForm({
  form: "edit-profile",
})(ProfileDataForm);

export default ProfileDataFormReduxForm;

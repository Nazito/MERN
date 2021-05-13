import React from "react";
import classes from "./ProfileStatus.module.css";
import PreLoaderComponent from "../../../../commons/preLoader/PreLoaderComponent";

class ProfileStatus extends React.Component {
  state = {
    editMode: false,
    status: this.props.status,
  };

  activateAditMode = () => {
    this.setState({ editMode: true });
  };

  deactivateAditMode = () => {
    this.setState({ editMode: false });
    this.props.updateStatus(this.state.status);
  };

  onStatusChange = (e) => {
    this.setState({
      status: e.currentTarget.value,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.status !== this.props.status) {
      this.setState({
        status: this.props.status,
      });
    }
  }

  render() {
    return (
      <>
        {!this.state.editMode && (
          <div>
            <span>{this.props.status || "no status"}</span>
            <button onClick={this.activateAditMode}>edit</button>
          </div>
        )}

        {this.state.editMode && (
          <div>
            <input onChange={this.onStatusChange} value={this.state.status} />
            <button onClick={this.deactivateAditMode}>ok</button>
          </div>
        )}
      </>
    );
  }
}

export default ProfileStatus;

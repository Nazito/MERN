import React from "react";
import { create } from "react-test-renderer";
import ProfileStatus from "./ProfileStatus";

describe("ProfileStatus component", () => {
  test("status from props should be in the state", () => {
    const component = create(<ProfileStatus status="testing Component" />);
    const instance = component.getInstance();
    expect(instance.state.status).toBe("testing Component");
  });

  test("after creating <input> should'nt be displayed", () => {
    const component = create(<ProfileStatus status="testing Component" />);
    const root = component.root;

    expect(() => {
      let input = root.findByType("input");
    }).toThrow();
  });

  test("after creating wich correct status <span> should be displayed", () => {
    const component = create(<ProfileStatus status="testing Component" />);
    const root = component.root;
    let span = root.findByType("span");
    expect(span).not.toBeNull();
  });

  test("after creating <span> should contains correct staus", () => {
    const component = create(<ProfileStatus status="testing Component" />);
    const root = component.root;
    let span = root.findByType("span");
    expect(span.children[0]).toBe("testing Component");
  });

  test("input should be displayed in editMode instead of span", () => {
    const component = create(<ProfileStatus status="testing Component" />);
    const root = component.root;
    let button = root.findByType("button");
    button.props.onClick();
    let input = root.findByType("input");
    expect(input.props.value).toBe("testing Component");
  });

  test("callback should be called", () => {
    const mockCallback = jest.fn();
    const component = create(
      <ProfileStatus status="testing Component" updateStatus={mockCallback} />
    );
    const instance = component.getInstance();
    instance.deactivateAditMode();
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});

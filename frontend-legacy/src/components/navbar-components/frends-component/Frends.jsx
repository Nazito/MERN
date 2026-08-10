import React from "react";
// import classes from "./Frends.module.css";
import FrendItem from "./frend-item-component/FrendItem";

const Frends = props => {
  let b = 0;
  let frendsList = props.store.getState().frendsData.frends.map(f => {
    return <FrendItem name={f.name} ava={f.ava} key={b++} />;
  });

  return <div>{frendsList}</div>;
};

export default Frends;

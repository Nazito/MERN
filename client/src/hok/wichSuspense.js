import React, { Suspense } from "react";

export const WichSuspense = (Component) => {
  return (props) => {
    return (
      <Suspense fallback={<div>Загрузка...</div>}>
        <Component {...props} />;
      </Suspense>
    );
  };
};

import React, { useRef, useState } from "react";
import CustomerHeader from "../../components/CustomerHeader";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";

// Udviklet fælles i gruppen

const Favorites = () => {
  return (
    <>
      <CustomerHeader nav={false} />
      <PageWrapperContainer>
        <div className="mt-10">
          <BackButtonWithArrow linkText="Gå til forsiden" linkTo="/bestil-online" />

          <p>Siden er ikke lavet endnu. Kom tilbage senere.</p>
        </div>
      </PageWrapperContainer>
    </>
  );
};

export default Favorites;

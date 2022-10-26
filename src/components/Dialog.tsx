// @ts-nocheck
import React, { useEffect } from "react";
import { DialogExtensionSDK } from "@contentful/app-sdk";

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = (props: DialogProps) => {
  const { imageURL } = props.sdk.parameters.invocation;

  useEffect(() => {
    props.sdk.window.startAutoResizer();
  }, [props.sdk.window]);

  return (
    <img
      style={{ "margin": "0px auto", display: "block" }}
      src={imageURL}
      alt="Generated Static Google Map"
    />
  );
};

export default Dialog;

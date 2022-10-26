import { SharedEditorSDK } from "@contentful/app-sdk";
import { useEffect, useState } from "react";

export const useField = <T,>(sdk: SharedEditorSDK, fieldId: string): T => {
  const contentField = sdk.entry.fields[fieldId];
  const [value, setValue] = useState(contentField.getValue() || "");

  useEffect(() => {
    const detach = contentField.onValueChanged(setValue);
    return () => detach();
  }, [contentField]);

  return value;
};

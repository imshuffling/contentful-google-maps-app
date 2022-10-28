import { useEffect } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import Map from "./Map";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  const { sdk } = props;
  const fieldValue = sdk.field.getValue();

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  const onAssetProcessed = async (asset: any) => {
    await sdk.field.setValue({
      sys: {
        id: asset.sys.id,
        linkType: "Asset",
        type: "Link",
      },
    });
  };

  const onRemoveField = async () => {
    await sdk.field.removeValue();
  };

  return (
    <div>
      <Map
        sdk={sdk}
        fieldValue={fieldValue}
        onAssetProcessed={onAssetProcessed}
        onRemoveField={onRemoveField}
      />
    </div>
  );
};

export default Field;

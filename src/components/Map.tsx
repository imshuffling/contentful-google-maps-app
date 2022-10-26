import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEventHandler,
} from "react";

import {
  Form,
  TextField,
  Button,
  AssetCard,
  DropdownList,
  DropdownListItem,
  Modal,
  GridItem,
  Grid,
} from "@contentful/forma-36-react-components";
import { FieldExtensionSDK, EditorExtensionSDK } from "@contentful/app-sdk";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import { useField } from "../hooks/useField";

interface FieldProps {
  //   sdk: FieldExtensionSDK;
  sdk: FieldExtensionSDK | EditorExtensionSDK;
  fieldValue: any;
  onAssetProcessed: (asset: any) => void;
  onRemoveField: () => void;
}

interface InputFields {
  styles: object;
  coordinates: { lat: number; lng: number };
  marker: string;
  zoom?: number;
  [key: string]: any;
}

const containerStyle = {
  width: "703px",
  height: "400px",
};

const Map = (props: FieldProps) => {
  const { sdk, fieldValue, onAssetProcessed, onRemoveField } = props;

  const mapSettingsField = useField<any>(sdk, "configuration");
  const mapField = useField<any>(sdk, "googleMap");

  // console.log("sdk", sdk);

  // // const fieldValue = sdk.field.getValue();

  const {
    google_maps_api_key,
    googlemaps_theme,
    googlemaps_theme_static,
    googlemaps_marker,
  } = sdk.parameters.installation as any;

  const [assetDetails, setAssetDetails] = useState<any>("");
  const [isShown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [recreate, setRecreate] = useState(false);
  const mapRef = useRef<any>(null);

  const [inputFields, setInputFields] = useState<InputFields>({
    styles: JSON.parse(googlemaps_theme),
    coordinates: { lat: 51.501476, lng: -0.140634 },
    marker: googlemaps_marker,
    zoom: 20,
  });

  console.log("inputFields", inputFields);

  const STATIC_GREY_THEME = googlemaps_theme_static;
  const GOOGLE_MAP = `https://maps.googleapis.com/maps/api/staticmap?center=${inputFields.coordinates.lat},${inputFields.coordinates.lng}%20%20&zoom=${inputFields.zoom}&size=640x350&scale=2&format=png32&maptype=roadmap&markers=icon:${inputFields.marker}|${inputFields.coordinates.lat},${inputFields.coordinates.lng}&key=${google_maps_api_key}${STATIC_GREY_THEME}`;

  const zoomCallBack = useCallback(() => {
    handleZoomChanged();
    if (assetDetails) {
      setRecreate(true);
    }
  }, [mapRef.current, assetDetails]);

  // const handleMarkerChange = (event: any) => {
  //   const values = { ...inputFields };
  //   values[event.target.name as any] = event.target.value;
  //   setInputFields(values);
  //   if (assetDetails) {
  //     setRecreate(true);
  //   }
  // };

  const handleLat = (event: any) => {
    setInputFields((inputFields) => ({
      ...inputFields,
      coordinates: {
        ...inputFields.coordinates,
        [event.target.name as any]: Number(event.target.value),
      },
    }));
    if (assetDetails) {
      setRecreate(true);
    }
  };

  const handleLng = (event: any) => {
    setInputFields((inputFields) => ({
      ...inputFields,
      coordinates: {
        ...inputFields.coordinates,
        [event.target.name as any]: Number(event.target.value),
      },
    }));

    if (assetDetails) {
      setRecreate(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!assetDetails) {
      const mapSettings = sdk.entry.fields.configuration;
      await mapSettings.getValue();
      await mapSettings.removeValue();

      // const getTitle = sdk.entry.fields.administrativeTitle;
      // const administrativeTitle = getTitle.getValue();

      const asset: any = await sdk.space.createAsset({
        fields: {
          title: {
            "en-US": `Map - image`,
          },
          file: {
            "en-US": {
              contentType: "image/png",
              fileName: `map`,
              upload: GOOGLE_MAP,
            },
          },
        },
      });

      const processing = await sdk.space.processAsset(asset, "en-US");
      await sdk.space.publishAsset(processing);
      await sdk.space.getAsset(asset.sys.id);

      onAssetProcessed({
        sys: {
          id: asset.sys.id,
          linkType: "Asset",
          type: "Link",
        },
      });

      console.log("setting inputFields mapSettings", inputFields);

      await mapSettings.getValue();
      await mapSettings.setValue(inputFields);
    }

    // Re-generate Map
    if (assetDetails) {
      const mapSettings = sdk.entry.fields.configuration;
      await mapSettings.getValue();
      await mapSettings.removeValue();

      // const getTitle = sdk.entry.fields.administrativeTitle;
      // const administrativeTitle = getTitle.getValue();

      let asset: any = await props.sdk.space.getAsset(assetDetails.sys.id);
      asset.fields.file["en-US"] = {
        fileName: `Map_admintitle`,
        contentType: "image/png",
        upload: GOOGLE_MAP,
      };

      asset = await props.sdk.space.updateAsset(asset);
      asset = await props.sdk.space.processAsset(asset, "en-US");
      await props.sdk.space.publishAsset(asset);

      onAssetProcessed({
        sys: {
          id: assetDetails.sys.id,
          linkType: "Asset",
          type: "Link",
        },
      });

      await mapSettings.getValue();
      await mapSettings.setValue(inputFields);
    }

    setLoading(false);
    setRecreate(false);
  };

  const onMarkerDragEnd = (event: any) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();

    setInputFields((inputFields) => ({
      ...inputFields,
      coordinates: {
        lat: newLat,
        lng: newLng,
      },
    }));
    if (assetDetails) {
      setRecreate(true);
    }
  };

  const handleZoomChanged = () => {
    const zooming = mapRef.current?.state.map.zoom;
    if (mapRef.current?.state.map.zoom !== inputFields.zoom) {
      setInputFields((inputFields) => ({
        ...inputFields,
        zoom: zooming,
      }));
    }
  };

  const handleRemove = async () => {
    setLoadingCard(true);
    setShown(false);
    setAssetDetails("");

    const mapSettings = sdk.entry.fields.configuration;
    await mapSettings.getValue();
    await mapSettings.removeValue();

    const getAsset = await sdk.space.getAsset(mapField.sys.id);
    await sdk.space.unpublishAsset(getAsset);
    await sdk.space.deleteAsset(getAsset);
    // await mapField.removeValue();

    onRemoveField();
    setInputFields({
      styles: JSON.parse(googlemaps_theme),
      coordinates: { lat: 51.501476, lng: -0.140634 },
      marker: googlemaps_marker,
      zoom: 20,
    });
    // setLoading(false);
    setLoadingCard(false);
  };

  // useEffect(() => {
  //   if (typeof mapSettingsField !== "undefined") {
  //     // sdk.entry.fields.configuration.getValue();
  //     setInputFields(sdk.entry.fields.configuration.getValue());
  //   }
  // }, [mapSettingsField, sdk.entry.fields.configuration]);

  useEffect(() => {
    console.log(
      "sdk.entry.fields.configuration.getValue()",
      sdk.entry.fields.configuration.getValue()
    );

    if (sdk.entry.fields.configuration.getValue() !== undefined) {
      setInputFields(mapSettingsField);
    }
  }, [mapSettingsField, sdk.entry.fields.configuration]);

  useEffect(() => {
    if (typeof mapField?.sys !== "undefined") {
      sdk.space.getAsset(mapField?.sys.id).then((data) => {
        setAssetDetails(data);
      });
    }
  }, [sdk.space, fieldValue, mapField]);

  if (loadingCard && !assetDetails) {
    return (
      <div>
        <Form>
          <AssetCard src="" title="Loading" isLoading={true} />
        </Form>
      </div>
    );
  }

  return (
    <div>
      <Form
        className={
          loading ? "google-map-generator loading" : "google-map-generator"
        }
      >
        <Grid columns={2} columnGap={"spacingM"}>
          <GridItem>
            <TextField
              name="lat"
              id="lat"
              value={`${Number(inputFields.coordinates.lat)}`}
              labelText="Lat"
              width="medium"
              textInputProps={{ placeholder: "Lat", type: "number" }}
              onChange={(event) => handleLat(event)}
            />
          </GridItem>
          <GridItem>
            <TextField
              name="lng"
              id="lng"
              width="medium"
              value={`${Number(inputFields.coordinates.lng)}`}
              labelText="Lng"
              textInputProps={{ placeholder: "Lng", type: "number" }}
              onChange={(event) => handleLng(event)}
            />
          </GridItem>
        </Grid>

        <div style={{ width: "100%", height: "100%" }}>
          <LoadScript googleMapsApiKey={google_maps_api_key}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                styles: JSON.parse(googlemaps_theme),
              }}
              center={inputFields.coordinates}
              zoom={inputFields.zoom || 20}
              ref={mapRef}
              onZoomChanged={zoomCallBack}
            >
              <Marker
                icon={inputFields.marker}
                draggable={true}
                onDragEnd={(event) => onMarkerDragEnd(event)}
                position={inputFields.coordinates}
              />
            </GoogleMap>
          </LoadScript>
        </div>

        {!recreate && !assetDetails && (
          <Button
            buttonType="primary"
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Creating" : "Create Map"}
          </Button>
        )}

        {!recreate && assetDetails && (
          <Button buttonType="primary" disabled>
            Create Map
          </Button>
        )}

        {recreate && (
          <Button
            buttonType="primary"
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Creating" : "Re-Create Map"}
          </Button>
        )}
        {assetDetails && (
          <AssetCard
            status={loading ? "changed" : "published"}
            type="image"
            src={assetDetails.fields.file["en-US"].url}
            title="Google Map"
            size="default"
            dropdownListElements={
              <>
                <DropdownList>
                  <DropdownListItem
                    isDisabled={loading ? true : false}
                    onClick={() => setShown(true)}
                  >
                    Remove
                  </DropdownListItem>
                </DropdownList>
              </>
            }
          />
        )}
      </Form>
      <Modal
        {...props}
        isShown={isShown}
        onClose={() => setShown(false)}
        size={"small"}
      >
        {({ onClose }: { onClose: MouseEventHandler }) => (
          <div>
            <Modal.Header title="Are you sure?" onClose={onClose} />
            <Modal.Content>{`You are about to delete the Map.`}</Modal.Content>
            <Modal.Controls position="right">
              <Button onClick={onClose} buttonType="muted">
                Cancel
              </Button>
              <Button onClick={handleRemove} buttonType="negative">
                Delete
              </Button>
            </Modal.Controls>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Map;

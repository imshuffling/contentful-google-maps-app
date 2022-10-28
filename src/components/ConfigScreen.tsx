// @ts-nocheck
import React, { useCallback, useState, useEffect } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  Form,
  Workbench,
  TextField,
  Subheading,
  Grid,
  Heading,
  Typography,
  Paragraph,
} from "@contentful/forma-36-react-components";
import { css } from "emotion";

export interface AppInstallationParameters {}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

const Config = (props: ConfigProps) => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    google_maps_api_key: "",
    googlemaps_theme: "",
    googlemaps_theme_static: "",
    googlemaps_marker: "",
  });

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await props.sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, props.sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => onConfigure());
  }, [props.sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await props.sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      props.sdk.app.setReady();
    })();
  }, [props.sdk]);

  return (
    <Workbench className={css({ margin: "30px" })}>
      <div className={css({ width: "100%" })}>
        <Typography>
          <Heading size="large">Google Maps Settings</Heading>
          <Paragraph>
            This is the configuration settings for Google Maps App
          </Paragraph>
        </Typography>
        <Grid columns={"1fr 1fr"} className={css({ marginTop: "60px" })}>
          <Form>
            <TextField
              name="google_maps_api_key"
              id="google_maps_api_key"
              labelText="Google Maps API v3 Key"
              textInputProps={{ placeholder: "Please enter a valid Key" }}
              required
              value={parameters.google_maps_api_key}
              onChange={(event): void => {
                const target = event.target as HTMLInputElement;
                const { value } = target;
                setParameters({
                  ...parameters,
                  google_maps_api_key: value,
                });
              }}
            />

            <TextField
              name="googlemaps_marker"
              id="googlemaps_marker"
              labelText="Marker"
              textInputProps={{
                placeholder:
                  "Please provide an external image URL for the Marker Pin",
              }}
              required
              value={parameters.googlemaps_marker}
              onChange={(event): void => {
                const target = event.target as HTMLInputElement;
                const { value } = target;
                setParameters({
                  ...parameters,
                  googlemaps_marker: value,
                });
              }}
            />
          </Form>
        </Grid>
        <Form>
          <Subheading>Map Theme</Subheading>
          <Grid columns={2} className="colour-schemes">
            <div>
              <TextField
                name="googlemaps_theme"
                id="googlemaps_theme"
                labelText="Theme"
                helpText="Please enter valid JSON string for the google map skin"
                required
                textarea
                value={parameters.googlemaps_theme}
                onChange={(event): void => {
                  const target = event.target as HTMLInputElement;
                  const { value } = target;
                  setParameters({
                    ...parameters,
                    googlemaps_theme: `${value}`,
                  });
                }}
              />
            </div>
            <div>
              <TextField
                name="googlemaps_theme_static"
                id="googlemaps_theme_static"
                labelText="Static Theme"
                helpText="This is the static map theme options"
                required
                textarea
                value={parameters.googlemaps_theme_static}
                onChange={(event): void => {
                  const target = event.target as HTMLInputElement;
                  const { value } = target;
                  setParameters({
                    ...parameters,
                    googlemaps_theme_static: `${value}`,
                  });
                }}
              />
            </div>
          </Grid>
        </Form>
      </div>
    </Workbench>
  );
};

export default Config;

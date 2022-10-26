# Google Maps App
POC App which allows the user to create a static google map image with a marker inside of Contentful.

https://user-images.githubusercontent.com/739061/198059812-a204bd01-75dd-4df1-8fcc-f1a26573570a.mp4

**Please note you will need a Google Maps V3 API key**

In the content model you will need to configure 2 fields, with the ids of `googleMap` and `configuration`.

<img width="1548" alt="image" src="https://user-images.githubusercontent.com/739061/198057099-778cb2e8-df7e-43d7-bd71-91909de98dff.png">

#### App Configuration Screen

You will need to specifiy a static image URL for the marker, and the json files for the Google Map theme. Recommend using https://snazzymaps.com/ for this.

<img width="1082" alt="Screenshot 2022-10-26 at 15 44 22" src="https://user-images.githubusercontent.com/739061/198058182-4369fbb4-35b1-4a2d-b409-ea3ea87731a8.png">

#### App definition

Add the app on the media reference field, make sure the relevant fields have been created on the content model (`googleMap` and `configuration`).

<img width="587" alt="image" src="https://user-images.githubusercontent.com/739061/198057597-de566282-660a-45e9-a333-7fb53a7d9561.png">

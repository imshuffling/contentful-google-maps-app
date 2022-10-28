# Google Maps App
POC App which allows the user to create a static google map image with a marker inside of Contentful.

![Screen Recording 2022-10-28 at 11 15 13](https://user-images.githubusercontent.com/739061/198566005-d0b29baf-a761-4a1f-b581-c847be19bd23.gif)

**Please note you will need a Google Maps V3 API key**

In the content model you will need to configure 2 fields, with the ids of `googleMap` and `configuration`.

<img width="1548" alt="image" src="https://user-images.githubusercontent.com/739061/198057099-778cb2e8-df7e-43d7-bd71-91909de98dff.png">

#### App Configuration Screen

You will need to specifiy a static image URL for the marker, and the json files for the Google Map theme. Recommend using https://snazzymaps.com/ for this.

<img width="1082" alt="Screenshot 2022-10-26 at 15 44 22" src="https://user-images.githubusercontent.com/739061/198058182-4369fbb4-35b1-4a2d-b409-ea3ea87731a8.png">

#### App definition

Add the app on the media reference field, make sure the relevant fields have been created on the content model (`googleMap` and `configuration`).

![image](https://user-images.githubusercontent.com/739061/198306306-9edef410-1b9f-421e-9245-b0f18dafc7d2.png)


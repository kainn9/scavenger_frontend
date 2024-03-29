# Quick Heads Up!
So, here's the deal: This project is a relic from my early days in a coding bootcamp. I've got to admit, I was pretty clueless back then. To be honest, I'm not 100% convinced much has changed—I'm still figuring things out. But let me tell you, my coding skills have come a long way since this.


# Scavenger Frontend
([backend](https://github.com/kainn9/scav-backend))

![](https://media.giphy.com/media/JEaYohn54rEYxde1Ua/giphy.gif)



## Demo

https://scavenger-frontend.vercel.app/
Note: demo may be buggy at times as app is in development.

## Video Overview

[Video Demo](https://www.youtube.com/watch?v=tApE3d16Nl4)

## Brief Summary:

-   Project is mobile friendly/preferred web app.
-   Goal of the project is to enable users to share/save/like collections of nodes(routes) that can have multiple types of data stored(images, podcasts, songs, playlists, title, and text). The routes can be created/shared/viewed using google maps api with the web geolocation api.

## In Depth Component Docs(experimental)

https://kainan54.github.io/scavenger_frontend/

## Component Diagram/Flow Chart

![](./diagram-img.jpg)

## Progress:

-   Spotify Auth0/Login Frontend + Backend ✓
-   FrontEnd Login Page ✓
-   FrontEnd Home Page ✓ (Now does geoSpatial query for routes based on map center, can preview routes and navigate to user pages from preview)
-   Front End Create Page ✓
-   Front End Profile Page ✓... ✘...actually like 95% also want to user show likes here(when likes are added). Should be able to use same render component with diff array/map fn probably and toggle btn somewhere
-   Backend Image uploads via s3 bucket ✓
-   Backend Geo Spatial queries ✓ (mentioned but its really a backend feature, plus I like ✓ marks!)

-   Front End Route dedicated Show page ✘ (right now routes can only be viewed on home-page-mini preview and user profile pages)
-   Frontend + backEnd User Likes ✘
-   Backend readme + cleanup + documentation ✘
-   css still needs work ✘✘

## backend init(3/16/21)

-   https://github.com/kainan54/scav-backend

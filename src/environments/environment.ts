// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebase: {
    //apiKey: 'AIzaSyAVYwB5JTyuP9R2TjRGhd8X9oifKjBSsbs',
    //projectId: 'programming-books-collection'
    apiKey: "AIzaSyAVYwB5JTyuP9R2TjRGhd8X9oifKjBSsbs",
    authDomain: "programming-books-collection.firebaseapp.com",
    databaseURL: "https://programming-books-collection.firebaseio.com",
    projectId: "programming-books-collection",
    storageBucket: "programming-books-collection.appspot.com",
    messagingSenderId: "251245412703",
    appId: "1:251245412703:web:18e4babcf770887d8cb6ea",
    measurementId: "G-S145JC33W6",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

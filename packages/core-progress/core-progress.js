// .nrk-progress:not(value) {}  /* Styling indeterminate progress bar */
// .nrk-progress[value] {       /* Styling determinate progress bar */
//   -webkit-appearance: none;
//   -moz-appearance: none;
//   appearance: none;
//   border: 0;            /* Fix Firefox and Opera */
//   width: 100%;
//   height: 20px;
//   background: whiteSmoke; /* Although firefox doesn't provide any pseudo class to style the progress, any style applied here works on the container. */
//   border-radius: 3px;
//   box-shadow: 0 2px 3px rgba(0,0,0,.5) inset;
//   color: royalblue;       /* Of all IE, only IE10 supports progress element that too partially. It only allows to change the background-color of the progress value using the 'color' attribute. */
//   position: relative;
//   margin: 0 0 1.5em;
// }
// .nrk-progress[value]::-webkit-progress-bar {     /* Style the progress container Webkit */
//   background: whiteSmoke;
//   border-radius: 3px;
//   box-shadow: 0 2px 3px rgba(0,0,0,.5) inset;
// }
// .nrk-progress[value]::-webkit-progress-value {   /* Style the progress value in Webkit */
//   position: relative;
//   background-size: 35px 20px, 100% 100%, 100% 100%;
//   border-radius:3px;
// }
//
// .nrk-progress[value]::-moz-progress-bar {        /* Style the progress value in Firefox */
//   background-size: 35px 20px, 100% 100%, 100% 100%;
//   border-radius: 3px;
//   background-image:
//     -moz-linear-gradient(135deg, transparent, transparent 33%, rgba(0,0,0,.1) 33%, rgba(0,0,0,.1) 66%, transparent 66%),
//     -moz-linear-gradient(top, rgba(255, 255, 255, .25), rgba(0,0,0,.2)),
//     -moz-linear-gradient(left, #09c, #f44);
// }
// <progress class="nrk-progress" role="progressbar" aria-valuemin="0" aria-valuenow="22" value="22" aria-valuemax="100" max="100" aria-valuetext="Saving changes...">
//   <span class="nrk-progress" role="progressbar">
//     <span style="width:22%">Saving changes...</span>
//   </span>
// </progress>

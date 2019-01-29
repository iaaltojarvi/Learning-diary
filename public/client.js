
$(document).ready(function(){
    // Use cookie username to write hello username
  const cookie = document.cookie.split("=");
  const span = $('#welcome');
    span.text(`${cookie[1]}`);
  });

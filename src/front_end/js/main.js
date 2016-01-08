//======================== busker example========================
var busker_instance_Ed = {
  name: "Ed Kung",
  img: "https://pbs.twimg.com/profile_images/470426013311057921/g-AZBdua.jpeg",
  category: "Performance Arts",
  content: "Hip-hop and Street Dance",
  fb: "https://www.facebook.com/kung.ed?fref=ts",
  members: "Ed Kung",
  email: "-",
};

var busker_instance_AnChe = {
  name: "AnChe Teng",
  img: "https://scontent-hkg3-1.xx.fbcdn.net/hphotos-xft1/v/t1.0-9/11140355_10206868723862535_645045240312747314_n.jpg?oh=cf3e8b2311228c42de8cca6727eddd95&oe=5746A087",
  category: "Performance Arts",
  content: "Chinese Flute",
  fb: "https://www.facebook.com/Wastelandshadow",
  members: "AnChe Teng",
  email: "-",
};

var busker_instance_Wu = {
  name: "ChengHan Wu",
  img: "https://scontent-hkg3-1.xx.fbcdn.net/hphotos-xtl1/v/t1.0-9/11259429_10203609253026537_1212446084713178912_n.jpg?oh=e101fdd2df6e9b3ae3d4d7b2a51d85dd&oe=56FDE73E",
  category: "Performance Arts",
  content: "Singing",
  fb: "https://www.facebook.com/profile.php?id=1672230560&fref=ts",
  members: "ChengHan Wu",
  email: "-",
};
//======================== busker example========================


$(document).ready(function() {
  // var source_home = $("#home-template").html();
  var home_template = Handlebars.compile($("#home-template").html());
  var signup_template = Handlebars.compile($("#signup-template").html());
  var busker_template = Handlebars.compile($("#busker-template").html());

  $("body").append(home_template());

  $(".home").click(function() {
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(home_template());
  });

  $("#signup").click(function() {
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(signup_template());
  });

  $("#busker").click(function() {
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(busker_template(busker_instance_Ed));
    $("body").append(busker_template(busker_instance_AnChe));
    $("body").append(busker_template(busker_instance_Wu));
  });

})

! function($) {
  $(function() {
    // carousel demo
    $('#myCarousel1').carousel()
  })
}(window.jQuery)

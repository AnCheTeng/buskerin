//======================== busker example ========================
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

var all_buskers_list = [busker_instance_Ed, busker_instance_AnChe, busker_instance_Wu]
  //======================== busker example ========================

//======================== Global Variable ========================
var account_name = "";
var account_email = "";
var account_favorate_list = "";
var account_password = "";
var context = "home";
//======================== Global Variable ========================

$(document).ready(function() {
  // var source_home = $("#home-template").html();
  var home_template = Handlebars.compile($("#home-template").html());
  var signup_template = Handlebars.compile($("#signup-template").html());
  var busker_template = Handlebars.compile($("#busker-template").html());
  var search_template = Handlebars.compile($("#search-box-template").html());

  // append buskers by passing the busker-list
  var append_buskers = function(search_target) {
    search_target.forEach(function(element) {
      $("body").append(busker_template(element));
    });
    $('.addFav').click(function() {
      var busker_unit = $(this).closest('.hero-unit');
      var busker_num = busker_unit.data('num');
      if (account_name == "") {
        alert("Please login!");
      } else {
        console.log(busker_num);
        $.ajax('http://104.199.159.110:8888/account/favorite', {
          type: 'POST',
          data: {
            "performer_no": busker_num,
            "email": account_email,
            "password": account_password
          },
          success: function(result) {
            account_favorate_list = result;
          }
        });

      }
    });
  }

  // $("body").append(home_template());

  $("#signin").on('click', '#signin-btn', function() {
    var email = $(".email").val();
    var password = $(".password").val()

    if ((email && password) != "") {

      $.ajax('http://104.199.159.110:8888/account/login', {
        type: 'POST',
        data: {
          "email": email,
          "password": password
        },
        success: function(result) {
          account_name = result[0].user_name;
          account_favorate_list = result[0].favorite_list;
          account_password = password;
          account_email = email;
          if (result[0].success == true) {
            var user = $('<ul class="nav pull-right"><li><a href="#"><font size="5px" face="Comic Sans MS"><b>Hello! ' + account_name + '</b></font></a></li></ul>');
            $(".nav-collapse").append(user);
            $("#signin").remove();
          } else {
            alert("Login fail");
          }
        }
      });

    } else {
      alert("Please enter your email and password!");
    }
  });

  $(".home").click(function() {
    context = "home";
    $("body > .form-wrapper").remove();
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(home_template());
    // Auto-Carousel
    ! function($) {
      $(function() {
        // carousel demo
        $('#myCarousel1').carousel()
      })
    }(window.jQuery)
    // Auto-Carousel
  });

  $(".home").trigger('click');



  $("#favorite").click(function() {
    if (account_name == "") {
      alert("Please login!");
    } else {
      context = "favorite_list";
      $("body > .form-wrapper").remove();
      $("body > #myCarousel1").remove();
      $("body > .container-fluid").remove();
      append_buskers(account_favorate_list);
      $(".addFav").after($('<button class="btn btn-large btn-danger delFav">Delete</button>'));
      $(".addFav").remove();

      $('.delFav').click(function() {
        var delete_unit = $(this).closest('.hero-unit');
        var busker_num = delete_unit.data('num');

        console.log(busker_num);
        $.ajax('http://104.199.159.110:8888/account/favorite', {
          type: 'DELETE',
          data: {
            "performer_no": busker_num,
            "email": account_email,
            "password": account_password
          },
          success: function(result) {
            account_favorate_list = result;
            $("#favorite").trigger("click");
          }
        });


      });
    }
  })

  $("#busker").click(function() {
    context = "busker_list";
    $("body > .form-wrapper").remove();
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(search_template());

    var temp_busker_list = "";
    var state = "default";
    var idx = 0;
    var query_url = 'http://104.199.159.110:8888/busker/searchBuskerDefault?idx=';
    var search_target = "";

    $.ajax(query_url + idx, {
      type: 'GET',
      success: function(result) {
        console.log(result);
        temp_busker_list = result;
        append_buskers(temp_busker_list);

      }
    });
    // append origin buskers here
    $("body").append($('<div class="container-fluid"><a href="#" class="btn btn-md btn-info" style="position: fixed; bottom: 2%; right: 2%;">Top</a></div>'));

    $(window).scroll(function() {
      if (($(window).scrollTop() + $(window).height() == $(document).height()) && context == "busker_list") {
        // append new buskers here
        idx = idx + 5;
        $.ajax(query_url + idx, {
          type: 'GET',
          success: function(result) {
            console.log(result);
            temp_busker_list = result;
            append_buskers(temp_busker_list);
          }
        });
      }
    });

    $("#search_submit").click(function() {
      search_target = $(".form-wrapper input").val();
      idx = 0;
      query_url = 'http://104.199.159.110:8888/busker/searchBuskerByKeyword?key=' + search_target + '&idx=';
      console.log(search_target);
      console.log(query_url);
      if (search_target != "") {
        $("body > .container-fluid").remove();
        // append new buskers here
        $.ajax(query_url + idx, {
          type: 'GET',
          success: function(result) {
            console.log(result);
            temp_busker_list = result;
            append_buskers(temp_busker_list);
          }
        });
      }
    });



  });

  $("#signup").click(function() {
    context = "sign_up";
    $("body > .form-wrapper").remove();
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(signup_template());

    $("#signup_btn").click(function() {
      var email = $("#signup_email").val();
      var password = $("#signup_password").val()
      var name = $("#signup_name").val()

      if ((email && password) != "") {
        $.ajax('http://104.199.159.110:8888/account/register', {
          type: 'POST',
          data: {
            "name": name,
            "email": email,
            "password": password
          },
          success: function(result) {
            if (result == 0) {
              alert("Now you can log in with your email!");
              $(".home").trigger('click');
            } else {
              alert("You have registered!");
            }
          }
        });
      } else {
        alert("Please enter your email and password!");
      }

    });

  });

})

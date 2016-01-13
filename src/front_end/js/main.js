//======================== Global Variable ========================
var targetIP = '104.199.159.110:8888';
//var targetIP = 'localhost:8888';
var welcomingFlag = false;
var last_visit_time = 0;
var latest_visit_time = 0;
var account_name = "";
var account_email = "";
var account_favorate_list = "";
var account_password = "";
var signup_account_name = "";
var signup_account_email = "";
var context = "home";
//======================== Global Variable ========================

$(document).ready(function() {
  // var source_home = $("#home-template").html();
  var home_template = Handlebars.compile($("#home-template").html());
  var signup_template = Handlebars.compile($("#signup-template").html());
  var signup_p_template = Handlebars.compile($("#signup-performer-template").html());
  var busker_template = Handlebars.compile($("#busker-template").html());
  var search_template = Handlebars.compile($("#search-box-template").html());

  // append buskers by passing the busker-list
  var append_buskers = function(search_target) {
    search_target.forEach(function(element) {
      $("body").append(busker_template(element));
      $("#"+element.num).on('click', '.addFav', function() {
        var busker_unit = $(this).closest('.hero-unit');
        var busker_num = busker_unit.data('num');
        if (account_name == "") {
          alert("Please login!");
        } else {
          console.log(busker_num);
          $.ajax('http://'+ targetIP + '/account/favorite', {
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
      })
    });
  }

  // $("body").append(home_template());

  $("#signin").on('click', '#signin-btn', function() {
    var email = $(".email").val();
    var password = $(".password").val()

    if ((email && password) != "") {

      $.ajax('http://'+ targetIP + '/account/login', {
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

    initMap();

    showMarkers();

    welcomingFlag = calLastVisitTime();
    if(welcomingFlag) {
      swal({
        title: "Hello my friend!",
        text: "Enjoy it",
        imageUrl: "assets/image/smile.jpg",
        imageSize: "400x200"
      });
    }

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
        $.ajax('http://'+ targetIP + '/account/favorite', {
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
    var query_url = 'http://'+ targetIP + '/busker/searchBuskerDefault?idx=';
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
    // var timeout;
    $(window).scroll(function() {
      // ============Timeout for scroll down============
      // clearTimeout(timeout);
      // timeout = setTimeout(function() {
      //     // do your stuff
      // }, 50);
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
      query_url = 'http://'+ targetIP + '/busker/searchBuskerByKeyword?key=' + search_target + '&idx=';
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

  $("#signup").add("#signup1").add("#signup2").add("#signup3").click(function() {
    context = "sign_up";
    $("body > .form-wrapper").remove();
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(signup_template());

    $("#signup_btn").click(function() {
      var email = $("#signup_email").val();
      var password = $("#signup_password").val();
      var name = $("#signup_name").val();
      var buskerCheck = ($('#buskerCheckBox').is(":checked")) ? true : false;
      console.log('buskerCheck: ' + buskerCheck);

      signup_account_name = name;
      signup_account_email = email;

      if ((email && password) != "") {
        $.ajax('http://'+ targetIP + '/account/register', {
          type: 'POST',
          data: {
            "name": name,
            "email": email,
            "password": password,
            "beBuskers": buskerCheck
          },
          success: function(result) {
            console.log('result: ' + result);
            if (result == 0) {
              swal({
                title: "Success!",
                text: "Now you can log in!",
                type: "info",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
              }, function(){
                $(".home").trigger('click');
              });
            } else if (result == 2) {
              swal({
                title: "Great!",
                text: "Let's register your performance",
                type: "info",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
              }, function() {
                signUpPerformer();
              });
            } else {
              swal({
                title: "Oops...",
                text: "The account is registered!",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
              });
            }
          }
        });
      } else {
        swal({
          title: "Oops...",
          text: "User information cannot be empty!",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "OK",
          closeOnConfirm: true,
        });
      }
    });
  });

  function signUpPerformer() {
    context = "sign_up_p";
    $("body > .form-wrapper").remove();
    $("body > #myCarousel1").remove();
    $("body > .container-fluid").remove();
    $("body").append(signup_p_template());

    $("#signup_p_btn").click(function() {
      var p_group_name = $("#signup_p_group_name").val();
      var p_name = $("#signup_p_name").val();
      var p_type = $("#signup_p_type").val();
      var p_content = $("#signup_p_content").val();
      var p_img = $("#signup_p_content").val();
      var p_webpage = $("#signup_p_content").val();
      var p_email = $("#signup_p_email").val();

      if ((p_group_name && p_name && p_type && p_content && p_name && p_email) != "") {
        $.ajax('http://'+ targetIP + '/busker/register', {
          type: 'POST',
          data: {
            "account_name": signup_account_name,
            "account_email": signup_account_email,
            "p_group_name": p_group_name,
            "p_name": p_name,
            "p_type": p_type,
            "p_content": p_content,
            "p_img": p_img,
            "p_webpage": p_webpage,
            "p_email": p_email
          },
          success: function(result) {
            if (result == 0) {
              swal({
                title: "Success!",
                text: "Now you can log in!",
                type: "info",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
              }, function(){
                $(".home").trigger('click');
              });
            } else {
              swal({
                title: "Oops...",
                text: "The account is registered!",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
              });
            }
          }
        });
      } else {
        swal({
          title: "Oops...",
          text: "Busker Information should not be empty!",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "OK",
          closeOnConfirm: true,
        });
      }
    });
  }

  function calLastVisitTime() {
    latest_visit_time = +new Date();
    console.log(latest_visit_time);
    console.log(last_visit_time);
    if(last_visit_time === 0) {
      last_visit_time = latest_visit_time;
      return true;
    } else {
      last_visit_time = latest_visit_time;
      var hours = Math.abs(latest_visit_time - last_visit_time) / 36e5;
      console.log("The last visiting time is " + hours + " before");
      return ((hours > 1) ? true : false);
    }
  }
})

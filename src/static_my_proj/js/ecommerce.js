$(document).ready(function() {
    // Contact Form Handler
    var contactForm = $("#contact-form");
    var contactFormMethod = contactForm.attr("method")
    var contactFormEndpoint = contactForm.attr("action")

    function displaySubmitting(submitBtn, defaultText, doSubmit) {
      if (doSubmit){
        submitBtn.addClass("disabled");
        submitBtn.html("<i class='fa fa-spin fa-spinner'></i> Sending...");
      } else {
        submitBtn.removeClass("disabled");
        submitBtn.html(defaultText)
      }
    }

    contactForm.submit(function(event){
      event.preventDefault();

      var contactFormSubmitBtn = contactForm.find("[type='submit']");
      var contactFormSubmitBtnTxt = contactFormSubmitBtn.text()
      var contactFormData = contactForm.serialize()
      var thisForm = $(this)
      displaySubmitting(contactFormSubmitBtn, "", true)
      setTimeout(function(){
            displaySubmitting(contactFormSubmitBtn, contactFormSubmitBtnTxt, false)
          }, 500);

      $.ajax({
        method: contactFormMethod,
        url: contactFormEndpoint,
        data: contactFormData,
        success: function(data) {
          thisForm[0].reset();
          $.alert({
            title: "Success!",
            content: data.message,
            theme: "modern"
          });
          
        },
        error: function(error) {
          console.log(error.responseJSON);
          var jsonData = error.responseJSON
          var msg = ""
          $.each(jsonData, function(key, value){
            msg += key + ":" + value[0].message + "<br/>"
          });
          $.alert({
            title: "Error!",
            content: msg,
            theme: "modern"
          });

        }
      });
    });


    // Auto Search
    var searchForm = $("#search-form");
    var searchInput = searchForm.find("[name='q']");
    var searchBtn = searchForm.find("[type='submit']");
    var typingTimer;
    var typingInterval = 500;

    searchInput.keyup(function(event){
      clearTimeout(typingTimer);
      typingTimer = setTimeout(performSearch, typingInterval);
    });

    searchInput.keydown(function(event){
      clearTimeout(typingTimer);
    });

    function displaySearching() {
      searchBtn.addClass("disabled");
      searchBtn.html("<i class='fa fa-spin fa-spinner'></i> Searching...");
    }

    function performSearch() {
      displaySearching();
      query = searchInput.val();
      setTimeout(function() {
        window.location.href = "/search/?q=" + query;
      }, 1000);
    }

    var productForm = $(".form-product-ajax");

    // Override Submit Product Form
    productForm.submit(function(event) {
      event.preventDefault();
      var thisForm = $(this);
      // var actionEndpoint = thisForm.attr("action");
      var actionEndpoint = thisForm.attr("data-endpoint");
      var httpMethod = thisForm.attr("method");
      var formData = thisForm.serialize();

      $.ajax({
        url: actionEndpoint,
        method: httpMethod,
        data: formData,
        success: function(data){
          var submitSpan = thisForm.find(".submit-span");

          if (data.added) {
            submitSpan.html(
              "In cart <button type='submit' class='btn btn-link'>Remove ?</button>"
            );
          } else {
            submitSpan.html(
              "<button type='submit' class='btn btn-success'>Add to cart</button>"
            );
          }

          var navbarCount = $(".navbar-cart-count");
          navbarCount.text(data.cartItemCount);
          var currentPath = window.location.href;

          if (currentPath.indexOf("cart") != -1) {
            refreshCart();
          }

        },
        error: function(errorData){
          $.alert({
            title: "Error!",
            content: "An error ocurred",
            theme: "modern"
          });
        }
      });
    });

    function refreshCart() {
      console.log("In Current Cart");
      var cartTable = $(".cart-table");
      var cartBody = cartTable.find(".cart-body");
      var cartSubtotal = cartTable.find(".cart-subtotal");
      var cartTotal = cartTable.find(".cart-total");
      var currentUrl = window.location.href
      

      var refreshCartUrl = "/api/cart" ;
      var refreshCartMethod = "GET";
      var data = {};

      $.ajax({
        url: refreshCartUrl,
        method: refreshCartMethod,
        data: data,
        success: function(data) {
          var hiddenCartItemRemoveForm = $(".cart-item-remove-form")
          cartBody.html("");
          if (data.products.length > 0){
            i = data.products.length

            $.each(data.products, function(index, value){
              var newCartItemRemove = hiddenCartItemRemoveForm.clone()
              newCartItemRemove.css("display", "block")
              newCartItemRemove.find(".cart-item-product-id").val(value.id)
              cartBody.prepend("<tr><td scope=\"row\">" + i + "</td><td><a href='" + value.url + "'>" + value.name + "</a>" + newCartItemRemove.html() + "</td><td>" + value.price + "</tr>");
              i--
            });

          cartSubtotal.text(data.subtotal)
          cartTotal.text(data.total);
          } else {
            window.location.href = currentUrl
          }
        },
        error: function(errorData) {
          $.alert({
            title: "Error!",
            content: "An error ocurred",
            theme: "modern"
          });
        }
      });
    }

  });
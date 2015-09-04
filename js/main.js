$(document).ready(function(){

    // global settings etc.
    var europe = ['Paris', 'Munich', 'Roma'];
    var asia = ['Tokyo', 'Bejing', 'Seul'];
    var africa = ['Casablanca', 'Tunis', 'Cape Town'];
    var south_america = ['Rio de Janeiro', 'Buenos Aires', 'La Fortuna'];
    var north_america = ['Las Vegas', 'New York', 'Orlando'];

    // click handlers
    $('#search_button').click(function(event) {
        event.preventDefault();
        if ($(this).hasClass('loading')) {
            return;
        }
        $(this).addClass('round');
        setTimeout(function() {
            $('#search_button').addClass('loading');
        }, 500);
        $('.welcome_text').addClass('fadeOutUp');
        $('.choose_weather').addClass('fadeOutUp');
        $('.choose_region').addClass('fadeOutUp');
        setTimeout(function() {
            $('#search_button').removeClass('round').removeClass('loading').addClass('slide_out_up');
            $('.results_table').removeClass('hidden_down');
            $('.btn_table').removeClass('hidden_down');
            $('#table_wrapper').removeClass('hidden_down').addClass('slide_out_up');
        }, 1500);

        var weather_type_code = $('.choose_weather .active').data('value');
        var region_code = $('.choose_region .active').data('value');        

        var cities;

        switch (region_code) {
        case 'eu':
          cities = europe;
          break;
        case 'asia':
          cities = asia;
          break;
        case 'africa':
          cities = africa;
          break;
        case 'south_america':
          cities = south_america;
          break;
        case 'north_america':
          cities = north_america;
          break;
        case 'any':
          cities = europe.concat(asia, africa, south_america, north_america);
          break;
        default:
          break;
        }

        cities.forEach(function(city) {
            getWeatherByCity1Day('eng', do_smth_with_data, showError, city);
        });
        

       var min_temp, max_temp; 
       if (weather_type_code == '1') {
        min_temp = 0;
        max_temp = 15;
       }
       if (weather_type_code == '2') {
        min_temp = 14;
        max_temp = 25;
       }
       if (weather_type_code == '3') {
        min_temp = 24;
        max_temp = 35;
       }
       if (weather_type_code == '4') {
        min_temp = 35;
       }
       
   
    });

    function do_smth_with_data(data, city_name, min_temp, max_temp){
        $.each(data.list, function(){
            console.log(city_name + ' : ' + this.weather[0].description + ' '
            + Math.round(this.temp.day)); 
            
            var array_for_data = [];
            if ((Math.round(this.temp.day) > min_temp) && (Math.round(this.temp.day) < max_temp)) {
                array_for_data.push(city_name);
            } 
            console.log(array_for_data);
            // if ((Math.round(this.temp.day) > 14) && (Math.round(this.temp.day) < 25)) {
            //     array_for_data.push(city_name);
            //     console.log(array_for_data);
            // }
            // if ((Math.round(this.temp.day) > 24) && (Math.round(this.temp.day) < 35)) {
            //     array_for_data.push(city_name);
            //     console.log(array_for_data);
            // }
            // if ((Math.round(this.temp.day) > 34) {
            //     array_for_data.push(city_name);
            //     console.log(array_for_data);
            // }
        });
    }
     // - - - - - - - 



    $('.city').click(function(event) {
        event.preventDefault();
        show_city_animations();
    });
    
    
    $('.city_name').click(function () {
        getWeatherByCity5Days('eng', dataReceived, showError, $(this).text());
    });



    // API interactions
    function getWeatherByCity5Days(lang, success_function, error_function, city_name) {
        $.getJSON(
            'http://api.openweathermap.org/data/2.5/forecast/daily?q=' 
            + city_name + '&cnt=5&units=metric' + '&lang=' + lang,
            function (data) {
                success_function.call(this, data, city_name);
            }
        );
    }
    function getWeatherByCity1Day(lang, success_function, error_function, city_name) {
        $.getJSON(
            'http://api.openweathermap.org/data/2.5/forecast/daily?q=' 
            + city_name + '&cnt=1&units=metric' + '&lang=' + lang,
            function (data) {
                success_function.call(this, data, city_name);
            }
        );
    }

    function dataReceived(data, city_name) {
        var offset = (new Date()).getTimezoneOffset()*60*1000; 
        var country = data.city.country;

        $.each(data.list, function(){
            
            var localTime = new Date(this.dt*1000 - offset); 
            addWeather(
                this.weather[0].icon,
                moment(localTime).calendar(),   
                this.weather[0].description,
                Math.round(this.temp.day) + '&deg;C'
            );
        });

        $('#location').html(city_name + ', <b>' + country + '</b>'); // Додаємо локацію на сторінку
    }

    function addWeather(icon, day, condition, temp){
        var markup = '<tr>'+
                '<td>' + day + '</td>' +
                '<td>' + '<img src="images/icons/'+ 
                  icon
                  +'.png" />' + '</td>' +
                '<td>' + temp + '</td>' +
                '<td>' + condition + '</td>'
            + '</tr>';
        weather_table.insertRow(-1).innerHTML = markup; // Додаємо рядок до таблиці
    }

    function showError(msg){
        $('#error').html('Сталася помилка: ' + msg);
    }


    // animations

    setTimeout(function() {
        $('.welcome_text').removeClass('hidden_with_opacity');
    }, 200);
    setTimeout(function() {
        $('.choose_weather').removeClass('hidden_with_opacity');
    }, 500);
    setTimeout(function() {
        $('.choose_region').removeClass('hidden_with_opacity');
    }, 800);
    setTimeout(function() {
        $('#search_button').removeClass('hidden_with_opacity');
    }, 1200);


    function show_city_animations() {
        $('#search_button').removeClass('slide_out_up').addClass('fadeOutUpBig');
        $('.results_table').addClass('fadeOutUpBig');
        $('.btn_table').addClass('fadeOutUpBig');
        $('#table_wrapper').removeClass('slide_out_up').addClass('fadeOutUpBig');
        $('#wrapper_weather_table').removeClass('hidden_down').addClass('slide_out_up_big');
    }
});

$(document).ready(function(){

    // global settings etc.
    var europe = ['Paris', 'Munich', 'Roma', 'Milan', 'Barcelona', 'Vienna', 'Lviv', 'Graz', 'Monaco', 'Lisboa', 'Oslo', 'Prague', 'Warsaw', 'Athens', 'Berlin'];
    var asia = ['Tokyo', 'Bejing', 'Seul'];
    var africa = ['Casablanca', 'Tunis', 'Cape Town'];
    var south_america = ['Rio de Janeiro', 'Buenos Aires', 'La Fortuna'];
    var north_america = ['Las Vegas', 'New York', 'Orlando'];

    // click handlers
    $('#search_button').click(function(event) {
        event.preventDefault();
        $('#result tr').remove();
        if ($(this).hasClass('loading')) {
            return;
        }
        $(this).addClass('round').addClass('loading');;

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
            min_temp = 0;
            max_temp = 50;
        }

        cities.forEach(function(city) {
            getWeatherByCity1Day('eng', do_smth_with_data, showError, city, min_temp, max_temp);
        });
    });

    function do_smth_with_data(data, city_name, min_temp, max_temp){
        $.each(data.list, function(){
            if ((Math.round(this.temp.day) > min_temp) && (Math.round(this.temp.day) < max_temp)) {
                $('#result').append('<tr><td class="city"><a class="city_name" href="" name="' + city_name + '">' + city_name + '</td></tr>')
            }

            //remove loader and show table
            animate_search_form();
            
        });
    }
   
     
    $(document.body).on('click', '.city_name', function(event){
        event.preventDefault();
        show_city_animations();
        getWeatherByCity5Days('eng', dataReceived, showError, $(this).text());
        $('#wrapper_weather_table').removeClass('fadeOutDown');
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
    function getWeatherByCity1Day(lang, success_function, error_function, city_name, min_temp, max_temp) {
        $.getJSON(
            'http://api.openweathermap.org/data/2.5/forecast/daily?q=' 
            + city_name + '&cnt=1&units=metric' + '&lang=' + lang,
            function (data) {
                success_function.call(this, data, city_name, min_temp, max_temp);
            }
        );

    }

    function dataReceived(data, city_name) {
        var offset = (new Date()).getTimezoneOffset()*60*1000; 
        var country = data.city.country;
        $('#weather_table tr').remove();

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

        var icon_class = add_icons(condition);

        var markup = '<tr>'+
                '<td>' + day + '</td>' +
                '<td>' + '<i class="wi ' + icon_class + '"></i>' + '</td>' +
                '<td>' + temp + '</td>' +
                '<td>' + condition + '</td>'
            + '</tr>';
            
        
        function add_icons(condition) {
            if(condition == 'clear sky') {
                return 'wi-day-sunny';
            }
            if(condition == 'few clouds') {
                return 'wi-day-cloudy';
            }
            if(condition == 'scattered clouds') {
                return 'wi-cloud';
            }
            if((condition == 'broken clouds') || (condition == 'overcast clouds')) {
                return 'wi-cloudy';
            }
            if((condition == 'shower rain') || (condition == 'light intensity drizzle') ||(condition == 'drizzle')
            || (condition == 'heavy intensity drizzle') || (condition == 'light intensity drizzle rain') ||
            (condition == 'drizzle rain') || (condition == 'heavy intensity drizzle rain') || 
            (condition == 'shower rain and drizzle') || (condition == 'heavy shower rain and drizzle')
            || (condition == 'shower drizzle') || (condition =='light intensity shower rain') || 
            (condition =='heavy intensity shower rain') || (condition == 'ragged shower rain')) {
                return 'wi-showers';
            }
            if((condition == 'rain') || (condition == 'light rain') || (condition == 'moderate rain') ||
            (condition == 'heavy intensity rain') || (condition == 'very heavy rain') || (condition == 'extreme rain')) {
                return 'wi-rain';
            }
            if((condition == 'thunderstorm') || (condition == 'thunderstorm with light rain') || 
            (condition == 'thunderstorm with rain') || (condition == 'thunderstorm with heavy rain') ||
            (condition == 'light thunderstorm') || (condition == 'heavy thunderstorm') || 
            (condition == 'ragged thunderstorm') || (condition == 'thunderstorm with light drizzle') || 
            (condition == 'thunderstorm with drizzle') || (condition == 'thunderstorm with heavy drizzle')) {
                return 'wi-thunderstorm';
            }
            if((condition == 'snow') || (condition =='freezing rain') || (condition == 'light snow') ||
            (condition == 'heavy snow') || (condition =='sleet') || (condition == 'shower sleet') ||
            (condition == 'light rain and snow') || (condition == 'rain and snow') || (condition == 'light shower snow')
            || (condition == 'shower snow') || (condition == 'heavy shower snow')) {
                return 'wi-snow';
            }
            if(condition == 'mist') {
                return 'wi-fog';
            }
        }
        weather_table.insertRow(-1).innerHTML = markup; // Додаємо рядок до таблиці
    }
    function showError(msg){
        $('#error').html('Сталася помилка: ' + msg);
    }

   // animations

    setTimeout(function() {
        $('#search_form').removeClass('hidden_with_opacity').addClass('pulse');
    }, 200);
    function animate_search_form() {
        setTimeout(function() {
            $('#search_form').addClass('fadeOutUp');
        }, 1000);
        setTimeout(function() {
            $('#table_wrapper').removeClass('hidden_down').addClass('fadeInUp');
        }, 1500);
        setTimeout(function() {
            $('#search_button').removeClass('loading').removeClass('round');
        }, 2000);
    }
    function show_city_animations() {
        $('#search_button').addClass('fadeOutUpBig');
        $('.results_table').addClass('fadeOutUpBig');
        $('.btn_table').addClass('fadeOutUpBig');
        $('#table_wrapper').addClass('fadeOutUpBig');
        $('#wrapper_weather_table').removeClass('hidden_down').addClass('fadeInUp');
    }

    $('#back_to_new_search').click(function(event) {
        $('#table_wrapper').addClass('fadeOutDown');
        setTimeout(function() {
            $('#search_form').removeClass('fadeOutUp').addClass('fadeInDown');
        }, 1000);
    });

    $('#to_search').click(function(event) {
        $('#wrapper_weather_table').addClass('fadeOutDown');
        setTimeout(function() {
            $('#search_form').removeClass('fadeOutUp').addClass('fadeInDown');
            $('#search_button').removeClass('fadeOutUpBig');
        }, 1000);
    });
    $('.city_name').click(function(event) {
        $('#wrapper_weather_table').removeClass('fadeOutDown');
    });
    $('#to_cities').click(function(event) {
        $('#wrapper_weather_table').addClass('fadeOutDown');
        setTimeout(function() {
            $('#table_wrapper').removeClass('fadeOutDown').removeClass('fadeOutUpBig').removeClass('fadeInUp').addClass('fadeInDownBig');
        }, 500);
    });
    $('#search_button').click(function(event) {
        setTimeout(function() {
            $('#table_wrapper').removeClass('fadeOutDown').removeClass('fadeOutUpBig');
        }, 2000);
    });
    
    
});

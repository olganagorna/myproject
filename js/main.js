$(document).ready(function(){
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
        
        
    });
    $('.city').click(function(event) {
        event.preventDefault();
        $('#search_button').removeClass('slide_out_up').addClass('fadeOutUpBig');
        $('.results_table').addClass('fadeOutUpBig');
        $('.btn_table').addClass('fadeOutUpBig');
        $('#table_wrapper').removeClass('slide_out_up').addClass('fadeOutUpBig');
        $('#wrapper_weather_table').removeClass('hidden_down').addClass('slide_out_up_big');
        
    });
});

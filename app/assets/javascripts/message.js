$(function(){
  function buildHTML(message){
    var picture = message.image.url? `<img src=${message.image.url} >` : " ";
    var html =
      `<div class="message" data-message-id=${message.id}>
          <div class="upper-message">
          <div class="upper-message__user-name">
            ${message.user_name}
          </div>
          <div class="upper-message__date">
            ${message.created_at}
          </div>
        </div>
        <div class="lower-message">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </div>
        ${picture}
      </div>`
    return html;
  };
  $('.new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.messages').append(html)
      $('form')[0].reset();
      var target = $('.message').last();
      $("html,body").animate({scrollTop:target.offset().top});
      $('input').prop('disabled', false);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight});
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    });
  });

  var reloadMessages = function() {
    var presentHTML = window.location.href;
    if (presentHTML.match(/\/groups\/\d+\/messages/)){
    last_message_id = $('.message:last').data("message-id"); 
    $.ajax({
      url: 'api/messages',
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages){
      var innerHTML = '';
      messages.forEach(function(message){
        innerHTML = buildHTML(message);
        $('.messages').append(innerHTML);
        var target = $('.message').last();
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight });
      })
    })
    .fail(function(){
      alert('error');
      })
    }
    else {
      clearInterval(interval)
    };
  };
  setInterval(reloadMessages, 7000);
}); 




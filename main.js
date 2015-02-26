var addKeyPair = function (event) {
  var self = $(this);

  var group = self.parents('.form-group');
  var form = self.parents('form');

  group.clone().appendTo(form);
};

var processFormData = function (event) {
  var har = {
    log: {
      version : '1.2',
      creator : {},
      browser : {},
      entries: [],
      comment: ''
    }
  };

  var entry = {
    request: {
      method: '',
      url: '',
      httpVersion: "HTTP/1.1",
      cookies: [],
      headers: [],
      queryString: [],
      postData: {
        params: []
      },
      headersSize: 0,
      bodySize: 0,
      comment: ''
    }
  };

  $('.has-error').removeClass('has-error');

  $('.form input:not(:valid)').each(function () {
    $(this).parents('.form-group').addClass('has-error');
  });

  [{form: 'creator', parent: har.log}, {form: 'request', parent: entry.request}, {form: 'postData', parent: entry.request.postData}].forEach(function (item) {
    $('form[name="' + item.form + '"] .form-group:not(.pair) input').each(function () {
      var self = $(this);

      item.parent[self.attr('name')] = self.val();
    });
  });

  ['queryString', 'headers', 'cookies', 'postData'].forEach(function (pair) {
    var params = [];

    $('form[name="' + pair + '"] .pair input[name="name"]').slice(0, -1).each(function (index, header) {
      var value = $(header).val();

      if (value.trim() !== '') {
        params.push({name: value});
      }
    });


    $('form[name="' + pair + '"] .pair input[name="value"]').slice(0, -1).each(function (index, header) {
      if (params[index]) {
        params[index].value = $(header).val();
      }
    });

    if (pair === 'postData') {
      entry.request.postData.params = params;
    } else {
      entry.request[pair] = params;
    }
  });

  har.log.entries.push(entry);

  $('pre code').text(JSON.stringify(har, null, 2));

  hljs.highlightBlock($('pre code')[0]);
};

$('.toggle-comments').on('click', function (event) {
  $('.form').toggleClass('no-comments');
  $('.form  input[name="comment"]').attr('disabled', $(this).hasClass('active'));
});

$('form').on('click', '.form-group.pair:last-of-type .btn-success', addKeyPair);

$('form').on('focus', '.form-group.pair:last-child input', addKeyPair);

$('form').on('click', '.form-group.pair .btn-danger', function (event) {
  $(this).parents('.form-group').remove();
});

$('form').on('change', 'input', processFormData);
$('form').on('click', '.btn', processFormData);

$(document).ready(function () {
  processFormData();
});

import './assets/scss/app.scss';
import $ from 'cash-dom';


export class App {
  initializeApp() {
    const self = this;

    $('.load-username').on('click', function (e) {
      const userName = $('.username.input').val();

      fetch('https://api.github.com/users/' + userName)
        .then(response => response.json())
        .then((respJson) => {
          self.profile = respJson;
          self.updateProfile();
        })
    })

    $('.username.input').on('keyup', self.validation)
  }

  updateProfile() {
    $('#profile-name').text($('.username.input').val())
    $('#profile-image').attr('src', this.profile.avatar_url)
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login)
    $('#profile-bio').text(this.profile.bio || '(no information)')
  }

  validation() {
    const input = $('input.username');
    const btn = document.querySelector('.load-username')
    const pattern = /^([a-z0-9-_]+)$/;
    if (pattern.test(input.val())) {
      input.removeClass('not-valid')
      btn.style.pointerEvents = "auto";
    }
    else {
      input.addClass('not-valid')
      btn.style.pointerEvents = "none";
    }
  }
}

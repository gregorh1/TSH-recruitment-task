import './assets/scss/app.scss';
import $ from 'cash-dom';
import moment from 'moment';

export class App {
  initializeApp() {
    const self = this;

    $('.load-username').on('click', function (e) {
      const userName = $('.username.input').val();

      $('#spinner').removeClass('is-hidden')

      fetch('https://api.github.com/users/' + userName)
        .then(response => {
          if (!response.ok) {
            $('#spinner').addClass('is-hidden')
            throw new Error(response.status)
          }
          else return response.json()
        })
        .then((respJson) => {
          self.profile = respJson;
          self.updateProfile();
          self.updateHistory(respJson.login);
        })
        .catch(err => console.error(err))
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

  updateHistory(username) {
    const url = `https://api.github.com/users/${username}/events/public`
    
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(response.status)
        else return response.json()
      })
      .then(respJson => {
        const eventTypes = [
          'PullRequestEvent',
          'PullRequestReviewCommentEvent'
        ]
        const events = respJson.filter(event => {
          if (eventTypes.indexOf(event.type) !== -1) {
            return event
          }
        })

        let timelineElements = ''
        events.forEach((event, i) => {
          let comment = ''
          if (event.payload.comment) {
            comment = ` <a href="${event.payload.comment.html_url}">comment</a> to`
          }
          timelineElements +=
            `<div class="timeline-item ${i === 1 ? "is-primary" : ''}">
              <div class="timeline-marker ${i === 1 ? "is-primary" : ''}"></div>
              <div class="timeline-content">
                <p class="heading">${moment(event.created_at).format("MMM DD, YYYY")}</p>
                <div class="content">
                  <img src="${event.actor.avatar_url}">
                  <span>
                    <a href="${event.actor.url}">${event.actor.login}</a>
                    ${event.payload.action + comment}
                    <a href="${event.payload.pull_request.html_url}">pull request</a>
                    <p class="repo-name">
                      <a href="${event.repo.url}">${event.repo.name}</a>
                    </p>
                  </span>
                </div>
              </div>
            </div>`
        });

        $('#user-timeline').html(timelineElements)

        $('#spinner').addClass('is-hidden')
        $('.columns').removeClass('is-hidden')
      })
      .catch(err => console.error(err))
  }
}

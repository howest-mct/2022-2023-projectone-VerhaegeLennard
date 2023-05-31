const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showDevices = function (jsonObject) {
  let htmlDeviceBtns = document.querySelector('.js-devicebtns')
  let html = ""
  for (let device of jsonObject) {
    html += `<button class="c-btn js-btndevice" data-id="${device.DeviceId}">${device.Naam}</button>`
  }
  console.info(html)
  htmlDeviceBtns.innerHTML = html
  listenToBtnDevice()
}

const showHistory = function (jsonObject) {
  let htmlDeviceHistory = document.querySelector('.js-history__list')
  let html = "<table><tr><td>Timestamp</td><td>Value</td><td>Comment</td></tr>"
  for (const log of jsonObject) {
    html += `<tr>
    <td>${log.DatumTijd}</td>
    <td>${log.Waarde}</td>
    <td>${log.Commentaar}</td>
  </tr>`
  }
  html += "</table>"
  htmlDeviceHistory.innerHTML = html
}

const showNewSensorValues = function (jsonObject) {
  let htmlTempValue = document.querySelector('.js-temperature')
  let htmlCo2Value = document.querySelector('.js-co2value')
  let htmlHumidity = document.querySelector('.js-humidity')
  let htmlBrightness = document.querySelector('.js-brightness')
  htmlTempValue.innerHTML = jsonObject.temperatuur
  htmlCo2Value.innerHTML = jsonObject.eCO2
  htmlHumidity.innerHTML = jsonObject.luchtvochtigheid
  htmlBrightness.innerHTML = jsonObject.lichtintensiteit
}

const showTimeline = function (jsonObject) {
  console.log(jsonObject)
  const htmlTimeline = document.querySelector('.js-timeline')
  let html = ""
  for (const log of jsonObject) {
    console.info(log.Commentaar)
    html += `<li class="c-timeline__item">
    <div class="c-timeline__icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
            <path d="m438 816 226-226-58-58-169 169-84-84-57 57 142 142ZM240 976q-33 0-56.5-23.5T160 896V256q0-33 23.5-56.5T240 176h320l240 240v480q0 33-23.5 56.5T720 976H240Zm280-520V256H240v640h480V456H520ZM240 256v200-200 640-640Z" />
        </svg>
    </div>
    <div class="c-timeline__body">
        <time class="c-timeline__time u-color-text-lighter" datetime="${log.DatumTijd}">${log.DatumTijd}</time>
        <p class="c-timeline__action">${log.Commentaar}</p>
    </div>
</li>`
  }
htmlTimeline.innerHTML = html
}

const showError = function () {
  console.error(error);
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getDevices = function () {
  handleData(`http://192.168.168.169:5000/api/v1/devices/`, showDevices, showError)
}

const getDeviceHistory = function(id) {
  handleData(`http://192.168.168.169:5000/api/v1/devices/${id}/`, showHistory, showError)
}

const getTimeline = function() {
  handleData(`http://192.168.168.169:5000/api/v1/timeline/`, showTimeline, showError)
}
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
  socketio.on('B2F_new_sensor_values', function (jsonObject) {
    showNewSensorValues(jsonObject)
  });
  // socketio.on('B2F_new_timeline_item', function (jsonObject) {
  //   showTimeline(jsonObject)
  // });
};

const listenToBtnDevice = function () {
  btns = document.querySelectorAll('.js-btndevice')
  for (const btn of btns)
    btn.addEventListener('click', function () {
      console.log('Device ID: ',btn.getAttribute('data-id'));
      getDeviceHistory(btn.getAttribute('data-id'))
    })
}

const listenToUI = function () {};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.info('DOM geladen');

  const htmlDashboard = document.querySelector('.js-dashboard')
  const htmlHistory = document.querySelector('.js-history');

  if (htmlDashboard) {
    listenToSocket();
    getTimeline()
  }

  if (htmlHistory) {
    getDevices()
    getDeviceHistory()
  }

  listenToUI();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion
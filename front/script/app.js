const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

const listenToUI = function () {};
// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showDevices = function (jsonObject) {
  let htmldevicebtns = document.querySelector('.js-devicebtns')
  let html = ""
  for (let device of jsonObject) {
    html += `<button class="c-btn js-btndevice" data-id="${device.DeviceId}">${device.Naam}</button>`
  }
  console.info(html)
  htmldevicebtns.innerHTML = html
  listenToBtnDevice()
}

const showError = function () {
  console.error(error);
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getDeviceHistory = function(id) {
  handleData(`http://192.168.168.169:5000/api/v1/devices/${id}/`, showHistory, showError)
}
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
  socketio.on('B2F_connected', function (jsonObject) {
    console.info(jsonObject.devices)
    showDevices(jsonObject.devices)
  });
};

const listenToBtnDevice = function () {
  btns = document.querySelectorAll('.js-btndevice')
  for (const btn of btns)
    btn.addEventListener('click', function () {
      console.log('Device ID: ',btn.getAttribute('data-id'));
      getDeviceHistory()
    })
}
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.info('DOM geladen');
  listenToUI();
  listenToSocket();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion
const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

const listenToUI = function () {};
// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showDevices = function (jsonObject) {
  const HTMLdevicebtns = document.querySelector('.js-devicebtns')
  let html = ""
  for (let device of jsonObject) {
    html =+ `<button class="c-btn js-btndevice" data-id="${device.DeviceId}">${device.Naam}</button>`
  }
  HTMLdevicebtns.innerHTML = html
}
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
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
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.info('DOM geladen');
  listenToUI();
  listenToSocket();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion
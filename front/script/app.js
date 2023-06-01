const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

var ChartTemp = NaN
var minValue = -10;
var maxValue = 40;

const valueToPercent = function (value, maxValue, minValue) {
  var percentage = ((value - minValue) * 100 ) / (maxValue - minValue)
  console.log(percentage)
  return percentage
} 

// const formatter = (val) => (val * (maxValue - minValue)) / 100 + minValue;

// const valueToPercent = function(value) {
//   var percentage = ((value - minValue) * 100) / (maxValue - minValue);
//   return formatter(percentage);
// };


// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showDevices = function (jsonObject) {
  let htmlDeviceBtns = document.querySelector('.js-devicebtns')
  let html = ""
  for (let device of jsonObject) {
    html += `<button type="button" class="o-button-reset c-button c-button--meta js-btndevice" data-id="${device.DeviceId}">${device.Naam}</button>`
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
  globalThis
  let htmlTempValue = document.querySelector('.js-temperature')
  let htmlCo2Value = document.querySelector('.js-co2value')
  let htmlHumidity = document.querySelector('.js-humidity')
  let htmlBrightness = document.querySelector('.js-brightness')
  htmlTempValue.innerHTML = jsonObject.temperatuur
  minValue = -10
  maxValue = 40
  ChartTemp.updateSeries([[valueToPercent(jsonObject.temperatuur,minValue,maxValue)]])
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
    console.log(jsonObject)
    showNewSensorValues(jsonObject)
  });
  socketio.on('B2F_new_timeline', function () {
    getTimeline()
  });
};

const listenToBtnDevice = function () {
  const btns = document.querySelectorAll('.js-btndevice')
  for (const btn of btns)
    btn.addEventListener('click', function () {
      console.log('Device ID: ',btn.getAttribute('data-id'));
      getDeviceHistory(btn.getAttribute('data-id'))
    })
}

const listenToUI = function () {
  const buttons = document.querySelectorAll('.js-button')
  for (const btn of buttons)
    btn.addEventListener('click', function () {
      console.log('Button ID: ',btn.getAttribute('data-id'));
      socketio.emit('F2B_toggle_motor',{buttonId:btn.getAttribute('data-id')})
    })
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init_charts = function() {
  var optionsTemp = {
    series: [0],
    chart: {
    height: 350,
    type: 'radialBar',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
       hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24
        }
      },
      track: {
        background: '#fff',
        strokeWidth: '67%',
        margin: 0, // margin is in pixels
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35
        }
      },
  
      dataLabels: {
        show: true,
        name: {
          offsetY: -10,
          show: true,
          color: '#888',
          fontSize: '17px'
        },
        value: {
          formatter: (val) => ( val * (maxValue - Math.abs(minValue)) ) / 100 + Math.abs(minValue),
          color: '#111',
          fontSize: '36px',
          show: true,
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#ABE5A1'],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  stroke: {
    lineCap: 'round'
  },
  labels: ['°C'],
  };

  ChartTemp = new ApexCharts(document.querySelector('.js-chart_temp'), optionsTemp);
  ChartTemp.render();
};

const init = function () {
  console.info('DOM geladen');

  const htmlDashboard = document.querySelector('.js-dashboard')
  const htmlHistory = document.querySelector('.js-history');

  if (htmlDashboard) {
    listenToSocket();
    getTimeline()
    init_charts()
  }

  else if (htmlHistory) {
    getDevices()
    getDeviceHistory()
    socketio.emit('F2B_get_current_readings')
  }

  listenToUI();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion
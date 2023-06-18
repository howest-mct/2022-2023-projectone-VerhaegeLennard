const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

var TempMinValue = -10;
var TempMaxValue = 40;
var TempRange = 50;

var CO2MinValue = 350
var CO2MaxValue = 20000
var CO2Range = 19650

var BrightMinValue = 0;
var BrightMaxValue = 15000;
var BrightRange = 15000;

const userId = 1

const valueToPercent = function (value, maxValue, minValue) {
  var range = Math.abs(maxValue - minValue);
  var percentage = value / range * 100
  return percentage
}

// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showDevices = function (jsonObject) {
  let htmlDeviceBtns = document.querySelector('.js-devicebtns')
  let html = ""
  for (let device of jsonObject) {
    if (device.Naam == 'BH1750') {
      device.Naam = 'Lightintensity'
    }
    if (device.Naam == 'SGP30_CO2') {
      device.Naam = 'CO₂'
    }
    if (device.Naam == 'SGP30_TVOC') {
      device.Naam = 'Air particles'
    }
    if (device.Naam == 'DHT20_Hum') {
      device.Naam = 'Humidity'
    }
    if (device.Naam == 'DHT20_Temp') {
      device.Naam = 'Temperature'
    }
    if ([6, 7, 8, 9, 10].includes(device.DeviceId)) {
      html += `<button type="button" class="o-button-reset c-button c-button--meta js-btndevice" data-id="${device.DeviceId}">${device.Naam}</button>`
    }
  }
  htmlDeviceBtns.innerHTML = html
  listenToBtnDevice()
}

const showHistory = function (jsonObject) {
  let htmlDeviceHistory = document.querySelector('.js-history__list')
  htmlDeviceHistory.innerHTML = `Chart Loading...`
  let dataChart = []

  const meeteenheid_value = jsonObject[1]["Meeteenheid"]
  let name_value = jsonObject[1]["Naam"]
  const description_value = jsonObject[1]["Meeteenheid"]

  if (name_value == 'BH1750') {
    name_value = 'Lightintensity'
  }
  if (name_value == 'SGP30_CO2') {
    name_value = 'CO₂'
  }
  if (name_value == 'SGP30_TVOC') {
    name_value = 'Air particles'
  }
  if (name_value == 'DHT20_Hum') {
    name_value = 'Humidity'
  }
  if (name_value == 'DHT20_Temp') {
    name_value = 'Temperature'
  }

  // let html = "<table><tr><td>Timestamp</td><td>Value</td><td>Comment</td></tr>"
  for (const log of jsonObject) {
    //   html += `<tr>
    //   <td>${log.DatumTijd}</td>
    //   <td>${log.Waarde}</td>
    //   <td>${log.Commentaar}</td>
    // </tr>`

    dataChart.push({ x: log.DatumTijd, y: log.Waarde })
  }

  console.log(jsonObject)
  // html += "</table>"

  var options = {
    series: [{
      name: `${name_value}`,
      data: dataChart
    }],
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show: true,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: false,
          zoomout: true,
          pan: false,
          reset: true | '<img src="/static/icons/reset.png" width="20">'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: `${name_value} last 24h`,
      align: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val).toFixed(2);
        },
      },
      title: {
        text: `${meeteenheid_value}`
      },
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      }
    },
    // tooltip: {
    //   shared: true,
    //   y: {
    //     formatter: function (val) {
    //       return (val / 1000000).toFixed(0)
    //     }
    //   }
    // }
  };

  var chart = new ApexCharts(document.querySelector(".js-history__chart"), options);
  chart.render();
  console.log('Chart rendered')

  html = ''
  htmlDeviceHistory.innerHTML = html
}

const showNewSensorValues = function (jsonObject) {
  globalThis
  let htmlTempValue = document.querySelector('.js-temperature')
  let htmlCo2Value = document.querySelector('.js-co2value')
  let htmlHumidity = document.querySelector('.js-humidity')
  let htmlBrightness = document.querySelector('.js-brightness')
  htmlTempValue.innerHTML = Math.round((jsonObject.temperatuur + Number.EPSILON) * 100) / 100
  ChartTemp.updateSeries([[valueToPercent(jsonObject.temperatuur, TempMinValue, TempMaxValue)]])
  htmlCo2Value.innerHTML = Math.round((jsonObject.eCO2 + Number.EPSILON) * 100) / 100
  ChartCO2.updateSeries([[valueToPercent(jsonObject.eCO2, CO2MinValue, CO2MaxValue)]])
  htmlHumidity.innerHTML = Math.round((jsonObject.luchtvochtigheid + Number.EPSILON) * 100) / 100
  ChartHum.updateSeries([jsonObject.luchtvochtigheid])
  htmlBrightness.innerHTML = Math.round((jsonObject.lichtintensiteit + Number.EPSILON) * 100) / 100
  ChartBright.updateSeries([[valueToPercent(jsonObject.lichtintensiteit, BrightMinValue, BrightMaxValue)]])
}

const showTimeline = function (jsonObject) {
  console.log(jsonObject)
  const htmlTimeline = document.querySelector('.js-timeline')
  let html = ""
  for (const log of jsonObject) {
    if (log.ActieId == 11) {
      icon = `<div class="c-timeline__icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm0-60h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96ZM220-140v-434 434Z"/></svg>
  </div>`
    }
    if (log.ActieId == 10) {
      icon = `<div class="c-timeline__icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-140h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM220-140v-434 434Zm0 60q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h330v-96q0-78.85 55.606-134.425Q661.212-920 740.106-920T874.5-864.425Q930-808.85 930-730h-60q0-54-37.882-92-37.883-38-92-38Q686-860 648-822.083 610-784.167 610-730v96h130q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Z"/></svg>
  </div>`
    }
    if (log.ActieId == 2) {
      icon = icon = `<div class="c-timeline__icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M285-80v-368q-52-11-88.5-52.5T160-600v-280h60v280h65v-280h60v280h65v-280h60v280q0 58-36.5 99.5T345-448v368h-60Zm415 0v-320H585v-305q0-79 48-127t127-48v800h-60Z"/></svg>
  </div>`
    }
    html += `<li class="c-timeline__item">
    <div class="c-timeline__icon">
        ${icon}
    </div>
    <div class="c-timeline__body">
        <time class="c-timeline__time u-color-text-lighter" datetime="${log.DatumTijd}">${log.DatumTijd}</time>
        <p class="c-timeline__action">${log.Commentaar}</p>
    </div>
</li>`
  }
  htmlTimeline.innerHTML = html
}

const showConfig = function (jsonObject) {
  console.log(jsonObject)
  htmlDoorModus = document.querySelector('.js-door-setting')
  modusDeur = jsonObject.Modus
  if (modusDeur == 1) {
    htmlDoorModus.innerHTML = `Door controlled manually`
    showConfigDoorTime(jsonObject.OpenTijd, jsonObject.SluitTijd)
  }
  if (modusDeur == 0) {
    htmlDoorModus.innerHTML = `Door controlled automaticaly`
    hideConfigDoorTime()
  }
  htmlUsername = document.querySelector('.js-username')
  htmlFeedingTime = document.querySelector('.js-feedingtime')
  htmlUsername.innerHTML = `${jsonObject.GebruikersNaam}'s Chicken Coop`
  const tijdTotVoer = getTimeDifference(jsonObject.VoederTijd)
  console.log(tijdTotVoer)
  htmlFeedingTime.innerHTML = `Time until next feeding: <strong>${tijdTotVoer.hours}u ${tijdTotVoer.minutes}min</strong>`
}

const showTimeForm = function () {
  console.log('toon form')
  document.querySelector('.js-time_selection').innerHTML = `<h2 class="u-mb-clear">Time Selection</h2>
  <div>
    <label for="time1">Opening:</label>
    <input class="js-opentime-selection js-config-input" type="time" id="time1" name="time1" data-id="OpenTijd"><br>
  </div>
  <div>
    <label for="time2">Closing</label>
    <input class="js-closetime-selection js-config-input" type="time" id="time2" name="time2" data-id="SluitTijd"><br>
  </div>`
  listenToTimeSelection()
}

const hideTimeForm = function () {
  console.log('remove form')
  document.querySelector('.js-time_selection').innerHTML = ``
}

const showConfigDoorTime = function (opentijd, sluittijd) {
  document.querySelector('.js-dash-door-time').innerHTML = `<div>Opening - ${opentijd}</div>
  <div>Closing - ${sluittijd}</div><div>Press 'edit' to use automatic controll</div>`
}

const hideConfigDoorTime = function () {
  document.querySelector('.js-dash-door-time').innerHTML = `Press 'edit' to use manual controll`
}

const showDoorIcon = function (jsonObject) {
  console.log(jsonObject)
  if (jsonObject.status == 'opened') {
    document.querySelector('.js-door-button').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-140h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM220-140v-434 434Zm0 60q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h330v-96q0-78.85 55.606-134.425Q661.212-920 740.106-920T874.5-864.425Q930-808.85 930-730h-60q0-54-37.882-92-37.883-38-92-38Q686-860 648-822.083 610-784.167 610-730v96h130q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Z"/></svg><p class="u-mb-clear">Press to <strong>close</strong> door</p>`
  }
  if (jsonObject.status == 'closed') {
    document.querySelector('.js-door-button').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm0-60h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96ZM220-140v-434 434Z"/></svg><p class="u-mb-clear">Press to <strong>open</strong> door</p>`
  }
}

const showError = function () {
  console.error(error);
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
const addConfigPopup = function () {
  document.querySelectorAll('.js-toggle-configuration').forEach(function (el) {
    el.addEventListener('click', function () {
      document.body.classList.toggle('has-popup');
    });
  });
}


const addMobileMenu = function () {
  const elements = document.querySelectorAll('.js-toggle-menu');
  elements.forEach(function (element) {
    element.addEventListener('click', function () {
      document.body.classList.toggle('has-mobile-nav');
      console.log('nav');
    });
  });
};

const getTimeDifference = function (targetTime) {
  var currentTime = new Date(); // Step 1

  // Step 2: Parse the target time
  var targetHour = parseInt(targetTime.split(':')[0]);
  var targetMinute = parseInt(targetTime.split(':')[1]);
  var targetDateTime = new Date();
  targetDateTime.setHours(targetHour);
  targetDateTime.setMinutes(targetMinute);

  if (targetDateTime < currentTime) {
    targetDateTime.setDate(targetDateTime.getDate() + 1); // Move to the next day
  }

  var timeDifferenceMs = targetDateTime.getTime() - currentTime.getTime();

  var hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
  var minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours: hours, minutes: minutes };
}

// Usage example
var targetTime = '14:30';
var timeDifference = getTimeDifference(targetTime);
console.log(timeDifference.hours + ' hours and ' + timeDifference.minutes + ' minutes');

// #endregion

// #region ***  Data Access - get___                     ***********
const getDevices = function () {
  handleData(`http://${lanIP}/api/v1/devices/`, showDevices, showError)
}

// const getDevicesDetails = function (id) {
//   handleData(`http://${lanIP}/api/v1/devices/${id}/details/`, showError)
// }

const getDeviceHistory = function (id) {
  handleData(`http://${lanIP}/api/v1/devices/${id}/`, showHistory, showError)
}

const getTimeline = function () {
  handleData(`http://${lanIP}/api/v1/timeline/`, showTimeline, showError)
}

const getUserConfig = function (id) {
  handleData(`http://${lanIP}/api/v1/config/${id}/`, showConfig, showError)
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
  socketio.on('B2F_new_timeline', function () {
    getTimeline()
  });
  socketio.on('B2F_current_door_icon', function (jsonObject) {
    showDoorIcon(jsonObject)
  });
  socketio.on('B2F_config_update', function () {
    getUserConfig(userId)
  })
};

const listenToBtnDevice = function () {
  const btns = document.querySelectorAll('.js-btndevice')
  for (const btn of btns)
    btn.addEventListener('click', function () {
      console.log('Device ID: ', btn.getAttribute('data-id'));
      getDeviceHistory(btn.getAttribute('data-id'))
    })
}
const listenToUIDetail = function () {
}

const listenToPowerbutton = function () {
  const pwrbuttons = document.querySelectorAll('.js-powerbutton')
  for (const pwrbtn of pwrbuttons) {
    pwrbtn.addEventListener('click', function () {
      console.log('Powerbutton Pressed, system shutting down...');
      socketio.emit('F2B_system_shutdown')
    })
  }
}

const listenToUIDash = function () {
  const buttons = document.querySelectorAll('.js-button')
  for (const btn of buttons)
    btn.addEventListener('click', function () {
      console.log('Button ID: ', btn.getAttribute('data-id'));
      socketio.emit('F2B_toggle_motor', { buttonId: btn.getAttribute('data-id') })
    })

  const radiobuttonsTimeMode = document.querySelectorAll('.js-time_mode_selection')
  for (const radiobutton of radiobuttonsTimeMode)
    radiobutton.addEventListener('click', function () {
      if (radiobutton.getAttribute('data-id') == 'manual') {
        showTimeForm()
      }
      if (radiobutton.getAttribute('data-id') == 'auto') {
        hideTimeForm()
      }
      if (document.querySelector('.js-config-form').classList.contains('ListenerAdded')) {
        console.info('Listener already added')
      } else {
        listenToPopupSubmit()
      }

    })
  // const editBtn = document.querySelector('.js-btnedit')
  // editBtn.addEventListener('click', function () {
  //   showConfigPopup()
  // })
};

const listenToPopupSubmit = function () {
  const formSubmit = document.querySelector('.js-submit-config')
  formSubmit.addEventListener('click', function () {
    var dictSettings = {};
    dictSettings["user"] = userId
    const modus = document.querySelector('input[name="TimeMode"]:checked').value
    dictSettings["Modus"] = modus

    // .push({
    //   "Modus": modus
    // });
    const inputs = document.querySelectorAll('.js-config-input')
    for (const input of inputs) {
      if (input.type == 'time') {
        const dict_key = input.getAttribute('data-id')
        console.log(dict_key)
        dictSettings[dict_key] = input.value

        // dictSettings.push({
        //   dict_key: input.value
        // });

      }
    }
    console.log(dictSettings)
    socketio.emit('F2B_new_config', dictSettings)
  })
  document.querySelector('.js-config-form').classList.add('ListenerAdded')
}

const listenToTimeSelection = function () {
  // const opentimeSelection = document.querySelector('js-opentime-selection')
  // opentimeSelection.addEventListener('click', function () {
  //   console.log(opentimeSelection.value)
  // })

  // const closetimeSelection = document.querySelector('js-closetime-selection').value
  // closetimeSelection.addEventListener('click', function () {
  //   console.log(closetimeSelection.value)
  // })
}

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init_charts_dash = function () {
  // var optionsTemp = {
  //   series: [0],
  //   chart: {
  //   height: 350,
  //   type: 'radialBar',
  //   toolbar: {
  //     show: false
  //   }
  // },
  // plotOptions: {
  //   radialBar: {
  //     startAngle: -90,
  //     endAngle: 89,
  //      hollow: {
  //       margin: 5,
  //       size: '70%',
  //       background: '#fff',
  //       image: undefined,
  //       imageOffsetX: 0,
  //       imageOffsetY: 0,
  //       position: 'front',
  //       dropShadow: {
  //         enabled: true,
  //         top: 3,
  //         left: 0,
  //         blur: 4,
  //         opacity: 0.24
  //       }
  //     },
  //     track: {
  //       background: '#fff',
  //       strokeWidth: '67%',
  //       margin: 0, // margin is in pixels
  //       dropShadow: {
  //         enabled: true,
  //         top: -3,
  //         left: 0,
  //         blur: 4,
  //         opacity: 0.35
  //       }
  //     },

  //     dataLabels: {
  //       show: true,
  //       name: {
  //         offsetY: -50,
  //         show: true,
  //         color: '#000  ',
  //         fontSize: '17px'
  //       },
  //       value: {
  //         formatter: (val) => val/100*range,
  //         color: '#111',
  //         fontSize: '36px',
  //         show: true,
  //       }
  //     }
  //   }
  // },
  // fill: {
  //   type: 'gradient',
  //   gradient: {
  //     shade: 'dark',
  //     type: 'horizontal',
  //     shadeIntensity: 0.5,
  //     gradientToColors: ['#ff5f59'],
  //     inverseColors: false,
  //     opacityFrom: 1,
  //     opacityTo: 1,
  //     stops: [0, 100]
  //   }
  // },
  // stroke: {
  //   lineCap: 'round'
  // },
  // labels: ['°C'],
  // };
  var optionsTemp = {
    series: [0],
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            show: true,
            color: '#000',
            fontSize: '17px'
          },
          value: {
            formatter: (val) => val / 100 * TempRange,
            offsetY: -2,
            fontSize: '22px',
            show: true
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ff0000'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100]
      },
    },
    labels: ['°C'],
  };
  var optionsHum = {
    series: [0],
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            show: true,
            color: '#000',
            fontSize: '17px'
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
            show: true
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ff0000'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100]
      },
    },
    labels: ['%'],
  };
  var optionsCO2 = {
    series: [0],
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            show: true,
            color: '#000',
            fontSize: '17px'
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
            show: true
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ff0000'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100]
      },
    },
    labels: ['PPM'],
  };
  var optionsBright = {
    series: [0],
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            show: true,
            color: '#000',
            fontSize: '17px'
          },
          value: {
            formatter: (val) => val / 100 * BrightRange,
            offsetY: -2,
            fontSize: '22px',
            show: true
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ff0000'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100]
      },
    },
    labels: ['Lux'],
  };

  ChartTemp = new ApexCharts(document.querySelector('.js-chart_temp'), optionsTemp);
  ChartHum = new ApexCharts(document.querySelector('.js-chart_hum'), optionsHum);
  ChartCO2 = new ApexCharts(document.querySelector('.js-chart_co0'), optionsCO2);
  ChartBright = new ApexCharts(document.querySelector('.js-chart_bright'), optionsBright);
  ChartTemp.render();
  ChartHum.render();
  ChartCO2.render();
  ChartBright.render();
};

const init = function () {
  console.info('DOM geladen');

  const htmlDashboard = document.querySelector('.js-dashboard')
  const htmlHistory = document.querySelector('.js-history');

  if (htmlDashboard) {
    listenToSocket();
    getUserConfig(userId)
    getTimeline()
    init_charts_dash()
    addConfigPopup()
    listenToUIDash();
    addMobileMenu()
  }

  else if (htmlHistory) {
    getDevices()
    // getDeviceHistory()
    socketio.emit('F2B_get_current_readings')
    listenToUIDetail()
    addMobileMenu()
  }

  listenToPowerbutton()
};

document.addEventListener('DOMContentLoaded', init);
// #endregion